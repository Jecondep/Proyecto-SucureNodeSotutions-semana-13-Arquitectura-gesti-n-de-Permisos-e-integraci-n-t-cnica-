import { useState } from 'react';
import { Camera } from 'expo-camera';

export const useCameraManager = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      return photo;
    }
  };

  return { hasPermission, setCameraRef, requestCameraPermission, takePicture };
};
