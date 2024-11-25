import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';
import { TextStyles } from 'src/styles/BaseStyles';

type Props = {
  title: string;
  style?: StyleProp<TextStyle>;
};

const StepperTitle = (props: Props) => {
  const { title, style } = props;

  return (
    <Text style={[TextStyles.h2, styles.title, style]}>{title}</Text>
  );
};

export default StepperTitle;

const styles = StyleSheet.create({
  title: {
    marginBottom: 24,
    textAlign: 'center',
    width: '100%',
    alignSelf: 'center',
  },
});
