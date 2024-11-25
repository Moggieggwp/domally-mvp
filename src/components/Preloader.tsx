import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import preloaderData from 'src/assets/lottie/preloader.json';
import Colors from 'src/constants/colors';

type PreloaderProps = {
  style?: StyleProp<ViewStyle>;
};

const Preloader = (props: PreloaderProps) => {
  const { style } = props;
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    animation.current.play();
  }, []);

  return (
    <View style={[styles.container, style || {}]}>
      <View style={styles.lottieWrap}>
        <LottieView style={[styles.lottie]} ref={animation} source={preloaderData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1000,
    elevation: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  lottieWrap: {
    width: 96,
    height: 96,
    borderRadius: 96,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 15,
    shadowColor: 'rgba(14, 20, 56, 0.04)',
    shadowOpacity: 1,
  },
  lottie: {
    width: 38,
    height: 48,
  },
});

export default Preloader;
