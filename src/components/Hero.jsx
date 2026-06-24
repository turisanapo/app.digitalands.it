import sicilyImage from '../assets/sicily-outline.png';
import VideoBackground from './VideoBackground';
import HeroParticles from './HeroParticles';
import { motion } from 'motion/react';

const EASE_EXPO = [0.16, 1, 0.3, 1];

const AVATARS = [
    { bg: 'linear-gradient(135deg,#8A6B3A,#D4A853)' },
    { bg: 'linear-gradient(135deg,#3A6B8A,#53A8D4)' },
    { bg: 'linear-gradient(135deg,#4A8A3A,#87D453)' },
    { bg: 'linear-gradient(135deg,#8A3A4A,#D45387)' },
    { bg: 'linear-gradient(135deg,#5A3A8A,#8753D4)' },
];

const STATS = [
    { value: '300', suffix: ' giorni di sole / anno' },
    { value: '40%', suffix: ' meno rispetto a Milano' },
    { value: '30 min', suffix: ' da Comiso Airport' },
];

const FLOAT_TAGS = [
    { text: '🌊 Acque cristalline',        top: '20%', left: '3%',  delay: '0s',   dur: '7s',   color: 'rgba(80,170,255,0.9)',  bg: 'rgba(80,170,255,0.07)',  border: 'rgba(80,170,255,0.28)' },
    { text: '🍋 Slow living · Fast WiFi',  top: '32%', left: '1%',  delay: '1.5s', dur: '9s',   color: 'rgba(230,200,60,0.95)', bg: 'rgba(230,200,60,0.07)',  border: 'rgba(230,200,60,0.28)' },
    { text: '⚡ 100–200 Mbps fiber',       top: '50%', left: '2%',  delay: '2.8s', dur: '8s',   color: 'rgba(100,225,160,0.9)', bg: 'rgba(100,225,160,0.07)', border: 'rgba(100,225,160,0.25)' },
    { text: '🌿 Aria pulita · Zero stress', top: '66%', left: '4%',  delay: '0.8s', dur: '10s',  color: 'rgba(120,210,120,0.9)', bg: 'rgba(120,210,120,0.07)', border: 'rgba(120,210,120,0.25)' },
    { text: '💻 Remote-friendly',           top: '20%', right: '3%', delay: '1.8s', dur: '8.5s', color: 'rgba(180,145,255,0.9)', bg: 'rgba(180,145,255,0.07)', border: 'rgba(180,145,255,0.25)' },
    { text: '☀️ 300 giorni di sole',        top: '34%', right: '1%', delay: '0.4s', dur: '9s',   color: 'rgba(255,190,50,0.95)', bg: 'rgba(255,190,50,0.08)',  border: 'rgba(255,190,50,0.28)' },
    { text: '🏛 UNESCO · Barocco ibleo',    top: '50%', right: '3%', delay: '2.2s', dur: '7.5s', color: 'rgba(212,168,83,0.9)',  bg: 'rgba(212,168,83,0.07)',  border: 'rgba(212,168,83,0.26)' },
    { text: '🛜 WiFi Certified ✓',          top: '66%', right: '2%', delay: '1s',   dur: '10s',  color: 'rgba(100,225,160,0.85)',bg: 'rgba(100,225,160,0.07)', border: 'rgba(100,225,160,0.22)' },
];

