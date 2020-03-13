import React from "react";
import styled from "styled-components/native";

const PhotoEditorFrame = styled.View.attrs(() => ({}))`
  position: absolute;
  z-index: 10;
  width: 20px;
  height: 20px;
  border-color: #fff;
  ${({ left }) => left && "border-left-width: 1px"};
  ${({ right }) => right && "border-right-width: 1px"};
  ${({ top }) => top && "border-top-width: 1px"};
  ${({ bottom }) => bottom && "border-bottom-width: 1px"};
  ${({ top }) => top && "top: 0;"}
  ${({ left }) => left && "left: 0;"}
  ${({ right }) => right && "right: 0;"}
  ${({ bottom }) => bottom && "bottom: 0;"}

`;

export default PhotoEditorFrame;
