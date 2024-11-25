import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';

const Label = ({ text, ...restProps }) => {
  return (
    <View style={styles.root} {...restProps}>
      <Text style={[TextStyles.smallBody, styles.text]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 6,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 10,
  },
  text: {
    color: Colors.white,
  },
});

export default memo(Label);
