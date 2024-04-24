import { ConnectButton, ConnectDialog, useConnect } from '@connect2ic/react';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { DrawerMenu } from './DrawerMenu/DrawerMenu';
import * as styled from './UI.styled';

export const UI = () => {
  const { isConnected, principal, activeProvider } = useConnect({
    onConnect: () => {
      console.log('connected');
    },
    onDisconnect: () => {
      console.log('disconected');
    },
  });

  const navigate = useNavigate();

  return (
    <>
      <styled.TopBar>
        <styled.TopBarBlock>
          <DrawerMenu />
          <Typography.Title level={2} style={{ padding: 0, margin: 0 }}>
            FRAME CHAIN
          </Typography.Title>
        </styled.TopBarBlock>

        <styled.TopBarBlock>
          <ConnectButton />
          <ConnectDialog dark={false} />
        </styled.TopBarBlock>
      </styled.TopBar>
    </>
  );
};
