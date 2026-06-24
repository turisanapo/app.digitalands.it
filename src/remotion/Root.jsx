import { Composition } from 'remotion';
import { SicilyShowcase } from './SicilyShowcase';

export const RemotionRoot = () => {
  return (
    <Composition
      id="SicilyShowcase"
      component={SicilyShowcase}
      durationInFrames={180}
      fps={30}
      width={1400}
      height={613}
    />
  );
};
