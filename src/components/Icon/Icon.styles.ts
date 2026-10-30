import styled from 'styled-components';

/** Line icon that takes its colour from the surrounding text (currentColor). */
export const Svg = styled.svg<{ $size: number }>`
  flex-shrink: 0;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
`;
