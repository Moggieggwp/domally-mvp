import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { TextStyles } from 'src/styles/BaseStyles';
import Layout from 'src/constants/Layout';
import Colors from 'src/constants/colors';
import { fontSemiBold } from 'src/styles/Typography';
import { AreaLocation } from 'src/types';

const PickerItem = Picker.Item;

type WheelPickerProps = {
  onChange: (value: AreaLocation) => void;
  items?: AreaLocation[];
  selectedItemIndex?: number;
}

const WheelPicker = (props: WheelPickerProps) => {
  const { onChange, items, selectedItemIndex } = props;
  const [selectedItem, setSelectedItem] = useState(selectedItemIndex || 0);
  const [itemList, setItemList] = useState<AreaLocation[]>(items || []);

  useEffect(() => {
    if (items?.length) {
      setItemList(items);
    }
  }, [items]);

  useEffect(() => {
    setSelectedItem(selectedItemIndex);
    onOpen();
  }, [selectedItemIndex]);

  const onChangeHandler = (index: number) => {
    setSelectedItem(index);
    if (onChange) {
      onChange(itemList[index]);
    }
  }

  const onOpen = () => {
    if (onChange) {
      const selected = itemList[selectedItemIndex] || itemList[0];
      onChange(selected);
    }
  }

  return (
    <View style={styles.container}>
      <Picker
        style={styles.pickerWrap}
        selectedValue={selectedItem}
        itemStyle={[TextStyles.body2, styles.item]}
        onValueChange={onChangeHandler}
      >
        {itemList.map((value, i) => (
          <PickerItem style={styles.pickerItem} label={value} value={i} key={value} />
        ))}
      </Picker>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    width: Layout.window.width,
    height: 180,
  },
  pickerWrap: {
    width: '100%',
  },
  item: {
    fontWeight: '600',
    color: Colors.primaryBlack,
    fontFamily: fontSemiBold,
  },
  pickerItem: {
    paddingTop: 20,
    lineHeight: 50,
  },
});

export default WheelPicker;