import renderer from 'react-test-renderer';
import { PlayGround } from '../pages/PlayGround/PlayGround';

jest.mock('../../components/TransformContainer/TransformContainer');
jest.mock('../../components/UI/UI');
jest.mock('./PlayGround.styled');

const renderTree = (tree) => renderer.create(tree);
describe('<PlayGround>', () => {
  it('should render component', () => {
    expect(renderTree(<PlayGround />).toJSON()).toMatchSnapshot();
  });
});
