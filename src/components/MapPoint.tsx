import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

type MapPointProps = {
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<ViewStyle>;
  title: string;
  onPress?: () => void;
};

const MapPoint = (props: MapPointProps) => {
  const { title, titleStyle, containerStyle, onPress } = props;

  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.containerStyle, containerStyle]} onPress={onPress}>
      <Text style={[TextStyles.h3, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default MapPoint;

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(23, 32, 52, 0.08)',
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    alignSelf: 'flex-start',
  },
});
