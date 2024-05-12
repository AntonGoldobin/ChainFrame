import { useEffect, useRef, useState } from 'react';
import ImageCanvas from '../../../../../components/ImageCanvas/ImageCanvas';
import { zoomConfig } from '../../../../../config/zoomConfig';
import { backend } from '../../../../../declarations/backend';
import { IFrame } from '../../../../../models/IFrame';
import { IFrameChainProps, IFrameConfig } from '../FrameChain';
import { AbsoluteImageContainer } from './AbsoluteImage.styled';

export interface IAbsoluteImageProps {
  id: number;
  countRenderedFrame: (id: number, frameConfig: IFrameChainProps) => void;
}

export const AbsoluteImage = ({
  id,
  setFrameConfig,
  countRenderedFrame,
}: IAbsoluteImageProps & IFrameConfig) => {
  const ref = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<IFrame | null>(null);
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }

    backend
      .get_frame_by_id(BigInt(id))
      .then((frames) => setFrame(frames?.[0] as any));
  }, [id]);

  useEffect(() => {
    console.log(frame);
  }, [frame]);

  // Check is frame ready to be changed to a new Frame Chain
  const isFrameBiggerThanDisplay = () => {
    const curFrameBounding = ref.current?.getBoundingClientRect();
    const clientWidth = window.innerWidth;
    const clientHeight = window.innerHeight;

    if (!curFrameBounding) {
      return false;
    }
    const isElementOnLeft = curFrameBounding?.left < 0;
    const isElementFillsAllX =
      curFrameBounding.width + curFrameBounding?.left > clientWidth;
    const isElementFillsAllY =
      curFrameBounding.height + curFrameBounding.top > clientHeight;

    return isElementOnLeft && isElementFillsAllX && isElementFillsAllY;
  };

  const checkRefSize = () => {
    const curFrameBounding = ref.current?.getBoundingClientRect();
    const curFrameUnscaledWidth = ref.current?.offsetWidth;

    console.log(ref.current?.offsetWidth);

    if (!curFrameBounding || !curFrameUnscaledWidth) {
      return;
    }

    // Count size of rendered frames, if more than 6, rerender whole screen
    if (isFrameBiggerThanDisplay()) {
      countRenderedFrame(id, {
        firstFrameId: 0,
        initTranslateX: curFrameBounding?.left,
        initTranslateY: curFrameBounding?.top,
        initScale: curFrameBounding.width / curFrameUnscaledWidth,
      });
    }
  };

  checkRefSize();

  return (
    frame && (
      <AbsoluteImageContainer
        ref={ref}
        key={id}
        style={{
          top: frame.top,
          left: frame.left,
          transform: `scale(${frame?.height / zoomConfig.frame.defaultHeight})`,
        }}
      >
        <div style={{ position: 'relative' }}>
          {isShown && <ImageCanvas imageUrl={frame.image_url[0]} />}

          {frame?.children_ids &&
            frame?.children_ids?.map((childId) => (
              <AbsoluteImage
                key={Number(childId[0])}
                id={Number(childId[0])}
                setFrameConfig={setFrameConfig}
                countRenderedFrame={countRenderedFrame}
              />
            ))}
        </div>
      </AbsoluteImageContainer>
    )
  );
};
