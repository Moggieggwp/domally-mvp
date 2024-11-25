import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import CloseIcon from 'src/assets/img/icons/close-icon.svg';

type Props = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function CloseButton(props: Props) {
  const { onPress, style } = props;

  return (
    <TouchableOpacity style={[styles.closeButton, style]} onPress={onPress}>
      <CloseIcon width={20} height={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    width: 40,
    height: 40,
    zIndex: 10,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
