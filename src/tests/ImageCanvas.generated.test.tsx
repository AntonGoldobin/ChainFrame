import renderer from 'react-test-renderer';
import ImageCanvas from '../components/ImageCanvas/ImageCanvas';

const renderTree = (tree) => renderer.create(tree);
describe('<ImageCanvas>', () => {
  it('should render component', () => {
    expect(
      renderTree(<ImageCanvas imageUrl={/* string */} />).toJSON(),
    ).toMatchSnapshot();
  });
  it('should render component with props', () => {
    expect(
      renderTree(<ImageCanvas imageUrl={/* string */} />).toJSON(),
    ).toMatchSnapshot();
  });
});
