import { Tabs, TabsProps } from 'antd';
import { useEffect, useState } from 'react';
import 'react-image-crop/dist/ReactCrop.css';
import { useParams } from 'react-router-dom';
import { UI } from '../../../components/UI/UI';
import { backend } from '../../../declarations/backend';
import { IRustFrame } from '../../../models/IFrame';
import { AddNewChainFrame } from './AddNewChainFrame/AddNewChainFrame';
import { EditFrame } from './EditFrame/EditFrame';
import * as styled from './FramePage.styled';

export const FramePage = () => {
  const { id: frameId } = useParams();
  const [frame, setFrame] = useState<IRustFrame | undefined>();

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: 'edit',
      label: 'Edit the current frame',
      children: <EditFrame frame={frame} />,
    },
    {
      key: 'add',
      label: 'Add new chain frame',
      children: <AddNewChainFrame frame={frame} />,
    },
  ];

  useEffect(() => {
    if (!frameId) return;

    const getAndSetFrame = async () => {
      const frameRes = await backend?.get_frame_by_id(BigInt(frameId));
      setFrame(frameRes[0]);
    };
    getAndSetFrame();
  }, [frameId, backend]);

  return (
    <styled.Container>
      <UI />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </styled.Container>
  );
};
