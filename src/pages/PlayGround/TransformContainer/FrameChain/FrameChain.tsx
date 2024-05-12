import { Dispatch, SetStateAction, useState } from 'react';
import { zoomConfig } from '../../../../config/zoomConfig';
import { useZoom } from '../../../../hooks/useZoom';
import { AbsoluteImage } from './AbsoluteImage/AbsoluteImage';

export interface IFrameChainProps {
  firstFrameId: number;
  initScale: number;
  initTranslateX: number;
  initTranslateY: number;
}

export interface IFrameConfig {
  setFrameConfig: Dispatch<SetStateAction<IFrameChainProps>>;
  countRenderedFrame: (id: number, frameConfig: IFrameChainProps) => void;
}

export const FrameChain = ({
  firstFrameId,
  initScale,
  initTranslateX,
  initTranslateY,
  setFrameConfig,
  countRenderedFrame,
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
          <AbsoluteImage
            id={firstFrameId}
            setFrameConfig={setFrameConfig}
            countRenderedFrame={countRenderedFrame}
          />
        </div>
      </div>
    </>
  );
};
