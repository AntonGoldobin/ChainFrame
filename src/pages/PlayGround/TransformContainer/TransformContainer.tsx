import { useCallback, useState } from 'react';
import Draggable from 'react-draggable';
import { FrameChain, IFrameChainProps } from './FrameChain/FrameChain';

export const TransformContainer = () => {
  const [frameConfig, setFrameConfig] = useState<IFrameChainProps>({
    initScale: 0.5,
    firstFrameId: 1,
    initTranslateX: 500,
    initTranslateY: 200,
  });

  const [renderedFramesIds, setRenderedFramesIds] = useState<number[]>([]);

  const countRenderedFrame = (
    frameId: number,
    frameConfig: IFrameChainProps,
  ) => {
    if (renderedFramesIds.find((id) => id === frameId)) {
      return;
    }

    if (setRenderedFramesIds.length > 6) {
      setFrameConfig(frameConfig);
      setRenderedFramesIds([frameId]);
      console.log('Changed!');
      return;
    }

    setRenderedFramesIds((prev) => [...prev, frameId]);
  };

  const getFrameComponent = useCallback(
    () => (
      <FrameChain
        {...frameConfig}
        setFrameConfig={setFrameConfig}
        countRenderedFrame={countRenderedFrame}
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
