import { Button } from 'antd';
import { useEffect, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useParams } from 'react-router-dom';
import * as canister from '../../../declarations/backend';
import { IFrame, IFrameCreateRequest } from '../../../models/IFrame';
import * as styled from './EditFrame.styled';

export const EditFrame = () => {
  const [crop, setCrop] = useState<Crop>();
  const { id: frameId } = useParams();
  const [frame, setFrame] = useState<IFrame | null | undefined>(null);

  const handleCreateFrame = () => {
    //if (!crop) {
    //  message.error(
    //    'Please select a part of the frame for creating a new frame.',
    //  );
    //  return;
    //}

    const newFrame: IFrameCreateRequest = {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
    };

    canister.backend.insert_frame(newFrame).then((createdFrame) => {
      console.log('createdFrame', createdFrame);
    });
  };

  useEffect(() => {
    console.log(frameId, canister.backend);
    if (!frameId) return;

    const getAndSetFrame = async () => {
      console.log(canister.backend);
      const frameRes = await canister.backend?.get_frame_by_id(BigInt(frameId));
      setFrame(frameRes[0] as any as IFrame);
      console.log(frameRes);
    };
    getAndSetFrame();
  }, [frameId, canister.backend]);

  useEffect(() => console.log(crop), [crop]);

  return (
    <styled.Container>
      <Button onClick={handleCreateFrame}>CreateFrame</Button>
      <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
        <styled.ImageContainer src={frame?.image_url[0]} />
      </ReactCrop>
    </styled.Container>
  );
};
