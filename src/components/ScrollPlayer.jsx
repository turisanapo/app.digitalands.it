import { useRef, useEffect } from 'react';
import { Player } from '@remotion/player';
import { motion } from 'motion/react';
import { EASE_EXPO } from '../utils/motion';

export default function ScrollPlayer({ id, label, component, durationInFrames }) {
    const playerRef = useRef(null);
    const containerRef = useRef(null);

    // Auto-play when visible, pause when not
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!playerRef.current) return;
                if (entry.isIntersecting) {
                    playerRef.current.play();
                } else {
                    playerRef.current.pause();
                }
            },
            { threshold: 0.35 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            style={{ background: 'var(--bg)', padding: '80px 24px 96px' }}
            id={id}
        >
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {label && (
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6, ease: EASE_EXPO }}
                        style={{
                            fontFamily: '"Martian Mono", monospace',
                            fontSize: '11px',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: 'var(--text-subtle)',
                            marginBottom: '20px',
                            textAlign: 'center',
                        }}
                    >
                        {label}
                    </motion.p>
                )}

                <motion.div
                    ref={containerRef}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8, ease: EASE_EXPO }}
                    style={{
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '1px solid var(--border)',
                        boxShadow: '0 32px 80px oklch(0% 0 0 / 40%)',
                        aspectRatio: '16 / 7',
                        position: 'relative',
                    }}
                >
                    <Player
                        ref={playerRef}
                        component={component}
                        compositionWidth={1400}
                        compositionHeight={613}
                        durationInFrames={durationInFrames}
                        fps={30}
                        loop
                        controls={false}
                        clickToPlay={false}
                        style={{ width: '100%', height: '100%', display: 'block' }}
                    />
                </motion.div>
            </div>
        </section>
    );
}
