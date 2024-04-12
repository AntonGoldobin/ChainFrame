import { useCallback, useState } from 'react';
import Draggable from 'react-draggable';
import { FrameChain, IFrameChainProps } from '../FrameChain/FrameChain';

export const TransformContainer = () => {
  const [frameConfig, setFrameConfig] = useState<IFrameChainProps>({
    initScale: 1,
    firstFrameId: '1',
    initTranslateX: 0,
    initTranslateY: 0,
  });

  const getFrameComponent = useCallback(
    () => (
      <FrameChain
        {...frameConfig}
        setFrameConfig={setFrameConfig}
        key={frameConfig.initScale}
      />
    ),
    [frameConfig],
  );

  return (
    <div
      id="transform-container"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Draggable>
        <>{getFrameComponent()}</>
      </Draggable>
    </div>
  );
};
