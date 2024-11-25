import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from 'src/constants/colors';
import { MetricBtn, SQUARE_BUTTONS } from 'src/constants/MeasureButtons';
import Typography from 'src/styles/Typography';
import { MeasureCurrency, MeasureSquare } from 'src/types';

type SquareToggleProps = {
  selectedSquare: MeasureSquare | MeasureCurrency;
  handleSquareToggle: (value: MeasureSquare| MeasureCurrency) => void;
};

const SquareToggle = ({ selectedSquare, handleSquareToggle }: SquareToggleProps) => {
  const isActive = (square: MetricBtn) => {
    return square.measure === selectedSquare;
  };

  return (
    <View style={styles.toggleContainer}>
      {SQUARE_BUTTONS.map((square) => {
        return (
          <TouchableOpacity
            onPress={() => handleSquareToggle(square.measure)}
            key={square.measure}
            style={[styles.toggleButton, isActive(square) && styles.toggleButtonActive]}
          >
            <View style={styles.toggleButtonContainer}>
              <Text style={[Typography.body2, isActive(square) && styles.toggleTextActive]}>{square.symbol}</Text>
              <Text style={[Typography.body2, styles.supStyle, isActive(square) && styles.toggleTextActive]}>2</Text>
            </View>
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
  toggleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  supStyle: {
    fontSize: 10,
    lineHeight: 12,
    marginLeft: 1,
  },
});

export default SquareToggle;
