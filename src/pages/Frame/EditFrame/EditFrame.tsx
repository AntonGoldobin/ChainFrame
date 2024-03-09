import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { IFrameCreateRequest } from '../../../models/IFrame';
import * as styled from './EditFrame.styled';

export const EditFrame = () => {
  const [crop, setCrop] = useState<Crop>();

  const handleCreateFrame = () => {
    if (!crop) {
      message.error(
        'Please select a part of the frame for creating a new frame.',
      );
      return;
    }

    const newFrame: IFrameCreateRequest = {
      top: crop?.y,
      left: crop?.x,
      width: crop?.width,
      height: crop?.height,
    };

    //backend.addFrame(newFrame);
  };

  useEffect(() => console.log(crop), [crop]);

  return (
    <styled.Container>
      <Button onClick={handleCreateFrame}>CreateFrame</Button>
      <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
        <styled.ImageContainer src="https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg" />
      </ReactCrop>
    </styled.Container>
  );
};
