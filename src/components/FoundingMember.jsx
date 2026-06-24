import { motion } from 'motion/react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const CHECKLIST = [
    'Appartamento fiber-verified + router 4G backup',
    'SIM locale all\'arrivo',
    'Welcome kit (prodotti siciliani + guida curata)',
    'Accesso community Discord privata',
    '1 esperienza curata / mese (Ragusa Ibla, produttori locali)',
    'Supporto WhatsApp per tutta la durata del soggiorno',
    'Founding Member badge sul tuo profilo — per sempre',
];

const STATS = [
    { num: '#20',   label: 'Founding spots totali' },
    { num: '€150',  label: 'Deposito per bloccare il posto' },
    { num: '1 mese',label: 'Soggiorno minimo' },
    { num: '48h',   label: 'Finestra di cancellazione gratuita' },
];

export default function FoundingMember() {
    return (
        <section
            className="py-16 md:py-28 px-6 md:px-10"
            id="community"
            style={{
                background: 'radial-gradient(ellipse 80% 60% at 60% 50%, rgba(212,168,83,0.032) 0%, transparent 70%), var(--bg)',
            }}
        >
            <div className="max-w-content mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">

                    {/* LEFT */}
                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.75, ease: EASE_EXPO }}
                    >
                        {/* Scarcity indicator — not a chip */}
                        <div className="founding-counter">
                            17 / 20 founding spot
                        </div>

                        <h2 className="font-serif text-textPrimary mb-5 section-title">
                            Founding Member Pack
                        </h2>
                        <p className="text-textMuted text-base leading-relaxed mb-8 max-w-md">
                            Non solo un appartamento. I primi 20 membri ottengono un'esperienza
                            mensile costruita attorno al lavoro remoto — e un posto permanente
                            nella storia di Digitalands.
                        </p>

                        <ul className="space-y-3 mb-10">
                            {CHECKLIST.map((item, i) => (
                                <motion.li
                                    key={i}
                                    className="check-item"
                                    initial={{ opacity: 0, x: -16 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ duration: 0.5, delay: i * 0.06, ease: EASE_EXPO }}
                                >
                                    <span className="check-icon">✓</span>
                                    <span className="text-sm text-textPrimary">{item}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="mb-8">
                            <div className="text-textPrimary font-medium text-lg mb-1">
                                da{' '}
                                <span style={{ color: 'var(--accent)' }}>€690 / mese</span>
                                {' '}·{' '}
                                <span className="text-base font-normal text-textMuted">€150 deposito per prenotare</span>
                            </div>
                            <p className="text-xs text-textMuted font-mono tracking-wider uppercase">Solo 20 founding spot disponibili.</p>
                        </div>

                        <a href="#waitlist" className="btn-gold">Riserva il tuo posto →</a>
                    </motion.div>

                    {/* RIGHT — Stats card */}
                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.75, delay: 0.15, ease: EASE_EXPO }}
                    >
                        <div
                            className="rounded-lg p-8"
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border-light)',
                            }}
                        >
                            <div className="grid grid-cols-2 gap-6">
                                {STATS.map((s, i) => (
                                    <div key={i} className="flex flex-col">
                                        <div className="stat-metric">{s.num}</div>
                                        <div className="stat-label">{s.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                    <span className="text-xs font-mono tracking-widest uppercase text-textMuted">
                                        Waitlist aperta — accesso anticipato
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
