import React, { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Slider from 'rn-range-slider';
import { StyleSheet } from 'react-native';
import Thumb from './Thumb';
import Rail from './Rail';
import RailSelected from './RailSelected';
import Notch from './Notch';
import Label from './Label';
import { RangeValue } from 'src/types';

type RangeSliderProps = {
  onChange?: (value: RangeValue) => void;
  min: number;
  max: number;
  lowValue?: number;
  highValue?: number;
  rangeDisabled?: boolean;
  step: number;
  onChangeFinish?: (value: RangeValue) => void;
  onTouchStart?: () => void;
  onTouchEnd?: () => void;
};

const RangeSlider = (props: RangeSliderProps) => {
  const { onChange, rangeDisabled, step, min, max, lowValue, highValue, onChangeFinish, onTouchStart, onTouchEnd } = props;

  const [low, setLow] = useState(null);
  const [high, setHigh] = useState(null);

  const [minValue, setMin] = useState(min);
  const [maxValue, setMax] = useState(max);

  const renderLabel = useCallback(value => <Label text={parseInt(value, 10)} />, []);
  const renderNotch = useCallback(() => <Notch />, []);
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);

  useEffect(() => {
    if (min) {
      setMin(min);
      if (!lowValue) {
        setLow(min);
      }
    }
    if (max) {
      setMax(max);
      if (!highValue) {
        setHigh(max);
      }
    }
  }, [min, max]);

  useEffect(() => {
    if (lowValue) {
      setLow(lowValue);
    }
    if (highValue) {
      setHigh(highValue);
    }
  }, [lowValue, highValue]);

  const handleValueChange = useCallback((low: number, high: number) => {
    if (onChange) {
      onChange({
        lowest: low,
        highest: high,
      });
    }

    setLow(low);
    setHigh(high);
  }, [rangeDisabled]);

  const onChangeFinishHandler = () => {
    props.onTouchEnd?.();

    onChangeFinish?.({
      lowest: low,
      highest: high,
    });
  };

  const onTouchStartHandler = () => {
    props.onTouchStart?.();
  };

  return (
    <View style={[styles.sliderWrap, rangeDisabled && styles.sliderDisabled]}>
      <Slider
        style={styles.slider}
        min={minValue}
        max={maxValue}
        low={low}
        high={high}
        step={step || 1}
        floatingLabel={false}
        renderThumb={renderThumb}
        renderRail={renderRail}
        renderRailSelected={renderRailSelected}
        renderLabel={renderLabel}
        renderNotch={renderNotch}
        onValueChanged={handleValueChange}
        onTouchStart={onTouchStartHandler}
        onTouchEnd={onChangeFinishHandler}
      />
      {rangeDisabled && <View style={styles.overlay} />}
    </View>
  );
};

const styles = StyleSheet.create({
  sliderWrap: {
    width: '100%',
  },
  sliderDisabled: {
    opacity: 0.2,
  },
  slider: {
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'transparent',
    zIndex: 10,
    width: '100%',
    height: '100%',
  }
});

export default RangeSlider;
