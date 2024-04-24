import { createClient } from '@connect2ic/core';
import { defaultProviders } from '@connect2ic/core/providers';
import '@connect2ic/core/style.css';
import { Connect2ICProvider } from '@connect2ic/react';
import { ConfigProvider } from 'antd';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './App.css';
import * as backend from './declarations/backend/';
import { FramePage } from './pages/Frame/FramePage/FramePage';
import { PlayGround } from './pages/PlayGround/PlayGround';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PlayGround />,
  },
  {
    path: '/frames/:id',
    element: <FramePage />,
  },
]);

function App() {
  return (
    <ConfigProvider
      theme={{
        //algorithm: theme.darkAlgorithm,
        token: {
          // Seed Token
          colorPrimary: 'de483e',
          fontFamily: 'Jost',

          // Alias Token
          //colorBgContainer: 'yellow',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

const client = createClient({
  canisters: {
    backend: { ...backend } as any,
  },
  providers: defaultProviders as any,
  globalProviderConfig: {
    dev: import.meta.env.DEV,
  },
});

export default () => (
  <Connect2ICProvider client={client}>
    <App />
  </Connect2ICProvider>
);
