import { motion } from 'motion/react';

import { EASE_EXPO } from '../utils/motion';

const STEPS = [
    {
        num: '01',
        title: 'Browse & Filter',
        desc: 'Scegli tra strutture verificate. Filtra per velocità WiFi, setup di lavoro, distanza dal mare.',
    },
    {
        num: '02',
        title: 'Prenota con un deposito',
        desc: 'Blocca le date con €150 di deposito. Paga il resto al check-in. Cancella entro 48h per un rimborso completo.',
    },
    {
        num: '03',
        title: 'Arriva e connettiti',
        desc: 'Welcome kit, invito Discord, SIM locale e una guida curata ad aspettarti. Pensiamo noi alla logistica.',
    },
];

export default function HowItWorks() {
    return (
        <section
            className="py-16 md:py-28 px-6 md:px-10"
            id="process"
            style={{ background: 'var(--surface)' }}
        >
            <div className="max-w-content mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.75, ease: EASE_EXPO }}
                    className="mb-14 md:mb-20"
                >
                    <h2 className="text-textPrimary font-serif section-title">
                        Tre passi per la tua prossima base.
                    </h2>
                </motion.div>

                <div className="relative">
                    {/* Connector line — desktop */}
                    <div
                        className="hidden md:block absolute top-7 left-[calc(16.66%+16px)] right-[calc(16.66%+16px)]"
                        style={{ height: '1px', background: 'var(--border-light)' }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                        {STEPS.map((step, i) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 36 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-60px' }}
                                transition={{ duration: 0.65, delay: i * 0.12, ease: EASE_EXPO }}
                                className="flex flex-col"
                            >
                                <div
                                    className="font-mono font-medium text-accent mb-6 relative"
                                    style={{ fontSize: '13px', letterSpacing: '0.05em' }}
                                >
                                    <span className="relative z-10" style={{ background: 'var(--surface)', paddingRight: '12px' }}>
                                        {step.num}
                                    </span>
                                </div>
                                <h3 className="text-textPrimary font-medium text-base mb-3">{step.title}</h3>
                                <p className="text-textMuted text-sm leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
