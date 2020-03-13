import React from "react";
import { View } from "react-native";
import { askAsync, CAMERA, CAMERA_ROLL } from "expo-permissions";
import PhotoCreator from "./PhotoCreator";
import PhotoEditor from "./PhotoEditor";
import PhotoSelector from "./PhotoSelector";

askAsync(CAMERA, CAMERA_ROLL);

const APP_STATE = {
  CREATE_PHOTO: 0,
  EDIT_PHOTO: 1,
  SELECT_PHOTO: 2,
};

const PhotoExample = () => {
  const [state, setState] = React.useState(APP_STATE.CREATE_PHOTO);
  const [photo, setPhoto] = React.useState(null);

  const onPhotoCreate = React.useCallback(photo => {
    setPhoto(photo);
    setState(APP_STATE.EDIT_PHOTO);
  }, []);

  const onBackPress = React.useCallback(() => {
    setState(APP_STATE.CREATE_PHOTO);
  }, []);

  return (
    <>
      {state === APP_STATE.SELECT_PHOTO && (
        <PhotoSelector onPhotoSelect={onPhotoCreate} />
      )}
      {state === APP_STATE.CREATE_PHOTO && (
        <PhotoCreator onPhotoCreate={onPhotoCreate} />
      )}
      {state === APP_STATE.EDIT_PHOTO && (
        <PhotoEditor photo={photo} onBackPress={onBackPress} />
      )}
    </>
  );
};

export default PhotoExample;
