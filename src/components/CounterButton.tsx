import React from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle, TouchableHighlight, TextStyle } from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

type CounterButtonProps = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  title?: string;
  disabled?: boolean;
  btnUnderlayColor?: string;
  titleStyles?: StyleProp<TextStyle>;
};

const CounterButton = (props: CounterButtonProps) => {
  const { style, onPress, title, disabled, btnUnderlayColor, titleStyles } = props;

  const onPressHandler = () => {
    if (onPress) {
      onPress();
    }
  };

  const btnUnderlay = btnUnderlayColor || Colors.button.defaultUnderlayColor;

  return (
    <TouchableHighlight
      style={[styles.button, disabled && styles.disabledButton, style]}
      onPress={onPressHandler}
      underlayColor={Colors.grayLight}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {title && <Text style={[TextStyles.btnTitle, styles.title, titleStyles]}>{title}</Text>}
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 45,
    height: 45,
    backgroundColor: Colors.grayLight,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderStyle: 'solid',
    borderRadius: 100,
  },
  title: {
    color: Colors.primaryBlue,
    fontSize: 22,
    fontWeight: '400',
  },
});

export default CounterButton;
