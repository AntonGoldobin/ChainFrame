import { useEffect, useRef, useState } from 'react';
import { zoomConfig } from '../../config/zoomConfig';
import { IFrame } from '../../models/IFrame';
import { getFrameById } from '../../utils/mockApi';
import { IFrameConfig } from '../FrameChain/FrameChain';
import ImageCanvas from '../ImageCanvas/ImageCanvas';
import { AbsoluteImageContainer } from './AbsoluteImage.styled';

export interface IAbsoluteImageProps {
  id: string;
}

export const AbsoluteImage = ({
  id,
  setFrameConfig,
}: IAbsoluteImageProps & IFrameConfig) => {
  const ref = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<IFrame | null>(null);
  const [isShown, setIsShown] = useState(true);

  useEffect(() => {
    //backend.get().then((count) => console.log(count));
    getFrameById(id)
      .then((frame) => setFrame(frame))
      .catch(console.error);
  }, [id]);

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
    if (id !== '3') {
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
        firstFrameId: '1',
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
          {isShown && <ImageCanvas imageUrl={frame.image_url} />}

          {frame?.children_ids &&
            frame?.children_ids?.map((id) => (
              <AbsoluteImage key={id} id={id} setFrameConfig={setFrameConfig} />
            ))}
        </div>
      </AbsoluteImageContainer>
    )
  );
};
