import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { createContext, useEffect, useState } from 'react';

interface InternetIdentityState {
  authenticate: (callback?: () => void) => void;
  isAuthed?: boolean;
  identity?: Identity;
  principal?: Principal;
}

const DefaultState: InternetIdentityState = {
  authenticate: (callback?: () => void) => {},
  isAuthed: undefined,
  identity: undefined,
  principal: undefined,
};

export const InternetIdentityContext =
  createContext<InternetIdentityState>(DefaultState);

export default function useInternetIdentity() {
  const [isAuthed, setIsAuthed] = useState<boolean>();
  const [identity, setIdentity] = useState<Identity>();
  const [client, setClient] = useState<AuthClient>();
  const [principal, setPrincipal] = useState<Principal>();

  useEffect(() => {
    AuthClient.create().then(setClient);
  }, []);

  useEffect(() => {
    console.log(principal?.toText());
  }, [principal]);

  useEffect(() => {
    client
      ?.isAuthenticated()
      .then(setIsAuthed)
      .then(() => {
        const id = client?.getIdentity();
        setIdentity(id);
        setPrincipal(id.getPrincipal());
      });
  }, [client]);

  async function authenticate(callback?: () => void) {
    console.log('authenticate');
    client?.login({
      onSuccess: () => {
        setIsAuthed(true);
        setIdentity(client.getIdentity());
        if (callback) callback();
      },
    });
  }

  async function logout() {
    client?.logout();
    setIsAuthed(false);
    setIdentity(undefined);
    setPrincipal(undefined);
  }

  return { authenticate, isAuthed, identity, principal, logout };
}
