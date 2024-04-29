import renderer from 'react-test-renderer';
import { TransformContainer } from '../components/TransformContainer/TransformContainer';

jest.mock('react-draggable');
jest.mock('../FrameChain/FrameChain');

const renderTree = (tree) => renderer.create(tree);
describe('<TransformContainer>', () => {
  it('should render component', () => {
    expect(renderTree(<TransformContainer />).toJSON()).toMatchSnapshot();
  });
});
