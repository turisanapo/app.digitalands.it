import { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

import { EASE_EXPO } from '../utils/motion';

export default function WaitlistCTA() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | loading | success | error

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

        setStatus('loading');

        try {
            const { error } = await supabase
                .from('waitlist')
                .insert([{ email: trimmed }]);

            if (error) {
                setStatus(error.code === '23505' ? 'success' : 'error');
                if (error.code !== '23505') console.error('Waitlist error:', error);
            } else {
                setStatus('success');
            }
        } catch (err) {
            setStatus('error');
            console.error('Submission error:', err);
        }
    };

    return (
        <section
            className="py-16 md:py-28 px-6 md:px-10"
            id="waitlist"
            style={{ background: 'var(--surface)' }}
        >
            <div className="max-w-content mx-auto">
                <div className="max-w-[560px] mx-auto text-center">

                    {/* Status pill — replaces section chip */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6, ease: EASE_EXPO }}
                        style={{ display: 'flex', justifyContent: 'center' }}
                    >
                        <div className="status-pill">
                            <span className="live-dot" />
                            Waitlist aperta · 17 spot rimanenti
                        </div>
                    </motion.div>

                    <motion.h2
                        className="font-serif text-textPrimary mb-5"
                        style={{ fontSize: 'clamp(36px, 5vw, 48px)', lineHeight: '1.1', textWrap: 'balance' }}
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.75, delay: 0.08, ease: EASE_EXPO }}
                    >
                        La tua prossima base ti{' '}
                        <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>sta aspettando.</em>
                    </motion.h2>

                    <motion.p
                        className="text-textMuted leading-relaxed mb-10"
                        style={{ fontSize: '16px', lineHeight: 1.7 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.7, delay: 0.16, ease: EASE_EXPO }}
                    >
                        Iscriviti alla waitlist. Accesso prioritario + 20% di sconto sul primo mese.
                        Zero spam, mai.
                    </motion.p>

                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: EASE_EXPO }}
                            style={{
                                background: 'var(--bg)',
                                border: '1px solid rgba(212,168,83,0.25)',
                                borderRadius: '8px',
                                padding: '32px',
                            }}
                        >
                            <div className="flex items-center justify-center mb-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{ background: 'rgba(212,168,83,0.12)', border: '1px solid rgba(212,168,83,0.3)' }}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                                        <path d="M5 13l4 4L19 7" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className="text-textPrimary font-medium mb-1">Sei in lista.</div>
                            <div className="text-textMuted text-sm">Ti contatteremo non appena siamo pronti. Benvenuto in Digitalands.</div>
                        </motion.div>
                    ) : (
                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.7, delay: 0.24, ease: EASE_EXPO }}
                        >
                            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                                <input
                                    type="email"
                                    className="waitlist-input flex-1"
                                    placeholder="la-tua@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="btn-gold whitespace-nowrap"
                                    disabled={status === 'loading'}
                                    style={{ padding: '14px 28px' }}
                                >
                                    {status === 'loading' ? (
                                        <span className="inline-flex items-center gap-2">
                                            <svg className="animate-spin" viewBox="0 0 24 24" fill="none" width="14" height="14">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                                                <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                            Invio…
                                        </span>
                                    ) : 'Entra in lista →'}
                                </button>
                            </div>
                            <p className="text-xs text-textMuted font-mono">
                                🏡 17 founding spot rimanenti · Nessuna carta di credito richiesta
                            </p>
                            {status === 'error' && (
                                <p className="text-xs mt-2" style={{ color: 'oklch(60% 0.15 25)' }}>
                                    Qualcosa è andato storto. Riprova tra poco.
                                </p>
                            )}
                        </motion.form>
                    )}
                </div>
            </div>
        </section>
    );
}
