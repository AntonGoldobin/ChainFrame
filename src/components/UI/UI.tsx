import { ConnectButton, ConnectDialog, useConnect } from '@connect2ic/react';
import { Button } from 'antd';
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

  const editFrame = () => {
    navigate('frames/' + 1);
  };

  return (
    <>
      <styled.TopBar>
        <styled.TopBarBlock>
          {/*Drawer*/}
          <DrawerMenu />
        </styled.TopBarBlock>

        <styled.TopBarBlock>
          <ConnectButton />
          <ConnectDialog dark={false} />
          {isConnected && <Button onClick={() => editFrame()}>Edit</Button>}
        </styled.TopBarBlock>
      </styled.TopBar>
    </>
  );
};
