import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Colors from 'src/constants/colors';
import { getIconByType, IconTypes } from './iconTypes';

type IconButtonProps = {
  style?: StyleProp<ViewStyle>;
  iconStyles?: StyleProp<ViewStyle>;
  onPress?: () => void;
  type: IconTypes;
};

const IconButton = (props: IconButtonProps) => {
  const { style, type, iconStyles, onPress } = props;

  const onPressHandler = () => {
    if (onPress) {
      onPress();
    }
  };

  const Icon = getIconByType(type);
  const btnStyles = iconsBg[type] || iconsBg.default;

  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.btn, btnStyles, style]} onPress={onPressHandler}>
      <Icon style={iconStyles} />
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  btn: {
    width: 32,
    height: 32,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 10,
    shadowColor: Colors.iconBtn.shadow,
    shadowOpacity: 1,
  },
});

const iconsBg = StyleSheet.create({
  success: {
    backgroundColor: Colors.secondaryGreen,
  },
  done: {
    backgroundColor: Colors.primaryBlue,
  },
  edit: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.iconBtn.border,
  },
  list: {
    backgroundColor: Colors.primaryBlue,
  },
  reload: {
    backgroundColor: Colors.primaryBlue,
  },
  cancel: {
    backgroundColor: Colors.red,
  },
  default: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.iconBtn.border,
  },
});
