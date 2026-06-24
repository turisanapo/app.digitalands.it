import { Composition } from 'remotion';
import { SicilyShowcase } from './SicilyShowcase';
import { StatsCounter } from './StatsCounter';

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="SicilyShowcase"
        component={SicilyShowcase}
        durationInFrames={180}
        fps={30}
        width={1400}
        height={613}
      />
      <Composition
        id="StatsCounter"
        component={StatsCounter}
        durationInFrames={150}
        fps={30}
        width={1400}
        height={613}
      />
    </>
  );
};
