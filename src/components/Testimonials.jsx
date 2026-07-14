import { motion } from 'motion/react';

import { EASE_EXPO } from '../utils/motion';

const TESTIMONIALS = [
    {
        quote: 'Ho lavorato 3 mesi a Marina di Ragusa. Meno di uno studio a Milano. Luce migliore. Cibo migliore. Non torno indietro.',
        name: 'Marco, 31',
        role: 'Developer · Milano',
        initials: 'M',
        grad: 'linear-gradient(135deg, #8A6B3A, #D4A853)',
    },
    {
        quote: 'La fibra ha funzionato dal primo giorno. La community Discord è davvero attiva. Tutto quello che dovevo sapere.',
        name: 'Sarah, 28',
        role: 'UX Designer · Berlino',
        initials: 'S',
        grad: 'linear-gradient(135deg, #3A6B8A, #4A9ED4)',
    },
    {
        quote: 'Cercavamo qualcosa in Italia che non fosse Roma o Milano. Ragusa è la risposta. Digitalands ha reso tutto senza attrito.',
        name: 'Luca & Anna, 33/30',
        role: 'Nomad couple · Lisbona',
        initials: 'L',
        grad: 'linear-gradient(135deg, #5A3A8A, #8A53D4)',
    },
    {
        quote: 'Il rapporto qualità-vita è imbattibile. In 10 minuti sono al mare, in 5 ho il laptop aperto con 150 Mbps stabili.',
        name: 'Elena, 29',
        role: 'Product Manager · Barcellona',
        initials: 'E',
        grad: 'linear-gradient(135deg, #3A8A5A, #53D4A0)',
    },
    {
        quote: 'Pensavo fosse il solito "remote work paradise" di Instagram. Invece è reale. La community è la differenza.',
        name: 'Tomás, 35',
        role: 'Freelance designer · Porto',
        initials: 'T',
        grad: 'linear-gradient(135deg, #8A3A3A, #D45353)',
    },
];

// Duplicate for seamless loop
const ALL = [...TESTIMONIALS, ...TESTIMONIALS];

function Card({ quote, name, role, initials, grad }) {
    return (
        <div
            style={{
                flexShrink: 0,
                width: '320px',
                background: 'var(--bg)',
                border: '1px solid var(--border-light)',
                borderRadius: '8px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <div style={{ color: 'var(--accent)', fontSize: '13px', letterSpacing: '0.12em', marginBottom: '18px' }}>
                ★★★★★
            </div>
            <blockquote style={{ flex: 1, marginBottom: '24px' }}>
                "{quote}"
            </blockquote>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    paddingTop: '20px',
                    borderTop: '1px solid var(--border)',
                }}
            >
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: grad,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'white',
                        flexShrink: 0,
                    }}
                >
                    {initials}
                </div>
                <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>{name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: '"Martian Mono", monospace', letterSpacing: '0.03em' }}>{role}</div>
                </div>
            </div>
        </div>
    );
}

export default function Testimonials() {
    return (
        <section className="py-16 md:py-28" style={{ background: 'var(--surface)', overflow: 'hidden' }}>
            <div className="max-w-content mx-auto px-6 md:px-10">
                <motion.div
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.75, ease: EASE_EXPO }}
                    className="mb-12 md:mb-16"
                >
                    <h2 className="font-serif text-textPrimary section-title">
                        Dal primo gruppo.
                    </h2>
                </motion.div>
            </div>

            {/* Marquee — full bleed */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE_EXPO }}
            >
                <div className="marquee-container" style={{ paddingBottom: '4px' }}>
                    <div className="marquee-track" style={{ paddingLeft: '24px' }}>
                        {ALL.map((t, i) => (
                            <Card key={i} {...t} />
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
