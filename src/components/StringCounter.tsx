import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import Colors from 'src/constants/colors';
import { CounterStringValues } from 'src/constants/propertyDetails';
import { TextStyles } from 'src/styles/BaseStyles';
import CounterButton from './CounterButton';

type CounterProps = {
  onChange: (value: number) => void;
  initialValue?: number;
  allowableValues: string[];
  title?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

const StringCounter = (props: CounterProps) => {
  const { style, title, onChange, initialValue, allowableValues, titleStyle } = props;
  const [currentIndex, setCurrentIndex] = useState(null);

  useEffect(() => {
    onChange(parseFloat(allowableValues[currentIndex] || undefined));
  }, [currentIndex]);

  useEffect(() => {
      const initialIndex = initialValue && allowableValues ? allowableValues.indexOf(initialValue.toString()) : null;
      setCurrentIndex(initialIndex);
  }, [initialValue]);

  const next = () => {
    if (currentIndex == (allowableValues.length - 1)) return;

    if (currentIndex === null || currentIndex === undefined) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex(prev => prev + 1);
  };

  const prev = () => {
    if (currentIndex === 0) {
      setCurrentIndex(null);
      return;
    }

    setCurrentIndex(prev => prev - 1);
  };

  const isFirst = currentIndex === null;
  const isLast = currentIndex == (allowableValues.length - 1);

  return (
    <View style={[styles.container, style]}>
      {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      <View style={styles.btnsWrap}>
        <CounterButton disabled={isFirst} onPress={prev} title={'-'} />
        <Text style={[TextStyles.btnTitle, styles.count]}>{allowableValues?.[currentIndex] || CounterStringValues.NotApplicable}</Text>
        <CounterButton disabled={isLast} onPress={next} title={'+'} />
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

export default StringCounter;
