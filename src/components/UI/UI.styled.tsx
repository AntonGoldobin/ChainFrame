import styled from 'styled-components';

export const Topbar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #1a1a1ab3;
  z-index: 10000;
`;

export const TopbarBlock = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
`;
