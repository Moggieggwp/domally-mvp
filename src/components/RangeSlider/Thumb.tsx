import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';
import Arrows from 'src/assets/img/icons/range-slider-icon.svg';

const THUMB_RADIUS = 16;

const Thumb = () => {
  return (
    <View style={styles.thumb}>
      <Arrows style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  thumb: {
    width: THUMB_RADIUS * 2,
    height: THUMB_RADIUS * 2,
    borderRadius: THUMB_RADIUS,
    borderWidth: 2,
    borderColor: Colors.primaryBlue,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(67, 137, 235, 0.15)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  icon: {
    width: 7.42,
    height: 4,
  },
});

export default memo(Thumb);
