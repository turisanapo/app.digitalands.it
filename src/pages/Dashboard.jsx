import { useState, useEffect, memo, useMemo } from 'react';
import { Navigate, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import { useI18n } from '../context/I18nContext';
import DigitalCard from '../components/DigitalCard';
import StatusPill from '../components/StatusPill';
import { CAT_COLORS } from '../data/categories';

const PaymentBadge = memo(function PaymentBadge({ paymentStatus }) {
    const map = {
        paid: { label: 'Pagato', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
        pending: { label: 'In attesa', color: 'var(--accent)', bg: 'var(--accent-dim)', border: 'rgba(212,168,83,0.2)' },
        refunded: { label: 'Rimborsato', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' },
        failed: { label: 'Fallito', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
    };
    if (!paymentStatus) return null;
    const s = map[paymentStatus] || map.pending;
    return (
        <span className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded"
            style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
            {s.label}
        </span>
    );
});

const StatusBadge = memo(function StatusBadge({ status }) {
    const map = {
        confermata: { label: 'Confermata', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
        cancellata: { label: 'Cancellata', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
        'in-attesa': { label: 'In attesa', color: 'var(--accent)', bg: 'var(--accent-dim)', border: 'rgba(212,168,83,0.2)' },
    };
    const s = map[status] || map['in-attesa'];
    return (
        <span className="font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded"
            style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}>
            {s.label}
        </span>
    );
});

const BookingCard = memo(function BookingCard({ booking, onCancel }) {
    const checkIn = new Date(booking.checkIn || booking.check_in);
    const checkOut = new Date(booking.checkOut || booking.check_out);
    const isUpcoming = checkIn > new Date();

    return (
        <div className="rounded-lg p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
            <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                    <div className="font-medium text-textPrimary mb-0.5">{booking.propertyName || booking.property_name}</div>
                    <div className="text-xs text-textMuted font-mono">{booking.location}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <StatusBadge status={booking.status} />
                    <PaymentBadge paymentStatus={booking.payment_status} />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                    <div className="text-[10px] font-mono tracking-widest uppercase text-textMuted mb-1">Check-in</div>
                    <div className="text-sm text-textPrimary">{checkIn.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: '2-digit' })}</div>
                </div>
                <div>
                    <div className="text-[10px] font-mono tracking-widest uppercase text-textMuted mb-1">Check-out</div>
                    <div className="text-sm text-textPrimary">{checkOut.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: '2-digit' })}</div>
                </div>
                <div>
                    <div className="text-[10px] font-mono tracking-widest uppercase text-textMuted mb-1">Totale</div>
                    <div className="text-sm" style={{ color: 'var(--accent)' }}>€{booking.totalPrice || booking.total_price}</div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <Link to={`/property/${booking.propertyId || booking.property_id}`}
                    className="text-xs text-textMuted hover:text-accent transition-colors font-mono">
                    Rivedi struttura →
                </Link>
                {booking.status === 'confermata' && isUpcoming && (
                    <button onClick={() => {
                        const msg = booking.payment_status === 'paid'
                            ? 'Sei sicuro? Il rimborso sarà elaborato entro 5-10 giorni lavorativi.'
                            : 'Sei sicuro di voler cancellare?';
                        if (window.confirm(msg)) onCancel(booking.id);
                    }}
                        className="text-xs text-textMuted hover:text-red-400 transition-colors font-mono">
                        {booking.payment_status === 'paid' ? 'Cancella e rimborsa' : 'Cancella'}
                    </button>
                )}
            </div>
        </div>
    );
});

function ProfileField({ label, children }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono tracking-widest uppercase text-textMuted">{label}</label>
            {children}
        </div>
    );
}

function TagsInput({ value, onChange, placeholder }) {
    const tags = Array.isArray(value) ? value : (value || '').split(',').map(s => s.trim()).filter(Boolean);
    const [input, setInput] = useState('');

    function add() {
        const v = input.trim();
        if (v && !tags.includes(v)) onChange([...tags, v]);
        setInput('');
    }

    function remove(tag) { onChange(tags.filter(t => t !== tag)); }

    return (
        <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: tags.length ? '8px' : 0 }}>
                {tags.map(tag => (
                    <span key={tag} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '100px', background: 'var(--accent-dim)', border: '1px solid rgba(212,168,83,0.3)', fontSize: '11px', fontFamily: 'monospace', color: 'var(--accent)' }}>
                        {tag}
                        <button type="button" onClick={() => remove(tag)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0, lineHeight: 1, fontSize: '13px' }}>×</button>
                    </span>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <input
                    className="waitlist-input"
                    style={{ flex: 1 }}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
                    placeholder={placeholder}
                />
                <button type="button" onClick={add} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '0.8rem', flexShrink: 0 }}>+</button>
            </div>
        </div>
    );
}

