import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import BackIcon from 'src/assets/img/icons/back-icon.svg';

type Props = {
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  disabled?: boolean;
};

export default function BackButton(props: Props) {
  const onPress = props.onPress;

  return (
    <TouchableOpacity disabled={props.disabled} style={[styles.backBtn, props.style, {opacity: props.disabled ? 0 : 1}]} onPress={onPress}>
      <BackIcon width={24} height={24} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 44,
    height: 44,
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
});
