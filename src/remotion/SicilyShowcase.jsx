import { useCurrentFrame, interpolate, useVideoConfig } from 'remotion';

// 6 seconds @ 30fps = 180 frames
// Three cinematic slides of 60 frames each, 8-frame crossfades

const SLIDES = [
    {
        img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&q=85&fit=crop',
        word: 'Svegliati.',
        sub: 'Terrazza sul Mediterraneo',
        start: 0,
        end: 68,
    },
    {
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85&fit=crop',
        word: 'Lavora.',
        sub: 'Fibra certificata · 200 Mbps',
        start: 60,
        end: 128,
    },
    {
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85&fit=crop',
        word: 'Vivi così.',
        sub: 'Marina di Ragusa · Sicilia',
        start: 120,
        end: 180,
    },
];

function Slide({ img, word, sub, start, end }) {
    const frame = useCurrentFrame();
    const local = frame - start;
    const duration = end - start;

    const opacity = interpolate(
        local,
        [0, 10, duration - 10, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    // Ken Burns — slow zoom in
    const scale = interpolate(local, [0, duration], [1.0, 1.06], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const textY = interpolate(local, [6, 22], [28, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
    });

    const textOpacity = interpolate(
        local,
        [8, 22, duration - 10, duration],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );

    if (local < 0 || local > duration) return null;

    return (
        <div style={{ position: 'absolute', inset: 0, opacity }}>
            {/* Ken Burns image layer */}
            <div
                style={{
                    position: 'absolute',
                    inset: '-8%',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: `scale(${scale})`,
                }}
            />

            {/* Cinematic gradient overlay */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'linear-gradient(110deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.55) 100%)',
                }}
            />

            {/* Gold left accent line */}
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: '18%',
                    bottom: '18%',
                    width: '3px',
                    background:
                        'linear-gradient(to bottom, transparent, #D4A853 30%, #D4A853 70%, transparent)',
                    opacity: textOpacity * 0.85,
                }}
            />

            {/* Text */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '13%',
                    left: '7%',
                    opacity: textOpacity,
                    transform: `translateY(${textY}px)`,
                }}
            >
                <div
                    style={{
                        fontFamily: '"Martian Mono", monospace',
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        color: '#D4A853',
                        textTransform: 'uppercase',
                        marginBottom: '14px',
                        opacity: 0.85,
                    }}
                >
                    {sub}
                </div>
                <div
                    style={{
                        fontFamily: '"Unbounded", sans-serif',
                        fontSize: '72px',
                        fontWeight: '700',
                        color: '#FFFFFF',
                        lineHeight: 1,
                        letterSpacing: '-0.025em',
                    }}
                >
                    {word}
                </div>
            </div>

            {/* Watermark */}
            <div
                style={{
                    position: 'absolute',
                    top: '6%',
                    right: '6%',
                    fontFamily: '"Unbounded", sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: 'rgba(212,168,83,0.45)',
                    textTransform: 'uppercase',
                    opacity: textOpacity,
                }}
            >
                Digitalands
            </div>
        </div>
    );
}

export function SicilyShowcase() {
    const { width, height } = useVideoConfig();

    return (
        <div
            style={{
                width,
                height,
                position: 'relative',
                background: '#0A0A0A',
                overflow: 'hidden',
            }}
        >
            {SLIDES.map((slide) => (
                <Slide key={slide.word} {...slide} />
            ))}
        </div>
    );
}
