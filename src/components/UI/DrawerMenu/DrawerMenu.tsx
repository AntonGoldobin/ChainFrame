import { AppstoreOutlined, MenuOutlined } from '@ant-design/icons';
import { useConnect } from '@connect2ic/react';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { backend } from '../../../declarations/backend';
import { IRustFrame } from '../../../models/IFrame';
import * as styled from './DrawerMenu.styled';

type MenuItem = Required<MenuProps>['items'][number];

export interface MenuInfo {
  key: string;
  keyPath: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const DrawerMenu = () => {
  const { principal } = useConnect();
  const [myFrames, setMyFrames] = useState<IRustFrame[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const canisterId = searchParams.get('canisterId');

  const items: MenuItem[] = [
    getItem(
      'My Frames',
      'my-frames',
      <AppstoreOutlined />,
      myFrames.map((frame) =>
        getItem(frame.id.toString(), frame.id.toString()),
      ),
    ),
  ];

  useEffect(() => {
    if (!principal) {
      return;
    }
    console.log(principal);

    backend.get_frames_by_owner(principal).then((frames: any) => {
      setMyFrames(frames);
      console.log(frames);
    });
  }, [principal]);

  const handleClick = (event: MenuInfo) => {
    console.log(event);
    navigate(`frames/${event.key}?canisterId=${canisterId}`);
  };

  return (
    <>
      <Button icon={<MenuOutlined />} onClick={() => setIsDrawerOpen(true)} />
      <styled.LeftDrawer
        width={250}
        title="FRAME CHAIN"
        placement="left"
        closable={false}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        key="left"
      >
        <Menu
          style={{ width: '100%' }}
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          onClick={(event: MenuInfo) => handleClick(event)}
          mode="inline"
          items={items}
        />
      </styled.LeftDrawer>
    </>
  );
};
