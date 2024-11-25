import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from 'src/constants/colors';
import { OPTIONS as CommercialTypeOptions } from 'src/constants/search/CommercialTypeOptions';
import { OPTIONS as IndustrialTypeOptions } from 'src/constants/search/IndustrialTypeOptions';
import { OPTIONS as LandTypeOptions } from 'src/constants/search/LandTypeOptions';
import { OPTIONS as ResidentialTypesOptions } from 'src/constants/search/ResidentialTypesOptions';
import { TextStyles } from 'src/styles/BaseStyles';

interface Props {
  title: string;
  color: 'red' | 'blue';
  labelContainerStyle?: any;
}

const TYPES = [...CommercialTypeOptions, ...IndustrialTypeOptions, ...LandTypeOptions, ...ResidentialTypesOptions];

const Label = (props: Props) => {
  const { title, color, labelContainerStyle } = props;
  const text = (TYPES || []).find((t) => t.type === title)?.title || title;
  return (
    <View style={[styles.labelContainer, labelContainerStyle, color === 'blue' ? { backgroundColor: Colors.primaryBlue } : { backgroundColor: Colors.redLight }]}>
      <Text style={[TextStyles.checkBoxTitle, styles.labelTitle]} numberOfLines={1}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 5,
    marginRight: 5,
    // maxWidth: 90
  },
  labelTitle: {
    color: Colors.white,
    textTransform: 'capitalize',
  },
});

export default Label;
