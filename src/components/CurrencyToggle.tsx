import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from 'src/constants/colors';
import { CURRENCY_BUTTONS } from 'src/constants/MeasureButtons';
import Typography from 'src/styles/Typography';
import { MeasureCurrency, MeasureSquare } from 'src/types';

type CurrencyToggleProps = {
  selectedCurrency: MeasureSquare | MeasureCurrency;
  handleCurrencyToggle: (value: MeasureSquare | MeasureCurrency) => void;
};

const CurrencyToggle = ({ selectedCurrency, handleCurrencyToggle }: CurrencyToggleProps) => {
  const isActive = (value: string) => {
    return value === selectedCurrency;
  };

  return (
    <View style={styles.toggleContainer}>
      {CURRENCY_BUTTONS.map((value) => {
        return (
          <TouchableOpacity
            onPress={() => handleCurrencyToggle(value.measure)}
            key={value.measure}
            style={[styles.toggleButton, isActive(value.measure) && styles.toggleButtonActive]}
          >
            <Text style={[styles.toggleLabel, isActive(value.measure) && styles.toggleTextActive]}>{value.measure}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
  },
  toggleButton: {
    width: 58,
    height: 30,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderColor: Colors.gray,
    marginLeft: 9,
  },
  toggleButtonActive: {
    backgroundColor: Colors.black,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  toggleLabel: {
    textTransform: 'uppercase',
    ...Typography.body2,
  },
});

export default CurrencyToggle;
