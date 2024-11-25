import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import Colors from 'src/constants/colors';
import CheckedIcon from 'src/assets/img/icons/checkbox-icon.svg';

type Props = {
  checked: boolean;
  onChange?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function Checkbox(props: Props) {
  const { checked, onChange, style } = props;

  const toggleChecked = () => {
    if (onChange) {
      onChange();
    }
  };

  return (
    <TouchableOpacity style={[styles.wrap, style]} activeOpacity={0.8} onPress={toggleChecked}>
      <View style={[styles.checkbox, checked && styles.checked]}>{checked && <CheckedIcon />}</View>
    </TouchableOpacity>
  );
}

const size = 16;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: size,
    width: size,
    borderRadius: size,
    borderWidth: 0.5,
    borderColor: Colors.checkBox.borderColor,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checked: {
    backgroundColor: Colors.checkBox.checkedBg,
    borderWidth: 0,
  },
});
