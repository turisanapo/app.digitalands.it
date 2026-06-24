import { motion } from 'motion/react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const CARDS = [
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path d="M1 6h4v12H1zM19 6h4v12h-4zM5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        title: 'Fiber-verified only',
        desc: 'Ogni struttura è testata prima della pubblicazione. Niente sorprese durante il tuo standup del lunedì.',
        num: '01',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 14h2M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        title: 'Settimane o mesi',
        desc: 'Tariffe flessibili, nessun vincolo da checkout a una notte. Paga mensilmente, disdici con 30 giorni di preavviso.',
        num: '02',
    },
    {
        icon: (
            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <path d="M17 20h5v-1a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-1a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        title: 'Community reale',
        desc: 'Community Discord, eventi locali mensili, altri nomadi nello stesso quartiere. Non sei solo.',
        num: '03',
    },
];

export default function WhySicily() {
    return (
        <section className="py-16 md:py-28 px-6 md:px-10" id="why">
            <div className="max-w-content mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.75, ease: EASE_EXPO }}
                >
                    <h2 className="text-textPrimary font-serif mb-4 section-title">
                        Non Bali. Non Lisbona.<br />
                        <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Qualcosa di meglio.</em>
                    </h2>
                    <p className="text-textMuted text-base max-w-md leading-relaxed mb-14">
                        Fuso orario europeo. Qualità della vita italiana. Una frazione del costo.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {CARDS.map((card, i) => (
                        <motion.div
                            key={card.num}
                            initial={{ opacity: 0, y: 44 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.65, delay: i * 0.1, ease: EASE_EXPO }}
                            className="card-hover bg-surface p-8 relative overflow-hidden"
                        >
                            {/* Ghost number */}
                            <div
                                className="absolute top-4 right-6 font-serif font-bold select-none pointer-events-none"
                                style={{ fontSize: '80px', lineHeight: 1, color: 'rgba(255,255,255,0.04)' }}
                            >
                                {card.num}
                            </div>
                            <div className="text-accent mb-4">{card.icon}</div>
                            <h3 className="text-textPrimary font-medium text-base mb-2">{card.title}</h3>
                            <p className="text-textMuted text-sm leading-relaxed">{card.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
