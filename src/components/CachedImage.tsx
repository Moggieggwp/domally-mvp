import React from 'react';
import { StyleSheet, StyleProp, ViewStyle, View, ImageStyle } from 'react-native';
import FastImage from 'react-native-fast-image';


type Props = {
  styleWrap?: StyleProp<ViewStyle>;
  styleImage?: any;
  imageUri: string;
};

export default function CachedImage(props: Props) {
  const { styleWrap, styleImage, imageUri } = props;

  return (
    <View style={[styles.imageContainer, styleWrap]}>
      <FastImage
        style={[styles.image, styleImage]}
        source={{
          uri: imageUri,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }
});
