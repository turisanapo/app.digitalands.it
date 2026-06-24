import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadUnbounded } from '@remotion/google-fonts/Unbounded';
import { loadFont as loadMartianMono } from '@remotion/google-fonts/MartianMono';

const { fontFamily: fontHeading } = loadUnbounded('normal', {
  weights: ['700'],
  subsets: ['latin'],
});
const { fontFamily: fontMono } = loadMartianMono('normal', {
  weights: ['400'],
  subsets: ['latin'],
});

const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1400&q=85&fit=crop',
    word: 'Svegliati.',
    sub: 'Terrazza sul Mediterraneo',
    from: 0,
    duration: 68,
  },
  {
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=85&fit=crop',
    word: 'Lavora.',
    sub: 'Fibra certificata · 200 Mbps',
    from: 60,
    duration: 68,
  },
  {
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85&fit=crop',
    word: 'Vivi così.',
    sub: 'Marina di Ragusa · Sicilia',
    from: 120,
    duration: 60,
  },
];

function Slide({ img, word, sub, duration }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const FADE = Math.round(fps / 3);
  const TEXT_ENTER = Math.round(fps * 0.27);

  const opacity = interpolate(
    frame,
    [0, FADE, duration - FADE, duration],
    [0, 1, 1, 0],
    {
      easing: EXPO_OUT,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Ken Burns — slow zoom in via individual CSS scale property
  const kenBurnsScale = interpolate(frame, [0, duration], [1.0, 1.06], {
    easing: Easing.bezier(0.45, 0, 0.55, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textOpacity = interpolate(
    frame,
    [TEXT_ENTER, TEXT_ENTER + FADE, duration - FADE, duration],
    [0, 1, 1, 0],
    {
      easing: EXPO_OUT,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Text slide-up via individual CSS translate property
  const textY = interpolate(frame, [TEXT_ENTER, TEXT_ENTER + FADE], [28, 0], {
    easing: EXPO_OUT,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const accentOpacity = interpolate(
    frame,
    [TEXT_ENTER, TEXT_ENTER + FADE],
    [0, 0.85],
    {
      easing: EXPO_OUT,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      {/* Ken Burns image layer */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        <div
          style={{
            position: 'absolute',
            inset: '-8%',
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            scale: kenBurnsScale,
          }}
        />
      </AbsoluteFill>

      {/* Cinematic gradient overlay */}
      <AbsoluteFill
        style={{
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
          opacity: accentOpacity,
        }}
      />

      {/* Text block */}
      <div
        style={{
          position: 'absolute',
          bottom: '13%',
          left: '7%',
          opacity: textOpacity,
          translate: `0px ${textY}px`,
        }}
      >
        <div
          style={{
            fontFamily: fontMono,
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
            fontFamily: fontHeading,
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
          fontFamily: fontHeading,
          fontSize: '10px',
          letterSpacing: '0.18em',
          color: 'rgba(212,168,83,0.45)',
          textTransform: 'uppercase',
          opacity: textOpacity,
        }}
      >
        Digitalands
      </div>
    </AbsoluteFill>
  );
}

export function SicilyShowcase() {
  return (
    <AbsoluteFill style={{ background: '#0A0A0A' }}>
      {SLIDES.map((slide) => (
        <Sequence key={slide.word} from={slide.from} durationInFrames={slide.duration}>
          <Slide
            img={slide.img}
            word={slide.word}
            sub={slide.sub}
            duration={slide.duration}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
