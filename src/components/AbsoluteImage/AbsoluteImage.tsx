import { useEffect, useRef, useState } from 'react';
import { zoomConfig } from '../../config/zoomConfig';
import { backend } from '../../declarations/backend';
import { IFrame } from '../../models/IFrame';
import { IFrameConfig } from '../FrameChain/FrameChain';
import ImageCanvas from '../ImageCanvas/ImageCanvas';
import { AbsoluteImageContainer } from './AbsoluteImage.styled';

export interface IAbsoluteImageProps {
  id: number;
}

export const AbsoluteImage = ({
  id,
  setFrameConfig,
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
    if (!frame?.children_ids[0]?.[0]) {
      return;
    }
    console.log(frame);
    console.log('id', Number(frame?.children_ids[0][0]));
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

    console.log(curFrameBounding.width + curFrameBounding?.left, clientWidth);
    console.log(isElementOnLeft, isElementFillsAllX, isElementFillsAllY);
    return isElementOnLeft && isElementFillsAllX && isElementFillsAllY;
  };

  const checkRefSize = () => {
    if (id !== 4) {
      return;
    }

    const curFrameBounding = ref.current?.getBoundingClientRect();
    const curFrameUnscaledWidth = ref.current?.offsetWidth;

    console.log(ref.current?.offsetWidth);

    if (!curFrameBounding || !curFrameUnscaledWidth) {
      return;
    }

    if (isFrameBiggerThanDisplay()) {
      console.log('Changed!');
      console.log(
        'scale should be:',
        curFrameBounding.width / curFrameUnscaledWidth,
      );
      setFrameConfig({
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
            frame?.children_ids?.map((id) => (
              <AbsoluteImage
                key={Number(id[0])}
                id={Number(id[0])}
                setFrameConfig={setFrameConfig}
              />
            ))}
        </div>
      </AbsoluteImageContainer>
    )
  );
};
