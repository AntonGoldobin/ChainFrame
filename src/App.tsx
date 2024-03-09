import { ConfigProvider, theme } from 'antd';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { EditFrame } from './pages/Frame/EditFrame/EditFrame';
import { PlayGround } from './pages/PlayGround/PlayGround';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PlayGround />,
  },
  {
    path: '/frames/:id',
    element: <EditFrame />,
  },
]);

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          // Seed Token
          colorPrimary: 'orange',

          // Alias Token
          //colorBgContainer: 'yellow',
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

export default App;
