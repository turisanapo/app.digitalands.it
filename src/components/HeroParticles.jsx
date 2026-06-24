import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 65;

const TYPES = [
    { color: [212, 168, 83],  weight: 0.5 }, // gold
    { color: [80,  170, 255], weight: 0.3 }, // sea blue
    { color: [100, 220, 160], weight: 0.2 }, // green
];

function pickColor() {
    const r = Math.random();
    let acc = 0;
    for (const t of TYPES) {
        acc += t.weight;
        if (r < acc) return t.color;
    }
    return TYPES[0].color;
}

export default function HeroParticles() {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animId;

        const resize = () => {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);

        const particles = Array.from({ length: PARTICLE_COUNT }, () => {
            const [r, g, b] = pickColor();
            return {
                x:      Math.random() * canvas.width,
                y:      Math.random() * canvas.height,
                size:   Math.random() * 1.6 + 0.4,
                vx:     (Math.random() - 0.5) * 0.25,
                vy:     -(Math.random() * 0.35 + 0.08),
                r, g, b,
                opacity: Math.random() * 0.45 + 0.1,
            };
        });

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
                if (p.x < -4) p.x = canvas.width + 4;
                if (p.x > canvas.width + 4) p.x = -4;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.opacity})`;
                ctx.fill();

                // Connection lines to nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 90) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(212,168,83,${0.06 * (1 - dist / 90)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1,
            }}
        />
    );
}
