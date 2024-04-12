import { Dispatch, SetStateAction, useState } from 'react';
import { zoomConfig } from '../../config/zoomConfig';
import { useZoom } from '../../hooks/useZoom';
import { AbsoluteImage } from '../AbsoluteImage/AbsoluteImage';

export interface IFrameChainProps {
  firstFrameId: string;
  initScale: number;
  initTranslateX: number;
  initTranslateY: number;
}

export interface IFrameConfig {
  setFrameConfig: Dispatch<SetStateAction<IFrameChainProps>>;
}

export const FrameChain = ({
  firstFrameId,
  initScale,
  initTranslateX,
  initTranslateY,
  setFrameConfig,
}: IFrameChainProps & IFrameConfig) => {
  const [isZoomEnabled, setIsZoomEnabled] = useState(true);

  const { elementRef, styles } = useZoom({
    isZoomEnabled,
    initScale,
    initTranslateX,
    initTranslateY,
  });

  const initTransformStyle = `translate(${initTranslateX}px, ${initTranslateY}px) scale(${initScale})`;

  return (
    <>
      {/*Main container*/}
      <div
        style={{ transform: initTransformStyle, ...styles }}
        ref={elementRef}
      >
        <div
          style={{
            position: 'relative',
            touchAction: 'none',
            width: zoomConfig.frame.defaultWidth + 'px',
            height: zoomConfig.frame.defaultHeight + 'px',
          }}
        >
          {/*Content*/}
          <AbsoluteImage id={firstFrameId} setFrameConfig={setFrameConfig} />
        </div>
      </div>
    </>
  );
};
