import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ViewStyle, StyleProp } from 'react-native';
import Colors from 'src/constants/colors';
import TextStyles from 'src/styles/Typography';
import CheckBox from './CheckBox';

type Props = {
  checked: boolean;
  text: string | JSX.Element;
  onChange: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function CheckBoxButton(props: Props) {
  const { checked, onChange, text, style } = props;
  const textColor = checked ? Colors.checkBoxButton.checkedText : Colors.checkBoxButton.defaultText;
  const bgColor = checked ? Colors.checkBoxButton.checkedBg : Colors.checkBoxButton.defaultBg;
  const borderColor = checked ? Colors.primaryBlack : 'transparent';

  return (
    <TouchableOpacity
      style={[styles.wrap, { backgroundColor: bgColor, borderColor: borderColor }, style]}
      activeOpacity={0.8}
      onPress={onChange}
    >
      <CheckBox checked={checked} style={styles.checkbox} />
      {text && typeof text === 'string' ? (
        <Text style={[TextStyles.checkBoxTitle, styles.text, { color: textColor }]}>{text}</Text>
      ) : (
        text || null
      )}
    </TouchableOpacity>
  );
}

const size = 16;

const styles = StyleSheet.create({
  wrap: {
    height: 35,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 100,
  },
  checkbox: {
    marginLeft: 10,
  },
  text: {
    marginLeft: 4,
  },
});
