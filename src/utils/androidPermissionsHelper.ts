import { PermissionsAndroid } from 'react-native';

const camera = PermissionsAndroid.PERMISSIONS.CAMERA;
const writeStorage = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

export const checkCameraPermissions = async () => {
  try {
    await PermissionsAndroid.request(camera);
  } catch (error) {
    console.log('Something went wrong!');
  }
};

export const checkAndroidPermissionsMultiple = async () => {
  try {
    await PermissionsAndroid.requestMultiple([camera, writeStorage]);
  } catch (error) {
    console.log('Something went wrong!');
  }
};
