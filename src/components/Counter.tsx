import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Colors from 'src/constants/colors';
import { CounterStringValues } from 'src/constants/propertyDetails';
import { TextStyles } from 'src/styles/BaseStyles';
import CounterButton from './CounterButton';

type CounterProps = {
  onChange: (value: string | number) => void;
  initialValue?: string | number;
  initialCurrent?: string | number;
  minValue?: string | number;
  maxValue?: number;
  allowableValues?: string[];
  title?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

const Counter = (props: CounterProps) => {
  const { style, title, onChange, initialValue, initialCurrent, allowableValues, maxValue, minValue, titleStyle } = props;

  const [current, setCurrent] = useState<string | number>(initialCurrent || CounterStringValues.Any);
  const [value, setValue] = useState<string | number>(initialValue);

  const any = current === CounterStringValues.Any;
  const nA = current === CounterStringValues.NotApplicable;
  const currentIsNumber = typeof current === 'number';
  const isMinValue = (typeof minValue === 'number' && current === minValue) || nA || any;
  const isMaxValue = (maxValue && current === maxValue) || (allowableValues && current === allowableValues.length - 1);

  const increment = () => {
    if (isMaxValue) {
      return;
    }

    const c = (() => {
      if (any) {
        return allowableValues ? 0 : CounterStringValues.NotApplicable;
      }
      if (nA) {
        return 1;
      }

      return currentIsNumber && current + 1;
    })();

    setCurrent(c);
  };

  const decrement = () => {
    if (isMinValue) {
      return;
    }

    const c = (() => {
      if (allowableValues) {
        return currentIsNumber && current - 1;
      } else {
        return current >= 2 ? currentIsNumber && current - 1 : CounterStringValues.NotApplicable;
      }
    })();

    setCurrent(c);
  };

  useEffect(() => {
    if (initialValue) {
      if (allowableValues) {
        const index = allowableValues.findIndex((v) => v === initialValue);
        setCurrent(index >= 0 ? index : CounterStringValues.Any);
      } else {
        setCurrent(initialValue);
      }
    }
  }, [allowableValues, initialValue]);

  useEffect(() => {
    const calcV = (() => {
      if (any) {
        return CounterStringValues.Any;
      }
      if (nA) {
        return CounterStringValues.NotApplicable;
      }
      return allowableValues ? allowableValues[current] : current;
    })();

    setValue(calcV);
    if (!any) {
      onChange(calcV);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      <View style={styles.btnsWrap}>
        <CounterButton disabled={isMinValue} onPress={decrement} title={'-'} />
        <Text style={[TextStyles.btnTitle, styles.count]}>{value}</Text>
        <CounterButton disabled={isMaxValue} onPress={increment} title={'+'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    ...TextStyles.body1,
    lineHeight: 24,
    color: Colors.primaryBlack,
  },
  btnsWrap: {
    width: 151,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    color: Colors.primaryBlack,
  },
});

export default Counter;
