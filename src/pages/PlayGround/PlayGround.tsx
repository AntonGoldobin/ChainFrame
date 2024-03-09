import { TransformContainer } from '../../components/TransformContainer/TransformContainer';
import { UI } from '../../components/UI/UI';
import * as styled from './PlayGround.styled';

export const PlayGround = () => {
  return (
    <styled.StyledWindowContainer>
      <UI />
      <TransformContainer />
    </styled.StyledWindowContainer>
  );
};
