import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

function getViewWidth(size: number): number {
  return size * (width / 100);
}

function getViewHeight(size: number): number {
  return size * (height / 100);
}

const isThirdElem = (index: number) => index % 3 === 2;

export default {
  window: {
    width,
    height,
  },
  getViewWidth,
  isThirdElem,
  getViewHeight,
  isSmallDevice: Platform.select({
    ios: width < 340 || height < 650,
    android: height < 670,
  }),
  isMediumDevice: Platform.select({
    ios: width < 380 || height < 670,
    android: height < 720,
  }),
  isWideAndroid: width > 370,
};
