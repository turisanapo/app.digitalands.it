import {
  AbsoluteFill,
  Easing,
  interpolate,
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

// 150 frames total (5s @ 30fps)
// Stat enters at `startFrame`, counter runs for COUNT_FRAMES

function StatItem({ target, prefix = '', suffix = '', label, sub, frame, startFrame, fps }) {
  const ENTER = Math.round(fps * 0.5);
  const COUNT = Math.round(fps * 2);

  const local = frame - startFrame;

  const appear = interpolate(local, [0, ENTER], [0, 1], {
    easing: EXPO_OUT,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slideY = interpolate(local, [0, ENTER], [36, 0], {
    easing: EXPO_OUT,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const count = Math.round(
    interpolate(local, [0, COUNT], [0, target], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const countProgress = interpolate(local, [0, COUNT], [0, 1], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: appear,
        translate: `0px ${slideY}px`,
      }}
    >
      {/* Number */}
      <div
        style={{
          fontFamily: fontHeading,
          fontSize: '88px',
          fontWeight: '700',
          color: '#D4A853',
          lineHeight: 1,
          letterSpacing: '-0.03em',
        }}
      >
        {prefix}
        {count}
        {suffix}
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: fontMono,
          fontSize: '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          marginTop: '18px',
          opacity: 0.9,
        }}
      >
        {label}
      </div>

      {/* Sub-label */}
      <div
        style={{
          fontFamily: fontMono,
          fontSize: '10px',
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.3)',
          marginTop: '6px',
        }}
      >
        {sub}
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: '56px',
          height: '1px',
          background: 'rgba(212,168,83,0.15)',
          marginTop: '20px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${countProgress * 100}%`,
            background: '#D4A853',
          }}
        />
      </div>
    </div>
  );
}

export function StatsCounter() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TITLE_ENTER = Math.round(fps * 0.5);
  const LINE_START  = Math.round(fps * 0.33);
  const LINE_END    = Math.round(fps * 1.2);
  const STAT1_START = Math.round(fps * 0.67);
  const STAT2_START = Math.round(fps * 1.4);
  const STAT3_START = Math.round(fps * 2.13);
  const BOTTOM_START = Math.round(fps * 3.33);
  const BOTTOM_END   = Math.round(fps * 4.0);

  const titleOpacity = interpolate(frame, [0, TITLE_ENTER], [0, 1], {
    easing: EXPO_OUT,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(frame, [0, TITLE_ENTER], [-18, 0], {
    easing: EXPO_OUT,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Separator line extends left→right
  const lineWidth = interpolate(frame, [LINE_START, LINE_END], [0, 100], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bottomOpacity = interpolate(frame, [BOTTOM_START, BOTTOM_END], [0, 1], {
    easing: EXPO_OUT,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: '#0A0A0A' }}>
      {/* Ambient gold glow */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(212,168,83,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Content column */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 100px',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontFamily: fontMono,
            fontSize: '11px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(212,168,83,0.55)',
            marginBottom: '24px',
            opacity: titleOpacity,
            translate: `0px ${titleY}px`,
          }}
        >
          La Sicilia in numeri
        </div>

        {/* Separator line — grows left to right */}
        <div
          style={{
            height: '1px',
            width: `${lineWidth}%`,
            maxWidth: '520px',
            background: 'rgba(212,168,83,0.22)',
            marginBottom: '60px',
          }}
        />

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            maxWidth: '880px',
            alignItems: 'flex-start',
          }}
        >
          <StatItem
            target={200}
            suffix=" Mbps"
            label="Fibra verificata"
            sub="ogni alloggio"
            frame={frame}
            startFrame={STAT1_START}
            fps={fps}
          />

          {/* Vertical divider */}
          <div
            style={{
              width: '1px',
              height: '110px',
              background: 'rgba(212,168,83,0.12)',
              alignSelf: 'center',
              flexShrink: 0,
            }}
          />

          <StatItem
            target={120}
            suffix="+"
            label="Nomadi attivi"
            sub="nella comunità"
            frame={frame}
            startFrame={STAT2_START}
            fps={fps}
          />

          {/* Vertical divider */}
          <div
            style={{
              width: '1px',
              height: '110px',
              background: 'rgba(212,168,83,0.12)',
              alignSelf: 'center',
              flexShrink: 0,
            }}
          />

          <StatItem
            target={690}
            prefix="€"
            label="/mese"
            sub="tutto incluso"
            frame={frame}
            startFrame={STAT3_START}
            fps={fps}
          />
        </div>

        {/* Bottom watermark */}
        <div
          style={{
            marginTop: '60px',
            fontFamily: fontMono,
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(212,168,83,0.25)',
            opacity: bottomOpacity,
          }}
        >
          Digitalands · Marina di Ragusa · Sicilia
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
