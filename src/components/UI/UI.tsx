import { Button, Typography } from 'antd';
import { useEffect } from 'react';
import useInternetIdentity from '../../context/internet-identity/internet-identity';
import { backend } from '../../declarations/backend';
import * as styled from './UI.styled';

export const UI = () => {
  const { authenticate, isAuthed, identity, principal, logout } =
    useInternetIdentity();

  useEffect(
    () => console.log(isAuthed, identity, principal),
    [isAuthed, identity, principal],
  );

  interface ITestFrame {
    image_url: string;
    top: number;
    left: number;
    width: number;
    height: number;
    children_ids: [] | [number[] | Uint32Array];
  }

  useEffect(() => {
    const newFrame: ITestFrame = {
      image_url:
        'https://plus.unsplash.com/premium_photo-1683140811960-956e5bbf858e?q=80&w=2954&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      children_ids: [],
    };

    backend.insert_frame(newFrame).then((count) => {
      console.log('count', count);
    });
  }, []);

  //const getFrameById = () => {
  //	backend.get_frame_by_id()
  //}

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
