import { Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

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

export const useInternetIdentity = () => useContext(InternetIdentityContext);

export default function InternetIdentityProvider({
  children,
}: {
  children?: ReactNode;
}) {
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

  const value = {
    authenticate,
    isAuthed,
    identity,
    principal,
  };

  if (isAuthed === undefined || identity === undefined) {
    return <div>Test</div>;
  }

  return (
    <InternetIdentityContext.Provider value={value}>
      {children}
    </InternetIdentityContext.Provider>
  );
}
