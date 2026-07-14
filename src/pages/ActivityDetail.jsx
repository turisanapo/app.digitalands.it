import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { supabase } from '../lib/supabase';
import StarRating from '../components/StarRating';
import ReviewSection from '../components/ReviewSection';
import ImageGallery from '../components/ImageGallery';

export default function ActivityDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useBookings();

    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ratingData, setRatingData] = useState({ avg: 0, count: 0 });
    const [bookingDate, setBookingDate] = useState('');
    const [bookingStatus, setBookingStatus] = useState('idle'); // idle | success
    const [step, setStep] = useState('select'); // 'select' or 'confirm'

    useEffect(() => {
        async function fetchActivity() {
            setLoading(true);
            const { data, error } = await supabase
                .from('activities')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setActivity(data);
            }
            setLoading(false);
        }

        async function fetchRating() {
            const { data, error } = await supabase
                .from('reviews')
                .select('rating')
                .eq('entity_type', 'activity')
                .eq('entity_id', id);

            if (!error && data && data.length > 0) {
                const avg = data.reduce((acc, r) => acc + r.rating, 0) / data.length;
                setRatingData({ avg, count: data.length });
            }
        }

        fetchActivity();
        fetchRating();
    }, [id]);

    const [guests, setGuests] = useState(1);
    const [timeSlot, setTimeSlot] = useState('');
    const totalPrice = activity ? activity.price * guests : 0;
    const slots = activity?.slots?.length ? activity.slots : ['09:00', '11:00', '14:00', '16:00'];
    const today = new Date().toISOString().split('T')[0];

    function handleConfirm() {
        if (!user) {
            navigate(`/auth?redirect=/activity/${id}`);
            return;
        }
        if (!bookingDate) return;

        addToCart({
            activityId: activity.id,
            activityName: activity.name,
            activityImage: activity.image_url || activity.images?.[0],
            checkIn: bookingDate,
            timeSlot,
            guests: guests,
            totalPrice: totalPrice,
            category: activity.category,
            emoji: activity.emoji
        });
        setBookingStatus('success');
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-textMuted">
                <p className="text-sm font-mono mb-4">Attività non trovata.</p>
                <button onClick={() => navigate(-1)} className="btn-ghost text-sm">← Torna indietro</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 md:px-10">
            <div className="max-w-content mx-auto">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-8 text-xs font-mono text-textMuted">
                    <Link to="/" className="hover:text-accent transition-colors">Home</Link>
                    <span>›</span>
                    <Link to="/activities" className="hover:text-accent transition-colors">Attività</Link>
                    <span>›</span>
                    <span className="text-textPrimary">{activity.name}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
                    {/* LEFT — Activity info */}
                    <div>
                        {/* Image Gallery */}
                        <div className="mb-12">
                            <ImageGallery
                                images={activity.images?.length > 0 ? activity.images : [activity.image_url]}
                                alt={activity.name}
                            />
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                            <span style={{ fontSize: '2rem' }}>{activity.emoji}</span>
                            <div className="section-chip">{activity.category.toUpperCase()}</div>
                        </div>

                        <h1 className="font-serif text-textPrimary mb-4" style={{ fontSize: '2.5rem', lineHeight: 1.1 }}>
                            {activity.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex items-center gap-2">
                                <StarRating rating={Math.round(ratingData.avg)} size={20} />
                                {ratingData.count > 0 && (
                                    <span className="text-sm font-bold text-accent">{ratingData.avg.toFixed(1)}</span>
                                )}
                            </div>
                            <span className="text-textMuted text-sm">| {activity.duration}</span>
                        </div>

                        <div className="prose prose-invert mb-10">
                            <p className="text-lg text-textPrimary leading-relaxed opacity-90">{activity.description}</p>
                        </div>

                        {activity.meeting_point && (
                            <div className="p-6 rounded-xl mb-10" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
                                <h3 className="text-xs font-mono tracking-widest uppercase text-accent mb-4">Punto di Incontro</h3>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 text-xl">📍</div>
                                    <div>
                                        <p className="text-textPrimary font-medium mb-1">{activity.meeting_point}</p>
                                        {activity.meeting_point_url && (
                                            <a href={activity.meeting_point_url} target="_blank" rel="noopener noreferrer" className="text-xs text-accent underline">
                                                Apri su Google Maps
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div id="reviews">
                            <ReviewSection entityType="activity" entityId={activity.id} />
                        </div>
                    </div>

                    {/* RIGHT — Booking Sidebar */}
                    <div className="relative">
                        <div className="sticky top-24 p-8 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
                            <div className="mb-6">
                                <span className="text-xs text-textMuted">prezzo per persona</span>
                                <div className="text-3xl font-serif text-textPrimary">€{activity.price}</div>
                            </div>

                            {bookingStatus === 'success' ? (
                                <div className="text-center py-6">
                                    <div className="text-4xl mb-4">✅</div>
                                    <Link to="/dashboard" className="btn-gold w-full text-center py-3 block">Vai alla Dashboard</Link>
                                </div>
                            ) : (
                                <>
                                    {step === 'select' ? (
                                        <>
                                            <div className="space-y-4 mb-8">
                                                <div>
                                                    <label className="text-[10px] font-mono text-textMuted uppercase tracking-widest block mb-2">Seleziona Data</label>
                                                    <input
                                                        type="date"
                                                        min={today}
                                                        value={bookingDate}
                                                        onChange={(e) => setBookingDate(e.target.value)}
                                                        className="w-full bg-surface-2 border border-border-light rounded-lg px-4 py-3 text-sm text-textPrimary focus:border-accent outline-none"
                                                        style={{ colorScheme: 'dark' }}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-mono text-textMuted uppercase tracking-widest block mb-2">Orario</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {slots.map(s => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => setTimeSlot(s)}
                                                                className="px-4 py-2 rounded-lg text-xs font-mono transition-all"
                                                                style={{
                                                                    border: timeSlot === s ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                                                                    background: timeSlot === s ? 'var(--accent-dim)' : 'transparent',
                                                                    color: timeSlot === s ? 'var(--accent)' : 'var(--text-muted)',
                                                                }}
                                                            >
                                                                {s}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-mono text-textMuted uppercase tracking-widest block mb-1">Partecipanti</label>
                                                    <div className="flex items-center gap-4">
                                                        <button onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-10 h-10 rounded-lg border border-border-light flex items-center justify-center text-textMuted hover:text-accent hover:border-accent transition-all">−</button>
                                                        <span className="font-mono text-textPrimary">{guests}</span>
                                                        <button onClick={() => setGuests(g => Math.min(10, g + 1))} className="w-10 h-10 rounded-lg border border-border-light flex items-center justify-center text-textMuted hover:text-accent hover:border-accent transition-all">+</button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-border space-y-2 mb-8">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-textMuted">€{activity.price} × {guests}</span>
                                                    <span className="text-textPrimary">€{totalPrice}</span>
                                                </div>
                                                <div className="flex justify-between text-lg font-serif pt-2">
                                                    <span className="text-textPrimary">Totale</span>
                                                    <span className="text-accent">€{totalPrice}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    if (!bookingDate || !timeSlot) {
                                                        alert('Seleziona data e orario per continuare.');
                                                        return;
                                                    }
                                                    setStep('confirm');
                                                }}
                                                className="btn-gold w-full py-4 text-sm uppercase tracking-widest font-bold"
                                            >
                                                PRENOTA ORA →
                                            </button>
                                        </>
                                    ) : (
                                        <div className="animate-fade-in">
                                            <div className="mb-6 pb-6 border-b border-border">
                                                <h4 className="font-serif text-lg text-textPrimary mb-4">Riepilogo</h4>
                                                <div className="space-y-2 text-sm">
                                                    <div className="flex justify-between"><span className="text-textMuted">Data:</span> <span className="text-textPrimary font-mono">{new Date(bookingDate + 'T12:00:00').toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}</span></div>
                                                    <div className="flex justify-between"><span className="text-textMuted">Orario:</span> <span className="text-textPrimary font-mono">{timeSlot}</span></div>
                                                    <div className="flex justify-between"><span className="text-textMuted">Partecipanti:</span> <span className="text-textPrimary font-mono">{guests}</span></div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setStep('select')} className="btn-ghost flex-1 py-3 text-xs">Indietro</button>
                                                <button onClick={handleConfirm} className="btn-gold flex-1 py-3 text-xs">Agg. Carrello</button>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-[10px] text-textMuted text-center mt-4 font-mono">
                                        PAGAMENTO SICURO · CANCELLAZIONE ENTRO 24H
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
