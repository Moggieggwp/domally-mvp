import React from 'react';
import { TouchableHighlight, StyleSheet, Text, View, ViewStyle, StyleProp, TextStyle } from 'react-native';
import Colors from 'src/constants/colors';
import TextStyles from 'src/styles/Typography';

import BtnArrow from 'src/assets/img/icons/btn-arrow-white.svg';

export interface ButtonProps {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void | Promise<void>;
  disabled?: boolean;
  isGhost?: boolean;
  title?: string;
  titleStyles?: StyleProp<TextStyle>;
  hasArrow?: boolean;
  btnUnderlayColor?: string;
}

export default class Button extends React.Component<ButtonProps> {
  private _onPressHandler = async () => {
    const { onPress } = this.props;

    if (onPress) {
      try {
        await onPress();
      } catch (err) {
        // TODO: error handling
      }
    }
  };

  render() {
    const { disabled, title, style, titleStyles, isGhost, hasArrow, btnUnderlayColor } = this.props;
    const btnBgColor = isGhost ? 'transparent' : Colors.button.defaultBg;
    const btnUnderlay = isGhost ? btnUnderlayColor || 'transparent' : btnUnderlayColor || Colors.button.defaultBg;

    return (
      <TouchableHighlight
        style={[styles.button, disabled && styles.disabledButton, { backgroundColor: btnBgColor }, style]}
        onPress={this._onPressHandler}
        underlayColor={btnUnderlay}
        activeOpacity={0.7}
        disabled={disabled}
      >
        {title ? (
          <View style={styles.titleWrap}>
            <Text style={[TextStyles.btnTitle, titleStyles]}>{title}</Text>
            {hasArrow && <BtnArrow style={styles.arrow} />}
          </View>
        ) : (
          <>{this.props.children}</>
        )}
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    maxHeight: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    flexShrink: 0,
  },
  titleWrap: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  arrow: {
    marginLeft: 13,
    width: 6.5,
    height: 11.5,
  },
});
