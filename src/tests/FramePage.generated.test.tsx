import renderer from 'react-test-renderer';

import { FramePage } from '../pages/Frame/FramePage/FramePage';

jest.mock('antd');
jest.mock('react-image-crop/dist/ReactCrop.css');
jest.mock('react-router-dom');
jest.mock('../../../components/UI/UI');
jest.mock('../../../declarations/backend');
jest.mock('../../../models/IFrame');
jest.mock('./AddNewChainFrame/AddNewChainFrame');
jest.mock('./EditFrame/EditFrame');
jest.mock('./FramePage.styled');

const renderTree = (tree) => renderer.create(tree);
describe('<FramePage>', () => {
  it('should render component', () => {
    expect(renderTree(<FramePage />).toJSON()).toMatchSnapshot();
  });
});
