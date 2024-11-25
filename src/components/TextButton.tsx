import React, { FunctionComponent } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp, TextStyle, ImageStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

type TextButtonProps = {
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  hasUnderline?: boolean;
  icon?: FunctionComponent<SvgProps>;
  iconStyles?: StyleProp<ImageStyle>;
  title: string;
  onPress: () => void;
};

const TextButton = (props: TextButtonProps) => {
  const { title, icon, titleStyle, iconStyles, containerStyle, hasUnderline = false, onPress } = props;
  const underlineStyle = hasUnderline ? 'underline' : 'none';

  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.containerStyle, containerStyle]} onPress={onPress}>
      {icon ? <props.icon style={[styles.icon, iconStyles]} /> : null}
      <Text style={[TextStyles.textBtn, { textDecorationLine: underlineStyle }, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default TextButton;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 0,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
});
