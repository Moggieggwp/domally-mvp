import React from 'react';
import { StyleSheet, View, Switch, ViewStyle, StyleProp, Text, TextStyle } from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

type SwitchProps = React.PropsWithChildren<{
  containerStyles?: StyleProp<ViewStyle>;
  titleStyles?: StyleProp<TextStyle>;
  enabled?: boolean;
  onChange?: (value: boolean, title?: string) => void;
  title?: string;
  titleStyle?: StyleProp<TextStyle>;
}>;

export default function SwitchToggle(props: SwitchProps) {
  const { enabled, containerStyles, onChange, title, titleStyle} = props;

  const toggleSwitch = () => {
    if (onChange) {
      onChange(!enabled, title || '');
    }
  }

  const containerTitleStyles = title ? styles.rowContainer : {};

  return (
    <View style={[styles.switchWrap, containerTitleStyles, containerStyles || {}]}>
      {title && <Text style={[TextStyles.switchTitle, styles.title, titleStyle && titleStyle]}>{title}</Text>}
      <Switch
        style={styles.switch}
        trackColor={{ false: Colors.switch.bgColor, true: Colors.green }}
        thumbColor={Colors.white}
        ios_backgroundColor={'transparent'}
        onValueChange={toggleSwitch}
        value={enabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  switchWrap: {
    width: '100%',
    alignItems: 'center',
  },
  switch: {
    borderRadius: 17,
  },
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    textTransform: 'capitalize',
    fontWeight: '400',
  }
});
