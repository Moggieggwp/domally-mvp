import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';

const Rail = () => {
  return (
    <View style={styles.railWrap}>
      <View style={styles.rail} />
    </View>
  );
};

export default memo(Rail);

const styles = StyleSheet.create({
  railWrap: {
    flex: 1,
    height: 3,
    borderRadius: 5,
  },
  rail: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#4389eb1a',
    opacity: 1,
    zIndex: 10,
    borderRadius: 5,
  },
  bgImage: {
    position: 'absolute',
    top: -27,
    alignSelf: 'center',
    zIndex: 0,
  },
});
