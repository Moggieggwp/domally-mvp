import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

import { TextStyles } from 'src/styles/BaseStyles';

import LogoImage from 'src/assets/img/icons/logo.svg';

type LogoProps = {
  hasLabel?: boolean;
  style?: StyleProp<ViewStyle>;
};

const Logo = (props: LogoProps) => {
  const { hasLabel, style } = props;

  return (
    <View style={[styles.container, style || {}]}>
      <LogoImage style={styles.logo} />
      {hasLabel && <Text style={[styles.label, TextStyles.logoLabel]}>domally</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  logo: {
    width: 26,
    height: 33,
  },
  label: {
    textTransform: 'lowercase',
    marginLeft: 2,
  },
});

export default Logo;
