import React from "react";
import * as ImagePicker from "expo-image-picker";

const PhotoSelector = ({ onPhotoSelect }) => {
  React.useEffect(() => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    }).then(onPhotoSelect);
  }, []);

  return null;
};

export default PhotoSelector;
