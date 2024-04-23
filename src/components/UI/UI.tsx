import { MenuOutlined } from '@ant-design/icons';
import { ConnectButton, ConnectDialog, useConnect } from '@connect2ic/react';
import { Button, Drawer } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DrawerMenu } from './DrawerMenu/DrawerMenu';
import * as styled from './UI.styled';

export const UI = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { isConnected, principal, activeProvider } = useConnect({
    onConnect: () => {
      console.log('connected');
    },
    onDisconnect: () => {
      console.log('disconected');
    },
  });

  const navigate = useNavigate();

  const editFrame = () => {
    navigate('frames/' + 1);
  };

  return (
    <>
      <styled.TopBar>
        <styled.TopBarBlock>
          <Button
            icon={<MenuOutlined />}
            onClick={() => setIsDrawerOpen(true)}
          />
        </styled.TopBarBlock>

        <styled.TopBarBlock>
          <ConnectButton />
          <ConnectDialog dark={false} />
          {isConnected && <Button onClick={() => editFrame()}>Edit</Button>}
        </styled.TopBarBlock>
      </styled.TopBar>
      {/*Drawer*/}
      <Drawer
        title="FRAME CHAIN"
        placement="left"
        closable={false}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        key="left"
      >
        <DrawerMenu />
      </Drawer>
    </>
  );
};
