import React from "react";
import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { Camera } from "expo-camera";
import { photo } from "./assets";

const PhotoCreator = ({ onPhotoCreate }) => {
  const camera = React.useRef(null);

  const takePhoto = React.useCallback(async () => {
    if (camera.current) {
      const photo = await camera.current.takePictureAsync({ base64: false });

      onPhotoCreate && onPhotoCreate(photo);
    }
  }, []);

  return (
    <Camera
      style={styles.camera}
      ref={camera}
      type={Camera.Constants.Type.back}
    >
      <View style={styles.panel}>
        <TouchableOpacity onPress={takePhoto}>
          <Image source={photo} />
        </TouchableOpacity>
      </View>
    </Camera>
  );
};

const styles = StyleSheet.create({
  camera: { flex: 1 },
  panel: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 40,
    backgroundColor: "#000",
  },
});

export default PhotoCreator;
