import styled, { keyframes } from "styled-components";

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
 
    to {
    transform: rotate(360deg);
    }
`;

export const Loader = styled.div`
  padding: 15px;
  border: 10px solid #fd2d01;
  border-bottom-color: transparent;
  border-radius: 50px;
  animation: ${rotate} 1s infinite linear;
  height: 0;
  width: 0;
  position: fixed;
  top: 50%;
  left: 50%;
`;
