import { stripe } from './_lib/stripe.js';
import { supabaseAdmin } from './_lib/supabase-admin.js';
import { readRawBody } from './_lib/body.js';

// NOTE: No `export const config = { api: { bodyParser: false } }` here.
// That pattern is Next.js-only and has NO effect on plain Vercel Serverless Functions.
// readRawBody() reads directly from the request stream, which is the correct
// approach for Stripe signature verification in non-Next.js Vercel functions.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const sig = req.headers['stripe-signature'];
    if (!sig) {
        return res.status(400).json({ error: 'Missing stripe-signature header.' });
    }

    // Read raw bytes before any parsing — required for Stripe HMAC signature verification
    const buf = await readRawBody(req);

    let event;
    try {
        event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).json({ error: 'Webhook signature non valida.' });
    }

    try {
        switch (event.type) {

            case 'checkout.session.completed': {
                const session = event.data.object;
                const userId = session.metadata?.user_id;

                // Support both booking_ids (multi-cart) and legacy booking_id (single)
                const rawIds = session.metadata?.booking_ids || session.metadata?.booking_id || '';
                const bookingIds = rawIds.split(',').map(s => s.trim()).filter(Boolean);

                if (bookingIds.length === 0) {
                    console.warn('checkout.session.completed: no booking ids in metadata');
                    break;
                }

                // Confirm all bookings in this checkout
                await supabaseAdmin
                    .from('bookings')
                    .update({
                        status: 'confermata',
                        payment_status: 'paid',
                        stripe_payment_intent_id: session.payment_intent,
                    })
                    .in('id', bookingIds);

                // Fetch booking data for audit records
                const { data: bookings } = await supabaseAdmin
                    .from('bookings')
                    .select('id, user_id, property_id, activity_id, platform_fee, manager_payout')
                    .in('id', bookingIds);

                if (bookings?.length) {
                    const propertyIds = [...new Set(bookings.map(b => b.property_id).filter(Boolean))];
                    const activityIds = [...new Set(bookings.map(b => b.activity_id).filter(Boolean))];
                    const [propsRes, actsRes] = await Promise.all([
                        propertyIds.length
                            ? supabaseAdmin.from('properties').select('id, owner_id').in('id', propertyIds)
                            : { data: [] },
                        activityIds.length
                            ? supabaseAdmin.from('activities').select('id, owner_id').in('id', activityIds)
                            : { data: [] },
                    ]);
                    const ownerByProperty = Object.fromEntries((propsRes.data || []).map(p => [p.id, p.owner_id]));
                    const ownerByActivity = Object.fromEntries((actsRes.data || []).map(a => [a.id, a.owner_id]));

                    const paymentRows = bookings.map(b => ({
                        booking_id: b.id,
                        stripe_payment_intent_id: session.payment_intent,
                        amount: b.platform_fee + b.manager_payout,
                        platform_fee: b.platform_fee,
                        manager_payout: b.manager_payout,
                        currency: 'eur',
                        status: 'completed',
                        manager_stripe_account_id: null,
                        guest_user_id: b.user_id,
                        manager_user_id: ownerByProperty[b.property_id] ?? ownerByActivity[b.activity_id] ?? null,
                    }));
                    await supabaseAdmin.from('payments').insert(paymentRows);
                }

                // Upgrade to premium if membership was purchased
                if (session.metadata?.has_membership === 'true' && userId) {
                    await supabaseAdmin
                        .from('profiles')
                        .update({ is_premium: true })
                        .eq('id', userId);
                    console.log(`User ${userId} upgraded to premium`);
                }

                console.log(`Bookings confirmed: ${bookingIds.join(', ')} (PI: ${session.payment_intent})`);
                break;
            }

            case 'checkout.session.expired': {
                const session = event.data.object;
                const rawIds = session.metadata?.booking_ids || session.metadata?.booking_id || '';
                const bookingIds = rawIds.split(',').map(s => s.trim()).filter(Boolean);
                if (bookingIds.length === 0) break;

                await supabaseAdmin
                    .from('bookings')
                    .update({ status: 'cancellata', payment_status: 'failed' })
                    .in('id', bookingIds);

                console.log(`Bookings expired: ${bookingIds.join(', ')}`);
                break;
            }

            case 'account.updated': {
                const account = event.data.object;

                const { error } = await supabaseAdmin
                    .from('profiles')
                    .update({
                        stripe_onboarding_complete: account.details_submitted,
                        stripe_charges_enabled: account.charges_enabled,
                    })
                    .eq('stripe_account_id', account.id);

                if (error) {
                    console.error('account.updated profile sync error:', error);
                } else {
                    console.log(`Stripe account ${account.id} synced — charges_enabled: ${account.charges_enabled}`);
                }
                break;
            }

            case 'charge.refunded': {
                const charge = event.data.object;
                const paymentIntentId = charge.payment_intent;
                if (!paymentIntentId) break;

                await supabaseAdmin
                    .from('bookings')
                    .update({ status: 'cancellata', payment_status: 'refunded' })
                    .eq('stripe_payment_intent_id', paymentIntentId);

                await supabaseAdmin
                    .from('payments')
                    .update({ status: 'refunded' })
                    .eq('stripe_payment_intent_id', paymentIntentId);

                console.log(`Refund processed for PI: ${paymentIntentId}`);
                break;
            }

            default:
                // Return 200 for unhandled events so Stripe doesn't retry indefinitely
                console.log(`Unhandled webhook event type: ${event.type}`);
        }

        return res.status(200).json({ received: true });
    } catch (err) {
        console.error('Webhook handler error:', err);
        return res.status(500).json({ error: 'Webhook processing failed.' });
    }
}
