import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const EASE = [0.16, 1, 0.3, 1];

// ─── Step components ──────────────────────────────────────────────────────────

function ChipSelect({ options, value, onChange, multi = false }) {
    const selected = multi ? (value || []) : value;

    function toggle(opt) {
        if (!multi) { onChange(opt); return; }
        const cur = selected || [];
        onChange(cur.includes(opt) ? cur.filter(x => x !== opt) : [...cur, opt]);
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {options.map(opt => {
                const active = multi ? (selected || []).includes(opt) : selected === opt;
                return (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => toggle(opt)}
                        style={{
                            padding: '8px 14px',
                            borderRadius: '100px',
                            border: active ? '1px solid var(--accent)' : '1px solid var(--border-light)',
                            background: active ? 'var(--accent-dim)' : 'transparent',
                            color: active ? 'var(--accent)' : 'var(--text-muted)',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                        }}
                    >
                        {opt}
                    </button>
                );
            })}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{label}</label>
            {children}
        </div>
    );
}

function TextInput({ value, onChange, placeholder }) {
    return (
        <input
            className="waitlist-input"
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
}

// ─── Role configs ─────────────────────────────────────────────────────────────

const CONFIGS = {
    guest: {
        title: 'Benvenuto in Sicilia.',
        subtitle: 'Tre domande per personalizzare la tua esperienza.',
        steps: [
            {
                heading: 'Come lavori?',
                fields: ['work_type', 'profession', 'skills'],
            },
            {
                heading: 'Come preferisci soggiornare?',
                fields: ['preferred_stay_duration', 'has_vehicle', 'interests'],
            },
            {
                heading: 'Dove trovarti online? (opzionale)',
                fields: ['linkedin_url', 'portfolio_url'],
                optional: true,
            },
        ],
    },
    property_manager: {
        title: 'Benvenuto, Host.',
        subtitle: 'Configura il tuo profilo per attrarre i nomadi giusti.',
        steps: [
            {
                heading: 'La tua struttura',
                fields: ['manager_city', 'wifi_speed', 'workspace'],
            },
            {
                heading: 'Il tuo profilo host',
                fields: ['phone', 'years_experience', 'manager_bio'],
            },
        ],
    },
    activity_manager: {
        title: 'Benvenuto, Guide.',
        subtitle: 'Raccontaci la tua esperienza per matchare con i nomadi.',
        steps: [
            {
                heading: 'La tua esperienza',
                fields: ['years_experience', 'team_size', 'certifications'],
            },
            {
                heading: 'Come operi',
                fields: ['languages_spoken', 'phone', 'manager_bio'],
            },
        ],
    },
};

function renderField(fieldId, data, setData) {
    const set = (key, val) => setData(prev => ({ ...prev, [key]: val }));

    switch (fieldId) {
        case 'work_type':
            return (
                <Field label="Che tipo di lavoratore sei?">
                    <ChipSelect
                        options={['Freelance', 'Dipendente remoto', 'Imprenditore', 'Studente']}
                        value={data.work_type}
                        onChange={v => set('work_type', v)}
                    />
                </Field>
            );
        case 'profession':
            return (
                <Field label="Qual è la tua professione?">
                    <TextInput value={data.profession} onChange={v => set('profession', v)} placeholder="es. UI Designer, Developer, Copywriter" />
                </Field>
            );
        case 'skills':
            return (
                <Field label="Le tue competenze principali">
                    <ChipSelect
                        multi
                        options={['Design', 'Development', 'Marketing', 'Copywriting', 'Photo/Video', 'Consulenza', 'Finance', 'HR', 'Product', 'Altro']}
                        value={data.skills}
                        onChange={v => set('skills', v)}
                    />
                </Field>
            );
        case 'preferred_stay_duration':
            return (
                <Field label="Quanto pensi di restare?">
                    <ChipSelect
                        options={['< 2 settimane', '2–4 settimane', '1–3 mesi', '3–6 mesi', 'Più di 6 mesi']}
                        value={data.preferred_stay_duration}
                        onChange={v => set('preferred_stay_duration', v)}
                    />
                </Field>
            );
        case 'has_vehicle':
            return (
                <Field label="Hai un veicolo?">
                    <ChipSelect
                        options={['Sì, ho un'auto', 'No, preferisco mezzi pubblici', 'Noleggerò in loco']}
                        value={data.has_vehicle_label}
                        onChange={v => {
                            set('has_vehicle_label', v);
                            set('has_vehicle', v.startsWith('Sì'));
                        }}
                    />
                </Field>
            );
        case 'interests':
            return (
                <Field label="Cosa ti interessa di più?">
                    <ChipSelect
                        multi
                        options={['Surf / Mare', 'Yoga & Wellness', 'Food & Wine', 'Trekking / Etna', 'Cultura & Storia', 'Fotografia', 'Networking', 'Silenzio & Focus']}
                        value={data.interests}
                        onChange={v => set('interests', v)}
                    />
                </Field>
            );
        case 'linkedin_url':
            return (
                <Field label="LinkedIn">
                    <TextInput value={data.linkedin_url} onChange={v => set('linkedin_url', v)} placeholder="linkedin.com/in/tuonome" />
                </Field>
            );
        case 'portfolio_url':
            return (
                <Field label="Portfolio / Sito web">
                    <TextInput value={data.portfolio_url} onChange={v => set('portfolio_url', v)} placeholder="tuosito.com" />
                </Field>
            );
        case 'manager_city':
            return (
                <Field label="In quale comune si trova la struttura?">
                    <ChipSelect
                        options={['Ragusa', 'Modica', 'Scicli', 'Pozzallo', 'Marina di Ragusa', 'Vittoria', 'Santa Croce Camerina', 'Ispica', 'Chiaramonte Gulfi', 'Giarratana', 'Altro']}
                        value={data.manager_city}
                        onChange={v => set('manager_city', v)}
                    />
                </Field>
            );
        case 'wifi_speed':
            return (
                <Field label="Velocità media del WiFi">
                    <ChipSelect
                        options={['< 30 Mbps', '30–100 Mbps', '100–300 Mbps', 'Fibra > 300 Mbps', 'Starlink']}
                        value={data.wifi_speed}
                        onChange={v => set('wifi_speed', v)}
                    />
                </Field>
            );
        case 'workspace':
            return (
                <Field label="Postazione di lavoro disponibile?">
                    <ChipSelect
                        options={['Scrivania ergonomica dedicata', 'Tavolo generico', 'Area comune condivisa', 'Nessuna postazione']}
                        value={data.workspace}
                        onChange={v => set('workspace', v)}
                    />
                </Field>
            );
        case 'phone':
            return (
                <Field label="Numero di telefono (per gli ospiti)">
                    <TextInput value={data.phone} onChange={v => set('phone', v)} placeholder="+39 320 000 0000" />
                </Field>
            );
        case 'years_experience':
            return (
                <Field label="Anni di esperienza nel settore">
                    <ChipSelect
                        options={['Primo anno', '1–3 anni', '4–10 anni', 'Oltre 10 anni']}
                        value={data.years_experience}
                        onChange={v => set('years_experience', v)}
                    />
                </Field>
            );
        case 'manager_bio':
            return (
                <Field label="Presentati in 2 righe">
                    <textarea
                        className="waitlist-input"
                        value={data.manager_bio || ''}
                        onChange={e => set('manager_bio', e.target.value)}
                        placeholder="Racconta chi sei e cosa rende speciale la tua offerta…"
                        rows={3}
                        style={{ resize: 'none', fontFamily: 'inherit', fontSize: '14px' }}
                    />
                </Field>
            );
        case 'certifications':
            return (
                <Field label="Certificazioni o abilitazioni">
                    <ChipSelect
                        multi
                        options={['Istruttore federale', 'Bagnino / BLSD', 'Guida turistica', 'Brevetto nautico', 'Certificazione yoga', 'Sommelier', 'Altro']}
                        value={data.certifications}
                        onChange={v => set('certifications', v)}
                    />
                </Field>
            );
        case 'team_size':
            return (
                <Field label="Dimensione del team">
                    <ChipSelect
                        options={['Solo io', '2–5 persone', '6–15 persone', 'Grande organizzazione']}
                        value={data.team_size}
                        onChange={v => set('team_size', v)}
                    />
                </Field>
            );
        case 'languages_spoken':
            return (
                <Field label="In quali lingue guidi?">
                    <ChipSelect
                        multi
                        options={['Italiano', 'Inglese', 'Francese', 'Tedesco', 'Spagnolo', 'Altro']}
                        value={data.languages_spoken}
                        onChange={v => set('languages_spoken', v)}
                    />
                </Field>
            );
        default:
            return null;
    }
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function OnboardingOverlay() {
    const { user, updateProfile } = useAuth();
    const [step, setStep] = useState(0);
    const [data, setData] = useState({});
    const [saving, setSaving] = useState(false);

    if (!user) return null;

    const localKey = `onboarded_${user.id}`;
    if (user.onboarded || localStorage.getItem(localKey) === 'true') return null;

    const config = CONFIGS[user.role] || CONFIGS.guest;
    const totalSteps = config.steps.length;
    const currentStep = config.steps[step];
    const isLast = step === totalSteps - 1;

    function canAdvance() {
        if (currentStep.optional) return true;
        // At least one required field has a value
        const required = currentStep.fields.filter(f => !['linkedin_url', 'portfolio_url', 'phone', 'manager_bio'].includes(f));
        return required.every(f => {
            const val = data[f];
            return val !== undefined && val !== '' && val !== null && (!Array.isArray(val) || val.length > 0);
        });
    }

    async function handleNext() {
        if (isLast) {
            setSaving(true);
            localStorage.setItem(localKey, 'true');

            // Map collected data to proper profile fields
            const profileUpdate = {
                onboarded: true,
                stats_metadata: { interests: data.interests, completed_at: new Date().toISOString() },
            };

            const directFields = [
                'work_type', 'profession', 'skills', 'preferred_stay_duration', 'has_vehicle',
                'linkedin_url', 'portfolio_url', 'phone', 'manager_bio', 'manager_city',
                'certifications', 'team_size', 'languages_spoken', 'years_experience',
            ];
            directFields.forEach(f => {
                if (data[f] !== undefined && data[f] !== '') profileUpdate[f] = data[f];
            });

            // wifi_speed and workspace go into role_metadata
            if (data.wifi_speed || data.workspace) {
                profileUpdate.role_metadata = {
                    wifi_speed: data.wifi_speed,
                    workspace: data.workspace,
                };
            }

            await updateProfile(profileUpdate);
            setSaving(false);
        } else {
            setStep(s => s + 1);
        }
    }

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '24px',
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(6px)',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '16px',
                    padding: '40px',
                    width: '100%',
                    maxWidth: '520px',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Ambient glow */}
                <div style={{ position: 'absolute', top: 0, right: 0, width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '8px' }}>
                        {step + 1} / {totalSteps}
                    </div>
                    {step === 0 && (
                        <>
                            <h2 style={{ fontFamily: 'serif', fontSize: '24px', color: 'var(--text-primary)', margin: '0 0 6px' }}>{config.title}</h2>
                            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>{config.subtitle}</p>
                        </>
                    )}
                    {step > 0 && (
                        <h2 style={{ fontFamily: 'serif', fontSize: '22px', color: 'var(--text-primary)', margin: 0 }}>{currentStep.heading}</h2>
                    )}
                </div>

                {/* Step heading (step 0 only shows config title above, so skip) */}
                {step === 0 && (
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '20px', fontFamily: 'monospace', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {currentStep.heading}
                    </div>
                )}

                {/* Fields */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                    >
                        {currentStep.fields.map(f => (
                            <div key={f}>{renderField(f, data, setData)}</div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '36px' }}>
                    {/* Progress dots */}
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {Array.from({ length: totalSteps }).map((_, i) => (
                            <div
                                key={i}
                                style={{
                                    height: '3px',
                                    borderRadius: '2px',
                                    background: i <= step ? 'var(--accent)' : 'var(--border)',
                                    width: i === step ? '24px' : '8px',
                                    transition: 'all 0.3s',
                                }}
                            />
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {step > 0 && (
                            <button
                                onClick={() => setStep(s => s - 1)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'monospace', cursor: 'pointer', padding: '10px 16px' }}
                            >
                                ← Indietro
                            </button>
                        )}
                        <button
                            className="btn-gold"
                            onClick={handleNext}
                            disabled={saving || !canAdvance()}
                            style={{ padding: '12px 28px', fontSize: '0.9rem', opacity: canAdvance() ? 1 : 0.4 }}
                        >
                            {saving ? 'Salvataggio…' : isLast ? 'Completa →' : 'Avanti →'}
                        </button>
                    </div>
                </div>

                {/* Skip (last step only if optional) */}
                {currentStep.optional && (
                    <button
                        onClick={handleNext}
                        style={{ display: 'block', margin: '16px auto 0', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'monospace', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Salta questo passaggio
                    </button>
                )}
            </motion.div>
        </div>
    );
}
