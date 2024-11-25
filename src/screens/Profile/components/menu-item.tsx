import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, StyleProp, ViewStyle, ImageSourcePropType } from 'react-native';
import { TextStyles } from 'src/styles/BaseStyles';
import arrowRight from 'src/assets/img/icons/arrowRightIcon.png';

export default ({ icon, label, style, onPress }: {
  icon: ImageSourcePropType;
  label: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}) => (
  <TouchableOpacity style={[styles.menuItem, style]} onPress={onPress}>
    <Image source={icon} />
    <Text style={[TextStyles.body2, styles.menuItemLabel]}>{label}</Text>
    <Image source={arrowRight} style={styles.arrowIcon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuItemLabel: {
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    paddingVertical: 5,

  },
  arrowIcon: {
    marginLeft: 'auto',
  },
});