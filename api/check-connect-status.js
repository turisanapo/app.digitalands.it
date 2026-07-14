import { supabaseAdmin } from './_lib/supabase-admin.js';
import { requireUser } from './_lib/auth.js';

export default async function handler(req, res) {
    const user = await requireUser(req, res, 'GET');
    if (!user) return;

    try {
        const { data: profile, error } = await supabaseAdmin
            .from('profiles')
            .select('stripe_account_id, stripe_onboarding_complete, stripe_charges_enabled')
            .eq('id', user.id)
            .single();

        if (error || !profile) {
            return res.status(200).json({
                hasAccount: false,
                onboardingComplete: false,
                chargesEnabled: false,
            });
        }

        return res.status(200).json({
            hasAccount: !!profile.stripe_account_id,
            onboardingComplete: profile.stripe_onboarding_complete || false,
            chargesEnabled: profile.stripe_charges_enabled || false,
        });
    } catch (err) {
        console.error('Connect status error:', err);
        return res.status(500).json({ error: 'Errore nel controllo dello stato.' });
    }
}
