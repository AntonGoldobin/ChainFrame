import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  width: 100vw;
  height: 100vh;
  background-color: #1a1a1a;
`;

export const ImageContainer = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  border: 1px solid #333;
  border-radius: 5px;
  overflow: hidden;
`;
