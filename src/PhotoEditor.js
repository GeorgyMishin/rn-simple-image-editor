import React from "react";
import { Dimensions, Animated, PanResponder } from "react-native";
import styled from "styled-components/native";
import PhotoEditorFrame from "./PhotoEditorFrame";
import PhotoEditorGrid from "./PhotoEditorGrid";
import { back } from "./assets";
import { resizeImage, clamp } from "./functions";

const Container = styled.View`
  flex: 1;
  background: #000;
`;

const DEFAULT_WIDTH = 50;
const DEFAULT_HEIGHT = 50;

const Editor = styled.View`
  margin-top: 90px;
  align-self: center;
`;

const FrameContainer = styled(Animated.View)`
  z-index: 1;
  position: absolute;
  border: 0.5px solid #fff;
  overflow: hidden;
`;

const ImageBaseContainer = styled.View`
  opacity: 0.2;
`;

const Image = styled(Animated.Image)``;

const Panel = styled.View`
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 40px;
  background: #000;
`;

const Grid = styled(PhotoEditorGrid)`
  position: absolute;
  z-index: 1;
`;

const BackButton = styled.TouchableOpacity``;

class PhotoEditor extends React.Component {
  constructor(props) {
    super(props);

    const {
      photo: { width, height },
    } = props;

    this.state = {
      showGrid: false,
    };

    this._sizes = resizeImage({
      baseImageWidth: width,
      baseImageHeight: height,
      idealSquarePart: Dimensions.get("window").width,
    });

    this._width = this._sizes.width;
    this._height = this._sizes.height;
    this._xIndent = 0;
    this._yIndent = 0;

    this._animatedImageWidth = new Animated.Value(this._sizes.width);
    this._animatedImageHeight = new Animated.Value(this._sizes.height);
    this._animatedImageIndent = new Animated.ValueXY({
      x: 0,
      y: 0,
    });

    const defaultPanSettings = {
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: this._showGrid,
      onPanResponderEnd: this._hideGrid,
      onPanResponderGrant: this._setupValues,
    };

    this._panResponderTopLeft = PanResponder.create({
      ...defaultPanSettings,
      onPanResponderMove: (_, { dx, dy }) => {
        const normilizeDx = clamp(
          dx,
          -this._xIndent,
          this._width - DEFAULT_WIDTH
        );
        const normilizeDy = clamp(
          dy,
          -this._yIndent,
          this._sizes.height - this._yIndent - DEFAULT_HEIGHT
        );
        this._animatedImageIndent.setValue({
          x: this._xIndent + normilizeDx,
          y: this._yIndent + normilizeDy,
        });
        this._animatedImageWidth.setValue(
          clamp(this._width - normilizeDx, 0, this._sizes.width)
        );
        this._animatedImageHeight.setValue(
          clamp(this._height - normilizeDy, DEFAULT_HEIGHT, this._sizes.height)
        );
      },
    });

    this._panResponderBottomLeft = PanResponder.create({
      ...defaultPanSettings,
      onPanResponderMove: (_, { dx, dy }) => {
        const normilizeDx = clamp(
          dx,
          -this._xIndent,
          this._width - DEFAULT_WIDTH
        );
        this._animatedImageIndent.setValue({
          x: this._xIndent + normilizeDx,
          y: this._yIndent,
        });
        this._animatedImageWidth.setValue(
          clamp(this._width - normilizeDx, 0, this._sizes.width)
        );
        this._animatedImageHeight.setValue(
          clamp(
            this._height + dy,
            DEFAULT_HEIGHT,
            this._sizes.height - this._yIndent
          )
        );
      },
    });

    this._panResponderTopRight = PanResponder.create({
      ...defaultPanSettings,
      onPanResponderMove: (_, { dx, dy }) => {
        const normilizeDy = clamp(
          dy,
          -this._yIndent,
          this._sizes.height - this._yIndent - DEFAULT_HEIGHT
        );
        this._animatedImageIndent.setValue({
          x: this._xIndent,
          y: this._yIndent + normilizeDy,
        });

        this._animatedImageWidth.setValue(
          clamp(
            this._width + dx,
            DEFAULT_WIDTH,
            this._sizes.width - this._xIndent
          )
        );
        this._animatedImageHeight.setValue(
          clamp(this._height - normilizeDy, 0, this._sizes.height)
        );
      },
    });

    this._panResponderBottomRight = PanResponder.create({
      ...defaultPanSettings,
      onPanResponderMove: (_, { dx, dy }) => {
        this._animatedImageIndent.setValue({
          x: this._xIndent,
          y: this._yIndent,
        });

        this._animatedImageWidth.setValue(
          clamp(
            this._width + dx,
            DEFAULT_WIDTH,
            this._sizes.width - this._xIndent
          )
        );
        this._animatedImageHeight.setValue(
          clamp(
            this._height + dy,
            DEFAULT_HEIGHT,
            this._sizes.height - this._yIndent
          )
        );
      },
    });

    this._panResponderFrame = PanResponder.create({
      ...defaultPanSettings,
      onPanResponderMove: (_, { dx, dy }) => {
        this._animatedImageIndent.setValue({
          x: clamp(this._xIndent + dx, 0, this._differenceWidth()),
          y: clamp(this._yIndent + dy, 0, this._differenceHeight()),
        });
      },
    });
  }

  render() {
    const {
      onBackPress,
      photo: { uri },
    } = this.props;

    return (
      <Container>
        <Editor>
          <FrameContainer
            style={[
              this._animatedImageIndent.getLayout(),
              this._getAnimatedWidthAndHeight(),
            ]}
            {...this._panResponderFrame.panHandlers}
          >
            {this.state.showGrid && (
              <Grid
                containerAnimatedStyles={this._getAnimatedWidthAndHeight()}
                size={2}
              />
            )}
            <PhotoEditorFrame
              top
              left
              {...this._panResponderTopLeft.panHandlers}
            />
            <PhotoEditorFrame
              top
              right
              {...this._panResponderTopRight.panHandlers}
            />
            <PhotoEditorFrame
              bottom
              left
              {...this._panResponderBottomLeft.panHandlers}
            />
            <PhotoEditorFrame
              bottom
              right
              {...this._panResponderBottomRight.panHandlers}
            />
            <Image
              style={[
                this._sizes,
                {
                  position: "absolute",
                },
                this._getInterpolatedLayout(),
              ]}
              source={{ uri }}
            />
          </FrameContainer>
          <ImageBaseContainer>
            <Image style={this._sizes} source={{ uri }} />
          </ImageBaseContainer>
        </Editor>

        <Panel>
          <BackButton onPress={onBackPress}>
            <Image source={back} />
          </BackButton>
        </Panel>
      </Container>
    );
  }

  _differenceWidth = () => this._sizes.width - this._width;

  _differenceHeight = () => this._sizes.height - this._height;

  _showGrid = () => {
    this.setState({ showGrid: true });
  };

  _hideGrid = () => {
    this.setState({ showGrid: false });
  };

  _setupValues = () => {
    this._xIndent = this._animatedImageIndent.x._value;
    this._yIndent = this._animatedImageIndent.y._value;
    this._width = this._animatedImageWidth._value;
    this._height = this._animatedImageHeight._value;
  };

  _getAnimatedWidthAndHeight = () => ({
    width: this._animatedImageWidth,
    height: this._animatedImageHeight,
  });

  _getInterpolatedLayout = () => ({
    top: this._animatedImageIndent.y.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    }),
    left: this._animatedImageIndent.x.interpolate({
      inputRange: [-1, 1],
      outputRange: [1, -1],
    }),
  });

  _;
}

export default PhotoEditor;
