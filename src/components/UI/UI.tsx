import { Button, Typography } from 'antd';
import { useEffect } from 'react';
import useInternetIdentity from '../../context/internet-identity/internet-identity';
import * as styled from './UI.styled';

export const UI = () => {
  const { authenticate, isAuthed, identity, principal, logout } =
    useInternetIdentity();

  useEffect(
    () => console.log(isAuthed, identity, principal),
    [isAuthed, identity, principal],
  );

  useEffect(() => {
    //backend.getFrames().then((count) => {
    //  console.log('count', count);
    //});
  }, []);

  const handleWhoAmI = () => {
    console.log(isAuthed);
    console.log(identity?.getPrincipal().toText());
  };

  const handleLogOut = () => {
    logout();
  };

  return (
    <styled.Topbar>
      <styled.TopbarBlock></styled.TopbarBlock>
      {isAuthed ? (
        <styled.TopbarBlock>
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
