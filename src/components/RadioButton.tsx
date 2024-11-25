import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ViewStyle, StyleProp } from 'react-native';
import Colors from 'src/constants/colors';

type Props = {
  checked: boolean;
  onChange?: (index) => void;
  index: number | string;
  style?: StyleProp<ViewStyle>;
};

export default function RadioButton(props: Props) {
  const { checked, onChange, index, style } = props;

  const toggleChecked = () => {
    if (onChange) {
      onChange(index);
    }
  };

  const bgColor = checked ? Colors.radioBtn.checked : Colors.white;

  return (
    <TouchableOpacity style={[styles.wrap, style]} activeOpacity={0.8} onPress={toggleChecked}>
      <View style={[styles.radioBtn, checked && styles.checked]} />
    </TouchableOpacity>
  );
}

const size = 24;
const innerCircleSize = size / 2;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    height: size,
    width: size,
    borderRadius: size,
    borderColor: Colors.radioBtn.border,
    marginRight: 21,
  },
  radioBtn: {
    height: innerCircleSize,
    width: innerCircleSize,
    borderRadius: innerCircleSize,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checked: {
    backgroundColor: Colors.radioBtn.checked,
  },
});
