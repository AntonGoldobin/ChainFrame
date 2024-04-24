import { useConnect } from '@connect2ic/react';
import { Button, message } from 'antd';
import { useEffect, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useParams } from 'react-router-dom';
import { backend } from '../../../declarations/backend';
import { IFrame, IFrameCreateRequest } from '../../../models/IFrame';
import * as styled from './EditFrame.styled';

export const EditFrame = () => {
  const [crop, setCrop] = useState<Crop>();
  const { id: frameId } = useParams();
  const [frame, setFrame] = useState<IFrame | null | undefined>(null);

  const { principal } = useConnect();

  useEffect(() => console.log(principal), [principal]);

  const handleCreateFrame = () => {
    if (!crop) {
      message.error(
        'Please select a part of the frame for creating a new frame.',
      );
      return;
    }

    if (!frameId) {
      message.error('No frame ID.');
      return;
    }

    const newFrame: IFrameCreateRequest = {
      top: Math.floor(crop.y),
      left: Math.floor(crop.x),
      width: Math.floor(crop.width),
      height: Math.floor(crop.height),
      owner: principal,
      parent_id: BigInt(frameId),
    };

    backend.insert_frame(newFrame).then((childId: BigInt) => {
      console.log('createdFrame', childId);
    });
  };

  useEffect(() => {
    //console.log(frameId, backend);
    if (!frameId) return;

    const getAndSetFrame = async () => {
      //console.log(backend);
      const frameRes = await backend?.get_frame_by_id(BigInt(frameId));
      setFrame(frameRes[0] as any as IFrame);
      console.log(frameRes);
    };
    getAndSetFrame();
  }, [frameId, backend]);

  useEffect(() => console.log(crop), [crop]);

  return (
    <styled.Container>
      <Button onClick={handleCreateFrame}>CreateFrame</Button>
      <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1}>
        <styled.ImageContainer src={frame?.image_url[0]} />
      </ReactCrop>
    </styled.Container>
  );
};