function VerificationBadge({ status }) {
    const map = {
        verified: { label: 'Verificato', color: '#4ade80', bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)' },
        pending: { label: 'In revisione', color: 'var(--accent)', bg: 'var(--accent-dim)', border: 'rgba(212,168,83,0.2)' },
        rejected: { label: 'Non verificato', color: '#f87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)' },
    };
    const s = map[status] || map.pending;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', background: s.bg, border: `1px solid ${s.border}` }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: '12px', fontFamily: 'monospace', color: s.color }}>{s.label}</span>
            {status === 'pending' && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>— Il team Digitalands verificherà il profilo entro 48h</span>
            )}
        </div>
    );
}

const ProfileSection = memo(function ProfileSection({ user, onUpdate }) {
    const role = user.role || 'guest';

    const [form, setForm] = useState({
        name: user.name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        // nomad
        work_type: user.work_type || '',
        profession: user.profession || '',
        skills: user.skills || [],
        linkedin_url: user.linkedin_url || '',
        portfolio_url: user.portfolio_url || '',
        // manager shared
        manager_bio: user.manager_bio || '',
        manager_city: user.manager_city || '',
        // property manager
        vat_number: user.vat_number || '',
        // activity manager
        years_experience: user.years_experience || '',
        team_size: user.team_size || '',
        certifications: user.certifications || [],
        languages_spoken: user.languages_spoken || [],
    });
    const [saved, setSaved] = useState(false);
    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    async function handleSave(e) {
        e.preventDefault();
        await onUpdate(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    }

    return (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '480px' }}>

            {/* ── Shared: nome ── */}
            <ProfileField label="Nome">
                <input className="waitlist-input" value={form.name} onChange={e => set('name', e.target.value)} />
            </ProfileField>

            {/* ── NOMAD ── */}
            {role === 'guest' && (
                <>
                    <ProfileField label="Professione">
                        <input className="waitlist-input" value={form.profession} onChange={e => set('profession', e.target.value)} placeholder="es. UI Designer" />
                    </ProfileField>
                    <ProfileField label="Tipo di lavoro">
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['Freelance', 'Dipendente remoto', 'Imprenditore', 'Studente'].map(opt => (
                                <button key={opt} type="button" onClick={() => set('work_type', opt)}
                                    style={{ padding: '7px 13px', borderRadius: '100px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer', border: form.work_type === opt ? '1px solid var(--accent)' : '1px solid var(--border-light)', background: form.work_type === opt ? 'var(--accent-dim)' : 'transparent', color: form.work_type === opt ? 'var(--accent)' : 'var(--text-muted)', transition: 'all 0.15s' }}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </ProfileField>
                    <ProfileField label="Competenze (premi Invio per aggiungere)">
                        <TagsInput value={form.skills} onChange={v => set('skills', v)} placeholder="es. Design" />
                    </ProfileField>
                    <ProfileField label="LinkedIn">
                        <input className="waitlist-input" value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} placeholder="linkedin.com/in/tuonome" />
                    </ProfileField>
                    <ProfileField label="Portfolio / Sito">
                        <input className="waitlist-input" value={form.portfolio_url} onChange={e => set('portfolio_url', e.target.value)} placeholder="tuosito.com" />
                    </ProfileField>
                </>
            )}

            {/* ── PROPERTY MANAGER ── */}
            {role === 'property_manager' && (
                <>
                    <ProfileField label="Stato verifica">
                        <VerificationBadge status={user.verification_status || 'pending'} />
                    </ProfileField>
                    <ProfileField label="Telefono (visibile agli ospiti)">
                        <input className="waitlist-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+39 320 000 0000" />
                    </ProfileField>
                    <ProfileField label="Comune della struttura">
                        <input className="waitlist-input" value={form.manager_city} onChange={e => set('manager_city', e.target.value)} placeholder="es. Ragusa" />
                    </ProfileField>
                    <ProfileField label="Partita IVA">
                        <input className="waitlist-input" value={form.vat_number} onChange={e => set('vat_number', e.target.value)} placeholder="PI123456789" />
                    </ProfileField>
                    <ProfileField label="Presentazione host">
                        <textarea className="waitlist-input" rows={3} value={form.manager_bio} onChange={e => set('manager_bio', e.target.value)} placeholder="Racconta chi sei e cosa rende speciale la tua struttura…" style={{ resize: 'none', fontFamily: 'inherit', fontSize: '14px' }} />
                    </ProfileField>
                </>
            )}

            {/* ── ACTIVITY MANAGER ── */}
            {role === 'activity_manager' && (
                <>
                    <ProfileField label="Stato verifica">
                        <VerificationBadge status={user.verification_status || 'pending'} />
                    </ProfileField>
                    <ProfileField label="Telefono (visibile ai clienti)">
                        <input className="waitlist-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+39 320 000 0000" />
                    </ProfileField>
                    <ProfileField label="Anni di esperienza">
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['Primo anno', '1–3 anni', '4–10 anni', 'Oltre 10 anni'].map(opt => (
                                <button key={opt} type="button" onClick={() => set('years_experience', opt)}
                                    style={{ padding: '7px 13px', borderRadius: '100px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer', border: form.years_experience === opt ? '1px solid var(--accent)' : '1px solid var(--border-light)', background: form.years_experience === opt ? 'var(--accent-dim)' : 'transparent', color: form.years_experience === opt ? 'var(--accent)' : 'var(--text-muted)', transition: 'all 0.15s' }}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </ProfileField>
                    <ProfileField label="Dimensione team">
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {['Solo io', '2–5 persone', '6–15 persone', 'Grande organizzazione'].map(opt => (
                                <button key={opt} type="button" onClick={() => set('team_size', opt)}
                                    style={{ padding: '7px 13px', borderRadius: '100px', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer', border: form.team_size === opt ? '1px solid var(--accent)' : '1px solid var(--border-light)', background: form.team_size === opt ? 'var(--accent-dim)' : 'transparent', color: form.team_size === opt ? 'var(--accent)' : 'var(--text-muted)', transition: 'all 0.15s' }}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </ProfileField>
                    <ProfileField label="Certificazioni">
                        <TagsInput value={form.certifications} onChange={v => set('certifications', v)} placeholder="es. Istruttore federale" />
                    </ProfileField>
                    <ProfileField label="Lingue in cui guidi">
                        <TagsInput value={form.languages_spoken} onChange={v => set('languages_spoken', v)} placeholder="es. Italiano" />
                    </ProfileField>
                    <ProfileField label="Presentazione guida">
                        <textarea className="waitlist-input" rows={3} value={form.manager_bio} onChange={e => set('manager_bio', e.target.value)} placeholder="Racconta la tua storia e le tue esperienze…" style={{ resize: 'none', fontFamily: 'inherit', fontSize: '14px' }} />
                    </ProfileField>
                </>
            )}

            <button type="submit" className="btn-gold" style={{ padding: '12px 28px', fontSize: '0.875rem', alignSelf: 'flex-start' }}>
                {saved ? '✓ Salvato' : 'Salva modifiche'}
            </button>
        </form>
    );
});


const ActivityBookingsTab = memo(function ActivityBookingsTab({ bookings, onCancel }) {
    const navigate = useNavigate();
    const activityBookings = bookings.filter(b => b.activity_id);

    if (activityBookings.length === 0) {
        return (
            <div className="text-center py-20 text-textMuted">
                <div className="text-4xl mb-4">🏄</div>
                <p className="text-sm font-mono mb-6">Non hai ancora prenotato nessuna attività.</p>
                <button className="btn-ghost text-sm" onClick={() => navigate('/activities')}>
                    Scopri le attività →
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {activityBookings.map(b => {
                const catColor = CAT_COLORS[b.category]?.color || 'var(--accent)';
                const isPast = new Date(b.check_in || b.date) < new Date();
                return (
                    <div key={b.id} className="rounded-lg p-5"
                        style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                                <span style={{ fontSize: '1.5rem' }}>{b.emoji || '✨'}</span>
                                <div>
                                    <div className="font-medium text-textPrimary mb-0.5">{b.activity_name || b.activityName}</div>
                                    <span style={{
                                        fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.08em',
                                        textTransform: 'uppercase', fontWeight: 600,
                                        color: catColor, background: `${catColor}18`,
                                        padding: '2px 8px', borderRadius: '4px',
                                        border: `1px solid ${catColor}33`,
                                    }}>{b.category || 'Esperienza'}</span>
                                </div>
                            </div>
                            <StatusPill status={b.status} />
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div>
                                <div className="text-[10px] font-mono tracking-widest uppercase text-textMuted mb-1">Data</div>
                                <div className="text-sm text-textPrimary">
                                    {new Date(b.check_in || b.date).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: '2-digit' })}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] font-mono tracking-widest uppercase text-textMuted mb-1">Dettaglio</div>
                                <div className="text-sm text-textPrimary">{b.property_name || 'Slot prenotato'}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-mono tracking-widest uppercase text-textMuted mb-1">Totale</div>
                                <div className="text-sm" style={{ color: 'var(--accent)' }}>€{b.total_price || b.price}</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                            <Link to="/activities" className="text-xs text-textMuted hover:text-accent transition-colors font-mono">
                                Vedi tutte le attività →
                            </Link>
                            {b.status === 'confermata' && !isPast && (
                                <button onClick={() => onCancel(b.id)}
                                    className="text-xs text-textMuted hover:text-red-400 transition-colors font-mono">
                                    Cancella
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default function Dashboard() {
    const { user, logout, updateProfile, loading } = useAuth();
    const { bookings, cancelBooking } = useBookings();
    const [activeTab, setActiveTab] = useState('bookings');
    const [searchParams, setSearchParams] = useSearchParams();
    const [paymentToast, setPaymentToast] = useState('');

    useEffect(() => {
        const payment = searchParams.get('payment');
        if (payment === 'success') {
            setPaymentToast('Pagamento completato con successo! La tua prenotazione è confermata.');
            setSearchParams({}, { replace: true });
            setTimeout(() => setPaymentToast(''), 6000);
        } else if (payment === 'cancelled') {
            setPaymentToast('Pagamento annullato. Puoi riprovare dalla tua dashboard.');
            setSearchParams({}, { replace: true });
            setTimeout(() => setPaymentToast(''), 6000);
        }
    }, []);

    const { upcoming, past } = useMemo(() => {
        const pb = bookings.filter(b => b.property_id);
        return {
            upcoming: pb.filter(b => b.status !== 'cancellata' && new Date(b.check_in) > new Date()),
            past: pb.filter(b => b.status === 'cancellata' || new Date(b.check_out) <= new Date())
        };
    }, [bookings]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-bg">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent"></div>
        </div>
    );

    if (!user) return <Navigate to="/auth?redirect=/dashboard" replace />;

    const tabs = [
        { id: 'bookings', label: 'Prenotazioni' },
        { id: 'activities', label: 'Attività' },
        { id: 'profile', label: 'Profilo' },
    ];

    const tabStyle = (t) => ({
        padding: '8px 20px',
        fontSize: '0.82rem',
        fontFamily: 'monospace',
        letterSpacing: '0.04em',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        borderBottom: activeTab === t ? '2px solid var(--accent)' : '2px solid transparent',
        color: activeTab === t ? 'var(--text-primary)' : 'var(--text-muted)',
        transition: 'color 0.2s, border-color 0.2s',
    });

    return (
        <div className="min-h-screen pt-20 pb-20 px-6 md:px-10">
            <div className="max-w-content mx-auto">
                {/* Payment toast */}
                {paymentToast && (
                    <div className="mb-6 p-4 rounded-lg text-sm font-mono text-center"
                        style={{
                            background: paymentToast.includes('successo') ? 'rgba(74,222,128,0.08)' : 'rgba(212,168,83,0.08)',
                            border: `1px solid ${paymentToast.includes('successo') ? 'rgba(74,222,128,0.2)' : 'rgba(212,168,83,0.2)'}`,
                            color: paymentToast.includes('successo') ? '#4ade80' : 'var(--accent)',
                        }}>
                        {paymentToast}
                    </div>
                )}

                {/* Premium Banner */}
                {user.is_premium && (
                    <div className="mb-8 p-6 rounded-xl animate-fade-in" style={{ background: 'linear-gradient(90deg, #5865F2 0%, #4752C4 100%)', boxShadow: '0 8px 30px rgba(88, 101, 242, 0.25)' }}>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl border border-white/20">
                                    👾
                                </div>
                                <div>
                                    <div className="text-white font-serif text-xl mb-1">Benvenuto nella Community Premium</div>
                                    <p className="text-white/80 text-sm">Hai accesso esclusivo al server Discord di Digitalands.</p>
                                </div>
                            </div>
                            <a
                                href="https://discord.gg/hR7bynNd"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-[#5865F2] px-8 py-3 rounded-lg font-bold text-sm tracking-wide hover:scale-105 transition-transform"
                            >
                                ENTRA NEL DISCORD
                            </a>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-[#0A0A0A] text-lg flex-shrink-0"
                            style={{ background: 'var(--accent)' }}>
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="text-xs font-mono tracking-widest uppercase text-textMuted mb-0.5">Benvenuto</div>
                            <div className="font-serif text-2xl text-textPrimary">{user.name}</div>
                            <div className="text-sm text-textMuted">{user.email}</div>
                        </div>
                    </div>
                    <button onClick={logout} className="btn-ghost text-sm" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>
                        Logout
                    </button>
                </div>

                {/* Stats bar */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                    {[
                        { label: 'Prenotazioni', value: bookings.length },
                        { label: 'In arrivo', value: upcoming.length },
                        { label: 'Completate/ann.', value: past.length },
                    ].map(s => (
                        <div key={s.label} className="rounded-lg p-4"
                            style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
                            <div className="font-serif text-2xl" style={{ color: 'var(--accent)' }}>{s.value}</div>
                            <div className="text-xs font-mono tracking-wider text-textMuted uppercase mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex border-b mb-8" style={{ borderColor: 'var(--border)' }}>
                    {tabs.map(t => (
                        <button key={t.id} style={tabStyle(t.id)} onClick={() => setActiveTab(t.id)}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Tab: Activities */}
                {activeTab === 'activities' && (
                    <ActivityBookingsTab bookings={bookings} onCancel={cancelBooking} />
                )}

                {/* Tab: Bookings */}
                {activeTab === 'bookings' && (
                    <div>
                        {bookings.length === 0 ? (
                            <div className="text-center py-20 text-textMuted">
                                <div className="text-4xl mb-4">🏡</div>
                                <p className="text-sm font-mono mb-6">Non hai ancora prenotazioni.</p>
                                <Link to="/#properties" className="btn-ghost text-sm">Esplora le strutture →</Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {upcoming.length > 0 && (
                                    <>
                                        <div className="text-xs font-mono tracking-widest uppercase text-textMuted mb-3">In arrivo</div>
                                        {upcoming.map(b => (
                                            <BookingCard key={b.id} booking={b} onCancel={cancelBooking} />
                                        ))}
                                    </>
                                )}
                                {past.length > 0 && (
                                    <>
                                        <div className="text-xs font-mono tracking-widest uppercase text-textMuted mt-8 mb-3">Passate / Cancellate</div>
                                        {past.map(b => (
                                            <BookingCard key={b.id} booking={b} onCancel={cancelBooking} />
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab: Profile */}
                {activeTab === 'profile' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '40px', alignItems: 'start' }}>
                        <DigitalCard />
                        <div>
                            <div className="text-sm text-textMuted mb-6">Modifica le informazioni del tuo profilo Digitalands.</div>
                            <ProfileSection user={user} onUpdate={updateProfile} />

                            {user.stats_metadata && Object.keys(user.stats_metadata).length > 0 && (
                                <div style={{ marginTop: '32px', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--bg)' }}>
                                    <div className="text-[10px] font-mono tracking-widest uppercase text-textMuted mb-4">Dettagli Analisi</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(user.stats_metadata).map(([key, value]) => (
                                            key !== 'completed_at' && (
                                                <div key={key}>
                                                    <div className="text-[9px] font-mono text-textMuted uppercase mb-1">{key.replace('_', ' ')}</div>
                                                    <div className="text-xs text-textPrimary">{Array.isArray(value) ? value.join(', ') : value}</div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(user.role === 'activity_manager' || user.role === 'property_manager') && (
                                <div style={{ marginTop: '24px', padding: '16px', borderRadius: '8px', border: '1px solid rgba(212,168,83,0.2)', background: 'var(--accent-dim)' }}>
                                    <div style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.08em', color: 'var(--accent)', marginBottom: '8px' }}>AREA MANAGER</div>
                                    <Link
                                        to={user.role === 'activity_manager' ? '/manager/activities' : '/manager/properties'}
                                        className="btn-gold"
                                        style={{ display: 'inline-block', padding: '10px 20px', fontSize: '0.85rem' }}>
                                        Vai alla tua dashboard →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