const VILLA_CARDS = [
    { img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=280&q=75&fit=crop', label: 'Villa Iblea',        price: '€890/mese',   top: '26%', left: '4%',  delay: '0s',   dur: '11s' },
    { img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=280&q=75&fit=crop',    label: 'Terrazza sul Mare', price: '€1.190/mese', top: '28%', right: '3%', delay: '2s',   dur: '10s' },
    { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=280&q=75&fit=crop',    label: 'Casa Barocca',      price: '€970/mese',   top: '56%', left: '3%',  delay: '3.5s', dur: '12s' },
];

function DigitalSun({ size = 140 }) {
    const rays = Array.from({ length: 16 }, (_, i) => i);
    const cx = size / 2;
    return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            <circle cx={cx} cy={cx} r={size * 0.46} fill="rgba(255,200,50,0.04)" />
            <circle cx={cx} cy={cx} r={size * 0.38} fill="rgba(255,200,50,0.06)" />
            <circle cx={cx} cy={cx} r={size * 0.32} fill="none" stroke="rgba(255,190,50,0.25)" strokeWidth="0.8" strokeDasharray="3 4" />
            {rays.map(i => {
                const angle = (i * (360 / 16) * Math.PI) / 180;
                const isDigital = i % 2 === 1;
                const r1 = size * 0.27;
                const r2 = isDigital ? size * 0.42 : size * 0.38;
                const x1 = cx + r1 * Math.cos(angle), y1 = cx + r1 * Math.sin(angle);
                const x2 = cx + r2 * Math.cos(angle), y2 = cx + r2 * Math.sin(angle);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={isDigital ? 'rgba(100,220,160,0.55)' : 'rgba(255,200,50,0.6)'}
                    strokeWidth={isDigital ? 1 : 2}
                    strokeDasharray={isDigital ? '2 3' : undefined}
                    strokeLinecap="round" />;
            })}
            <circle cx={cx} cy={cx} r={size * 0.2} fill="rgba(255,200,50,0.18)" />
            <circle cx={cx} cy={cx} r={size * 0.12} fill="rgba(255,220,80,0.7)" />
            {[0, 90, 180, 270].map(deg => {
                const a = (deg * Math.PI) / 180;
                const r = size * 0.18;
                return <rect key={deg} x={cx + r * Math.cos(a) - 1.5} y={cx + r * Math.sin(a) - 1.5}
                    width="3" height="3" fill="rgba(100,220,160,0.7)" rx="0.5" />;
            })}
        </svg>
    );
}

function SicilyOutline({ size = 300 }) {
    return (
        <div style={{
            width: size, height: size, position: 'relative',
            opacity: 0.6,
            filter: 'drop-shadow(0 0 20px rgba(212,168,83,0.15)) brightness(1.2) contrast(1.1)',
            animation: 'float-slow 20s infinite ease-in-out',
        }}>
            <img src={sicilyImage} alt="Sicily Outline" style={{
                width: '100%', height: '100%', objectFit: 'contain',
                filter: 'sepia(1) saturate(5) hue-rotate(-10deg) brightness(0.9)',
            }} />
        </div>
    );
}

function LemonWifi({ size = 80 }) {
    const cx = size / 2, cy = size * 0.52;
    return (
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            <ellipse cx={cx} cy={cy} rx={size * 0.28} ry={size * 0.34} fill="rgba(230,205,50,0.18)" stroke="rgba(230,205,50,0.55)" strokeWidth="1.2" />
            <ellipse cx={cx} cy={size * 0.12} rx={size * 0.08} ry={size * 0.09} fill="rgba(230,205,50,0.22)" stroke="rgba(230,205,50,0.4)" strokeWidth="1" />
            <ellipse cx={cx} cy={size * 0.91} rx={size * 0.08} ry={size * 0.07} fill="rgba(230,205,50,0.22)" stroke="rgba(230,205,50,0.4)" strokeWidth="1" />
            <path d={`M ${cx} ${size * 0.12} Q ${cx + size * 0.18} ${size * 0.02} ${cx + size * 0.26} ${size * 0.08} Q ${cx + size * 0.14} ${size * 0.14} ${cx} ${size * 0.12}`} fill="rgba(100,200,100,0.35)" stroke="rgba(100,200,100,0.6)" strokeWidth="0.8" />
            <path d={`M ${cx - size * 0.1} ${cy + size * 0.1} Q ${cx} ${cy - size * 0.05} ${cx + size * 0.1} ${cy + size * 0.1}`} stroke="rgba(230,205,50,0.75)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d={`M ${cx - size * 0.06} ${cy + size * 0.15} Q ${cx} ${cy + size * 0.04} ${cx + size * 0.06} ${cy + size * 0.15}`} stroke="rgba(100,220,160,0.8)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <circle cx={cx} cy={cy + size * 0.19} r="1.8" fill="rgba(100,220,160,0.9)" />
        </svg>
    );
}

function OliveBranch({ size = 100 }) {
    return (
        <svg viewBox="0 0 100 70" width={size} height={size * 0.7} fill="none">
            <path d="M 10 60 Q 40 40 70 20 Q 85 12 92 10" stroke="rgba(120,190,100,0.5)" strokeWidth="1.5" strokeLinecap="round" />
            {[{ cx: 25, cy: 51, r: 8, a: -40 }, { cx: 42, cy: 38, r: 7, a: -55 }, { cx: 60, cy: 27, r: 6, a: -50 }, { cx: 76, cy: 17, r: 5, a: -45 }].map((l, i) => (
                <ellipse key={i} cx={l.cx} cy={l.cy} rx={l.r} ry={l.r * 0.45} transform={`rotate(${l.a} ${l.cx} ${l.cy})`} fill="rgba(100,185,90,0.22)" stroke="rgba(120,200,100,0.55)" strokeWidth="0.8" />
            ))}
            {[{ x: 22, y: 55 }, { x: 38, y: 43 }, { x: 56, y: 31 }, { x: 72, y: 20 }].map((p, i) => (
                <g key={i}>
                    <circle cx={p.x} cy={p.y} r="3.5" fill="rgba(60,160,80,0.18)" stroke="rgba(100,200,120,0.55)" strokeWidth="0.8" />
                    <circle cx={p.x} cy={p.y} r="1.2" fill="rgba(100,220,140,0.8)" />
                </g>
            ))}
            {[{ x1: 27, y1: 52, x2: 34, y2: 47 }, { x1: 44, y1: 40, x2: 50, y2: 35 }, { x1: 62, y1: 28, x2: 67, y2: 24 }].map((l, i) => (
                <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="rgba(100,200,120,0.35)" strokeWidth="0.8" strokeDasharray="1.5 2" />
            ))}
        </svg>
    );
}

function SeaDataWave({ width = 260, flip = false }) {
    const h = 40;
    const dots = [20, 55, 95, 135, 175, 215, 248];
    return (
        <svg viewBox={`0 0 ${width} ${h}`} width={width} height={h} fill="none" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
            <path d={`M0 ${h * 0.6} Q${width * 0.15} ${h * 0.25} ${width * 0.3} ${h * 0.6} Q${width * 0.45} ${h * 0.9} ${width * 0.6} ${h * 0.6} Q${width * 0.75} ${h * 0.28} ${width * 0.9} ${h * 0.6} Q${width * 0.97} ${h * 0.78} ${width} ${h * 0.65}`} stroke="rgba(60,160,255,0.45)" strokeWidth="1.8" strokeLinecap="round" />
            <path d={`M0 ${h * 0.75} Q${width * 0.15} ${h * 0.45} ${width * 0.3} ${h * 0.75} Q${width * 0.45} ${h * 0.95} ${width * 0.6} ${h * 0.75} Q${width * 0.75} ${h * 0.5} ${width * 0.9} ${h * 0.75} Q${width * 0.97} ${h * 0.88} ${width} ${h * 0.78}`} stroke="rgba(60,160,255,0.25)" strokeWidth="1" strokeLinecap="round" />
            {dots.map((x, i) => (
                <circle key={i} cx={x} cy={h * 0.55} r="1.8" fill={i % 3 === 0 ? 'rgba(100,220,160,0.75)' : 'rgba(80,170,255,0.55)'} />
            ))}
        </svg>
    );
}

export default function Hero() {
    return (
        <section
            className="relative min-h-[90vh] md:min-h-screen flex flex-col items-center justify-center grid-bg overflow-hidden"
            style={{ paddingTop: '100px', paddingBottom: '0' }}
        >
            <VideoBackground src="/assets/videos/hero-bg.mp4" overlayOpacity={0.45} />
            <HeroParticles />

            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 55% at 50% 45%, rgba(212,168,83,0.09) 0%, transparent 68%)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 50% 40% at 82% 12%, rgba(255,175,40,0.07) 0%, transparent 62%)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 45% 38% at 12% 88%, rgba(60,145,255,0.07) 0%, transparent 58%)' }} />
            </div>

            {/* Floating text tags */}
            <div className="absolute inset-0 pointer-events-none hidden lg:block" style={{ zIndex: 3 }}>
                {FLOAT_TAGS.map((tag, i) => (
                    <div key={i} className="absolute hero-float-tag"
                        style={{ top: tag.top, left: tag.left, right: tag.right, '--delay': tag.delay, '--dur': tag.dur, color: tag.color, background: tag.bg, borderColor: tag.border }}>
                        {tag.text}
                    </div>
                ))}
            </div>

            {/* Floating villa cards */}
            <div className="absolute inset-0 pointer-events-none hidden xl:block" style={{ zIndex: 3 }}>
                {VILLA_CARDS.map((card, i) => (
                    <div key={i} className="absolute hero-float-svg"
                        style={{ top: card.top, left: card.left, right: card.right, '--delay': card.delay, '--dur': card.dur, width: '152px' }}>
                        <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--surface)', backdropFilter: 'blur(6px)', boxShadow: '0 8px 28px rgba(0,0,0,0.15)' }}>
                            <img src={card.img} alt={card.label} style={{ width: '100%', height: '88px', objectFit: 'cover', display: 'block' }} />
                            <div style={{ padding: '8px 10px' }}>
                                <div style={{ fontSize: '10px', fontFamily: '"Martian Mono", monospace', color: 'var(--accent)', letterSpacing: '0.04em', marginBottom: '1px' }}>{card.label}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: '"Martian Mono", monospace' }}>{card.price}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* SVG decorations */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden" style={{ zIndex: 2 }}>
                <div className="opacity-[0.12] md:opacity-20 select-none pointer-events-none" style={{ transform: 'rotate(-5deg)' }}>
                    <SicilyOutline size="clamp(300px, 100vw, 750px)" />
                </div>
                <div className="absolute hero-float-svg" style={{ top: '6%', right: '8%', '--delay': '0s', '--dur': '15s', opacity: 0.9 }}>
                    <DigitalSun size={138} />
                </div>
                <div className="absolute hero-float-svg" style={{ top: '42%', left: '1%', '--delay': '2s', '--dur': '11s', opacity: 0.85 }}>
                    <LemonWifi size={82} />
                </div>
                <div className="absolute hero-float-svg" style={{ bottom: '25%', right: '6%', '--delay': '4s', '--dur': '13s', opacity: 0.7 }}>
                    <LemonWifi size={56} />
                </div>
                <div className="absolute hero-float-svg" style={{ bottom: '22%', left: '5%', '--delay': '1s', '--dur': '12s', opacity: 0.85 }}>
                    <OliveBranch size={110} />
                </div>
                <div className="absolute hero-float-svg" style={{ top: '54%', right: '1%', '--delay': '0.5s', '--dur': '10s', opacity: 0.9 }}>
                    <SeaDataWave width={200} />
                </div>
                <div className="absolute hero-float-svg" style={{ bottom: '16%', left: '8%', '--delay': '2.5s', '--dur': '9s', opacity: 0.7 }}>
                    <SeaDataWave width={160} flip />
                </div>
                {/* Gold dot grid */}
                <div className="absolute" style={{ top: '16%', left: '10%' }}>
                    <svg viewBox="0 0 52 52" fill="none" width="52" height="52">
                        {[0,10,20,30,40].flatMap(x => [0,10,20,30,40].map(y =>
                            <circle key={`${x}-${y}`} cx={x+6} cy={y+6} r="1.3" fill="rgba(212,168,83,0.2)" />
                        ))}
                    </svg>
                </div>
                <div className="absolute" style={{ bottom: '18%', right: '9%' }}>
                    <svg viewBox="0 0 52 52" fill="none" width="52" height="52">
                        {[0,10,20,30,40].flatMap(x => [0,10,20,30,40].map(y =>
                            <circle key={`${x}-${y}`} cx={x+6} cy={y+6} r="1.3" fill="rgba(80,160,255,0.18)" />
                        ))}
                    </svg>
                </div>
            </div>

            {/* ── Main content ── */}
            <div className="relative text-center px-6 max-w-3xl mx-auto w-full flex flex-col items-center" style={{ zIndex: 10 }}>

                {/* Coordinate badge — not a section chip */}
                <motion.div
                    className="hero-coordinate"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: EASE_EXPO }}
                >
                    <span className="pulse-dot" />
                    36.3°N · 14.5°E · Sicilia
                </motion.div>

                <motion.h1
                    className="font-serif text-white leading-[1.1] tracking-[-0.025em] mb-6 px-2"
                    style={{ fontSize: 'clamp(34px, 8vw, 68px)', textWrap: 'balance' }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.85, delay: 0.08, ease: EASE_EXPO }}
                >
                    Work remotely.<br />
                    Live in{' '}
                    <span style={{ color: 'var(--accent)' }}>Sicily.</span>
                </motion.h1>

                <motion.p
                    className="text-white/70 leading-relaxed mb-10 max-w-[480px] px-4"
                    style={{ fontSize: 'clamp(16px, 4vw, 18px)', lineHeight: 1.7 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.18, ease: EASE_EXPO }}
                >
                    Appartamenti verificati, fibra garantita e una community di
                    professionisti remoti nella destinazione più sottovalutata d'Europa.
                </motion.p>

                {/* Nature-digital inline badges */}
                <motion.div
                    className="flex flex-wrap gap-2 justify-center mb-8 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.28, ease: EASE_EXPO }}
                >
                    {[
                        { icon: '🍋', label: 'Slow living' },
                        { icon: '🌊', label: 'Mare cristallino' },
                        { icon: '⚡', label: 'Fibra garantita' },
                        { icon: '🌿', label: 'Aria pulita' },
                    ].map(b => (
                        <span key={b.label} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '5px',
                            fontSize: '10px', fontFamily: '"Martian Mono", monospace', letterSpacing: '0.04em',
                            padding: '4px 10px', borderRadius: '20px',
                            background: 'rgba(212,168,83,0.1)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'rgba(255,255,255,0.7)',
                            whiteSpace: 'nowrap',
                        }}>
                            {b.icon} {b.label}
                        </span>
                    ))}
                </motion.div>

                {/* CTA buttons */}
                <motion.div
                    className="flex items-center justify-center gap-3 flex-wrap mb-10 w-full px-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.75, delay: 0.35, ease: EASE_EXPO }}
                >
                    <a href="#waitlist" className="btn-gold w-full sm:w-auto text-center py-4 sm:py-3.5">
                        Iscriviti alla Waitlist
                    </a>
                    <a href="#properties" className="btn-ghost w-full sm:w-auto text-center py-4 sm:py-3.5"
                        style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = 'white'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'white'; }}
                    >
                        Vedi le strutture →
                    </a>
                </motion.div>

                {/* Social proof */}
                <motion.div
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.45 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex">
                            {AVATARS.map((a, i) => (
                                <div key={i} className="avatar-ring" style={{ background: a.bg, zIndex: AVATARS.length - i }} />
                            ))}
                        </div>
                        <div className="text-left">
                            <div className="text-accent text-sm tracking-wider">★★★★★</div>
                            <div className="text-xs text-white/70">
                                <span className="text-white font-medium">120+ nomadi</span> già in lista · 4.9 dai primi membri
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Bottom stats bar ── */}
            <motion.div
                className="relative w-full mt-20 border-t border-white/10"
                style={{ zIndex: 10 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.55 }}
            >
                <div className="max-w-content mx-auto px-6 md:px-10">
                    <div className="flex flex-col md:flex-row items-center justify-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                        {STATS.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 px-8 py-5">
                                <span className="font-mono text-sm font-medium text-white">{s.value}</span>
                                <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">{s.suffix}</span>
                                {i < STATS.length - 1 && <span className="hidden md:inline ml-2 text-accent opacity-40">·</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
