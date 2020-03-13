import React from "react";
import { Animated } from "react-native";
import styled from "styled-components/native";

const GridContainer = styled(Animated.View)`
  flex: 1;
`;

const RowsContainer = styled(Animated.View)`
  flex: 1;
  position: absolute;
  flex-direction: row;
  justify-content: space-evenly;
`;

const CellsContainer = styled(RowsContainer)`
  flex-direction: column;
`;

const Row = styled.View`
  width: 0.5px;
  height: 100%;
  background: #fff;
`;

const Cell = styled.View`
  width: 100%;
  height: 0.5px;
  background: #fff;
`;

const PhotoEditorGrid = ({ containerAnimatedStyles, size, style }) => {
  const array = React.useMemo(() => new Array(size).fill(0), [size]);

  return (
    <GridContainer style={[containerAnimatedStyles, style]}>
      <RowsContainer style={containerAnimatedStyles}>
        {array.map((_, index) => (
          <Row key={index} />
        ))}
      </RowsContainer>
      <CellsContainer style={containerAnimatedStyles}>
        {array.map((_, index) => (
          <Cell key={index} />
        ))}
      </CellsContainer>
    </GridContainer>
  );
};

export default PhotoEditorGrid;
