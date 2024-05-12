import { UI } from '../../components/UI/UI';
import * as styled from './PlayGround.styled';
import { TransformContainer } from './TransformContainer/TransformContainer';

export const PlayGround = () => {
  return (
    <styled.StyledWindowContainer>
      <UI />
      <TransformContainer />
    </styled.StyledWindowContainer>
  );
};
