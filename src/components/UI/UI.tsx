import { ConnectButton, ConnectDialog, useConnect } from '@connect2ic/react';
import { Button, Typography } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useInternetIdentity from '../../context/internet-identity/internet-identity';
import * as styled from './UI.styled';

export const UI = () => {
  const {
    authenticate,
    isAuthed,
    identity,
    principal: test,
    logout,
  } = useInternetIdentity();

  const { isConnected, principal, activeProvider } = useConnect({
    onConnect: () => {
      console.log('connected');
    },
    onDisconnect: () => {
      console.log('disconected');
    },
  });

  const navigate = useNavigate();

  useEffect(
    () => console.log(isAuthed, identity, principal),
    [isAuthed, identity, principal],
  );

  const handleWhoAmI = () => {
    console.log(isAuthed);
    console.log(identity?.getPrincipal().toText());
  };

  const handleLogOut = () => {
    logout();
  };

  const editFrame = () => {
    navigate('frames/' + 1);
  };

  return (
    <styled.Topbar>
      <styled.TopbarBlock></styled.TopbarBlock>
      <ConnectButton />
      <ConnectDialog dark={false} />
      {isAuthed ? (
        <styled.TopbarBlock>
          <Button onClick={() => editFrame()}>Редактировать</Button>
          <Typography.Text>{identity?.getPrincipal().toText()}</Typography.Text>
          <Button onClick={() => handleLogOut()} type="primary">
            Выйти
          </Button>
        </styled.TopbarBlock>
      ) : (
        <Button onClick={() => authenticate()} type="primary">
          Войти
        </Button>
      )}
    </styled.Topbar>
  );
};
