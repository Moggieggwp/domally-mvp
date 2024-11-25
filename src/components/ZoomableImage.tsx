import React, { useState, useEffect } from 'react';
import { View, PanResponder, StyleSheet, StyleProp, ViewStyle, LayoutChangeEvent } from 'react-native';
import FastImage from 'react-native-fast-image';

type ZoomableImageProps = {
  imageWidth: number;
  imageHeight: number;
  source: string;
  scrollCb?: (enabled: boolean) => void;
  style?: StyleProp<ViewStyle>;
};

function calcDistance(x1: number, y1: number, x2: number, y2: number) {
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

function calcCenter(x1: number, y1: number, x2: number, y2: number) {
  function middle(p1: number, p2: number) {
    return p1 > p2 ? p1 - (p1 - p2) / 2 : p2 - (p2 - p1) / 2;
  }

  return {
    x: middle(x1, x2),
    y: middle(y1, y2),
  };
}

function maxOffset(offset: number, windowDimension: number, imageDimension: number) {
  const max = windowDimension - imageDimension;
  if (max >= 0) {
    return 0;
  }
  return offset < max ? max : offset;
}

function calcOffsetByZoom(width: number, height: number, imageWidth: number, imageHeight: number, zoom: number) {
  const xDiff = imageWidth * zoom - width;
  const yDiff = imageHeight * zoom - height;
  return {
    left: -xDiff / 2,
    top: -yDiff / 2,
  };
}

const ZoomableImage = (props: ZoomableImageProps) => {
  const { imageWidth, imageHeight, source, scrollCb, style } = props;

  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [isZooming, setIsZooming] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [layoutKnown, setLayoutKnown] = useState(false);
  const [zoom, setZoom] = useState<number>(null);
  const [minZoom, setMinZoom] = useState<number>(1);
  const [offsetTop, setOffsetTop] = useState<number>(0);
  const [offsetLeft, setOffsetLeft] = useState<number>(0);
  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);
  const [initialZoom, setInitialZoom] = useState<number>(1);
  const [initialDistance, setInitialDistance] = useState<number>(null);
  const [initialX, setInitialX] = useState<number>(null);
  const [initialY, setInitialY] = useState<number>(null);
  const [initialTop, setInitialTop] = useState<number>(0);
  const [initialLeft, setInitialLeft] = useState<number>(0);
  const [initialTopWithoutZoom, setInitialTopWithoutZoom] = useState<number>(0);
  const [initialLeftWithoutZoom, setInitialLeftWithoutZoom] = useState<number>(0);

  const processPinch = (x1: number, y1: number, x2: number, y2: number) => {
    const distance = calcDistance(x1, y1, x2, y2);
    const center = calcCenter(x1, y1, x2, y2);

    if (!isZooming) {
      const offsetByZoom = calcOffsetByZoom(width, height, imageWidth, imageHeight, zoom);

      setIsZooming(true);
      setInitialZoom(zoom);
      setInitialDistance(distance);
      setInitialX(center.x);
      setInitialY(center.y);
      setInitialTop(top);
      setInitialLeft(left);
      setInitialTopWithoutZoom(top - offsetByZoom.top);
      setInitialLeftWithoutZoom(left - offsetByZoom.left);
    } else {
      const touchZoom = distance / initialDistance;

      const zoom = touchZoom * initialZoom > minZoom ? touchZoom * initialZoom : minZoom;

      const offsetByZoom = calcOffsetByZoom(width, height, imageWidth, imageHeight, zoom);

      const left = initialLeftWithoutZoom * touchZoom + offsetByZoom.left;
      const top = initialTopWithoutZoom * touchZoom + offsetByZoom.top;

      setZoom(zoom);
      setTop(top > 0 ? 0 : maxOffset(top, height, imageHeight * zoom));
      setLeft(left > 0 ? 0 : maxOffset(left, width, imageWidth * zoom));
    }
  };

  const processTouch = (x: number, y: number) => {
    if (!isMoving) {
      setIsMoving(true);
      setInitialX(x);
      setInitialY(y);
      setInitialTop(top);
      setInitialLeft(left);
    } else {
      const left = initialLeft + x - initialX;
      const top = initialTop + y - initialY;

      setTop(top > 0 ? 0 : maxOffset(top, height, imageHeight * zoom));
      setLeft(left > 0 ? 0 : maxOffset(left, width, imageWidth * zoom));
    }
  };

  const _onLayout = (event: LayoutChangeEvent) => {
    const layout = event.nativeEvent.layout;

    if (layout.width === width && layout.height === height) {
      return;
    }

    const zoom = layout.width / imageWidth;

    const offsetTop = layout.height > imageHeight * zoom ? (layout.height - imageHeight * zoom) / 2 : 0;

    setLayoutKnown(true);
    setWidth(layout.width);
    setHeight(layout.height);
    setZoom(zoom);
    setMinZoom(zoom);
    setOffsetTop(offsetTop);
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (evt) => {
      const touches = evt.nativeEvent.touches;
      if (touches.length === 2) {
        processPinch(touches[0].pageX, touches[0].pageY, touches[1].pageX, touches[1].pageY);
      } else if (touches.length === 1 && !isZooming) {
        processTouch(touches[0].pageX, touches[0].pageY);
      }
    },

    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: () => {
      setIsZooming(false);
      setIsMoving(false);
    },
    onPanResponderTerminate: () => {},
    onShouldBlockNativeResponder: () => true,
  });

  useEffect(() => {
    scrollCb(zoom < 1.1);
  }, [scrollCb, zoom]);

  return (
    <View style={style} {...panResponder.panHandlers} onLayout={_onLayout}>
      <FastImage
        style={[
          styles.image,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            position: 'absolute',
            top: offsetTop + top,
            left: offsetLeft + left,
            width: imageWidth * zoom,
            height: imageHeight * zoom,
          },
        ]}
        source={{
          uri: source,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    width: '100%',
  },
});

export default ZoomableImage;
