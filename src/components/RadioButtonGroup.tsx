import React, { useState } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Colors from 'src/constants/colors';
import RadioButton from './RadioButton';

type RadioItem = {
  id: number | string;
  label?: string;
};

type Props = {
  onChange?: (index) => void;
  style?: StyleProp<ViewStyle>;
  items: RadioItem[];
};

export default function RadioButtonGroup(props: Props) {
  const { items, onChange, style } = props;
  const [currentIndex, setItemIndex] = useState(0);

  const toggleChecked = (index: number) => {
    setItemIndex(index);

    if (onChange) {
      onChange(index);
    }
  };

  return (
    <View style={[styles.wrap, style]}>
      {items.map((item) => (
        <RadioButton key={item.id} index={item.id} checked={currentIndex === item.id} onChange={toggleChecked} />
      ))}
    </View>
  );
}

const size = 24;
const innerCircleSize = size / 2;

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
