import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { searchResultCountSelector, searchResultRanges, searchSize } from 'src/redux/selectors/search';
import { updateSearchData, updateSearchFilter } from 'src/redux/actions/search';
import { Container, Page, Button, RangeSlider } from 'src/components';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { TextStyles } from 'src/styles/BaseStyles';
import { MeasureSquare, RangeValue, RangeValueDefault } from 'src/types';
import { sizeScreenStyle as styles } from '../../styles/stepperScreens/sizeScreens';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Routes from 'src/constants/routes';
import { CURRENCY_BUTTONS, SQUARE_BUTTONS } from 'src/constants/MeasureButtons';
import { getSliderRangeMax } from 'src/utils/rangeHelper';
import { useIsFocused } from '@react-navigation/native';
import * as NavigationService from 'src/services/NavigationService';
import { metricsSelector } from 'src/redux/selectors/app';
import { getSquareActiveIndex } from 'src/utils/metricsHelper';
import { setAppMetrics } from 'src/redux/actions/app';
import Typography from 'src/styles/Typography';

const DEFAULT_SQUARE_RANGE: RangeValueDefault = {
  min: 1,
  max: 500000,
};

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const OnboardingSearchSize = (props: Props) => {
  const { onNext, navigation } = props;
  const [rangeDefault, setRangeDefault] = useState<RangeValueDefault>({min: DEFAULT_SQUARE_RANGE.min, max: DEFAULT_SQUARE_RANGE.max});
  const [range, setRange] = useState<RangeValue>(null);
  
  const stateSearchSize = useSelector(searchSize);
  const stateSearchCount = useSelector(searchResultCountSelector);
  const stateRanges = useSelector(searchResultRanges);
  const stateMetrics = useSelector(metricsSelector);
  const isFocused = useIsFocused();
  const [activeBtnIndex, setActiveBtnIndex] = useState(getSquareActiveIndex(stateMetrics.square) || 0);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFocused) return;
    setRanges();
  }, [isFocused]);

  useEffect(() => {
    if (!stateSearchSize) return;

    const activeIndex = getSquareActiveIndex(stateSearchSize.measure as MeasureSquare);
    setActiveBtnIndex(activeIndex);
    setRange(stateSearchSize.range);
  }, [stateSearchSize]);

  const setRanges = async () => {
    await dispatch(updateSearchData({
      currency: stateMetrics.currency,
      square: stateMetrics.square,
    }));
  };

  useEffect(() => {
    const rangeValue = { lowest: rangeDefault.min, highest: rangeDefault.max } || stateSearchSize?.range;

    if (rangeValue && !range) {
      setRange(rangeValue);
    }

  }, [rangeDefault]);

  useEffect(() => {
    if (!stateRanges) return;

    setRangeDefault({
      min: parseFloat(stateRanges.minSize),
      max: parseFloat(stateRanges.maxSize),
    });
  }, [stateRanges]);

  const onShowResults = () => {
    NavigationService.navigate(Routes.Home, { screen: Routes.Search });
  };

  useEffect(() => {
    dispatch(updateSearchData({
      square: stateMetrics.square,
      currency: stateMetrics.currency
    }));
  }, [stateMetrics])

  const onMetricChange = (index: number) => {
    setActiveBtnIndex(index);
    dispatch(setAppMetrics({
      square: SQUARE_BUTTONS[index].measure,
    }));
  }

  const onSubmitHandler = () => {
    onNext();
  };

  if (!isFocused) return null;

  const activeMetric = SQUARE_BUTTONS[activeBtnIndex].measure;

  const isRangeDefault = rangeDefault?.min === DEFAULT_SQUARE_RANGE.min && rangeDefault?.max === DEFAULT_SQUARE_RANGE.max;
  const isRangeSliderDisabled = rangeDefault?.min === rangeDefault?.max || isRangeDefault;

  const onChangeFinish = (range: RangeValue) => {
    dispatch(updateSearchFilter({
      size: {
        range: range,
        measure: activeMetric,
      },
    }));
  };

  const getTitle = () => {
    const measure = SQUARE_BUTTONS[activeBtnIndex]?.symbol || stateMetrics?.square;
    if (isRangeDefault) {
      return (
        <Text style={[TextStyles.btnTitle, styles.rangeText]}>Any</Text>
      );
    }

    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Text style={[TextStyles.btnTitle, styles.rangeText]}>{`from ${Math.round(range?.lowest)} ${measure}`}</Text>
        <Text style={[TextStyles.btnTitle, styles.rangeText, { fontSize: 12, lineHeight: 18 }]}>2</Text>
        <Text style={[TextStyles.btnTitle, styles.rangeText]}>{` to ${Math.round(range?.highest)} ${measure}`}</Text>
        <Text style={[TextStyles.btnTitle, styles.rangeText, { fontSize: 12, lineHeight: 18 }]}>2</Text>
      </View>
    );
  };

  const maxDefaultValue = getSliderRangeMax(rangeDefault);

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.contentContainer}>
        <StepperTitle title='Size' />
        <View style={styles.btnWrap}>
          {SQUARE_BUTTONS.map((btn, i) => {
            const isActive = i === activeBtnIndex;
            return <TouchableOpacity  
            key={btn.measure}
            style={[styles.btn, isActive ? styles.activeBtn : {}]}
            onPress={() => onMetricChange(i)}>
              <Text style={[styles.btnTitle, isActive ? styles.activeBtnTitle : {}]}> {btn.symbol}</Text>
              <Text style={[Typography.btnTitle, styles.supStyle, isActive && styles.activeBtnTitle]}>2</Text>
          </TouchableOpacity>
          })}
        </View>
        <View style={styles.rangeSliderWrap}>
          <View style={styles.rangeTextWrap}>
            {getTitle()}
          </View>
          <RangeSlider
            min={rangeDefault?.min}
            max={maxDefaultValue}
            lowValue={stateSearchSize?.range?.lowest}
            highValue={stateSearchSize?.range?.highest}
            step={1}
            onChangeFinish={onChangeFinish}
            onChange={setRange}
            rangeDisabled={isRangeSliderDisabled}
          />
        </View>
      </Container>
      <StepperFooter
        onShowResults={onShowResults}
        onSubmit={onSubmitHandler}
        apartmentsLength={stateSearchCount}
        isNextBtnDisabled={false}
      />
    </Page>
  );
};

export default OnboardingSearchSize;
