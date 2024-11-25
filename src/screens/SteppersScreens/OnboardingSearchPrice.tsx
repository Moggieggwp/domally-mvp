import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { searchPrice, searchResultCountSelector, searchResultRanges } from 'src/redux/selectors/search';
import { updateSearchData, updateSearchFilter } from 'src/redux/actions/search';
import { Container, Page, Button, RangeSlider } from 'src/components';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { TextStyles } from 'src/styles/BaseStyles';
import { MeasureCurrency, RangeValue, RangeValueDefault } from 'src/types';
import { sizeScreenStyle as styles } from '../../styles/stepperScreens/sizeScreens';
import { moneyFormatter } from 'src/helpers/moneyFormatter';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Routes from 'src/constants/routes';
import { CURRENCY_BUTTONS } from 'src/constants/MeasureButtons';
import { getSliderRangeMax } from 'src/utils/rangeHelper';
import { useIsFocused } from '@react-navigation/native';
import * as NavigationService from 'src/services/NavigationService';
import { metricsSelector } from 'src/redux/selectors/app';
import { getCurrencyActiveIndex } from 'src/utils/metricsHelper';
import { setAppMetrics } from 'src/redux/actions/app';

const DEFAULT_PRICE_RANGE: RangeValueDefault = {
  min: 1,
  max: 10000000,
};

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const OnboardingSearchPrice = (props: Props) => {
  const { onNext, navigation } = props;
  const [rangeDefault, setRangeDefault] = useState<RangeValueDefault>({min: DEFAULT_PRICE_RANGE.min, max: DEFAULT_PRICE_RANGE.max});
  const [range, setRange] = useState<RangeValue>(null);

  const stateSearchPrice = useSelector(searchPrice);
  const stateSearchCount = useSelector(searchResultCountSelector);
  const stateRanges = useSelector(searchResultRanges);
  const stateMetrics = useSelector(metricsSelector);
  const [activeBtnIndex, setActiveBtnIndex] = useState<number>(getCurrencyActiveIndex(stateMetrics.currency) || 0);

  const isFocused = useIsFocused();

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFocused) return;
    setRanges();
  }, [isFocused]);

  useEffect(() => {
    if (!stateSearchPrice || !isFocused) return;

    const activeIndex = getCurrencyActiveIndex(stateSearchPrice.measure as MeasureCurrency);
    setActiveBtnIndex(activeIndex);

    setRange(stateSearchPrice.range);
  }, [stateSearchPrice]);

  const setRanges = async () => {
    await dispatch(updateSearchData({
      currency: stateMetrics.currency,
      square: stateMetrics.square,
    }));
  };

  useEffect(() => {
    if (!isFocused) return;
    const rangeValue = { lowest: rangeDefault.min, highest: rangeDefault.max } || stateSearchPrice?.range;

    if (rangeValue && !range) {
      setRange(rangeValue);
    }

    if (stateSearchPrice?.measure) {
      const activeIndex = getCurrencyActiveIndex(stateSearchPrice.measure as MeasureCurrency);
      setActiveBtnIndex(activeIndex);
    }

  }, [rangeDefault]);

  useEffect(() => {
    if (!stateRanges || !isFocused) return;
    setRangeDefault({
      min: parseFloat(stateRanges.minPrice),
      max: parseFloat(stateRanges.maxPrice),
    });
  }, [stateRanges]);

  const onShowResults = () => {
    NavigationService.navigate(Routes.Home, { screen: Routes.Search });
  };

  const onMetricChange = (index: number) => {
    if (!isFocused) return;
    dispatch(updateSearchData({
      currency: CURRENCY_BUTTONS[index].measure,
    }, false));

    dispatch(setAppMetrics({
      currency: CURRENCY_BUTTONS[index].measure,
    }));

    dispatch(updateSearchFilter({
      price: {
        range: range,
        measure: CURRENCY_BUTTONS[index].measure,
      },
    }));
  };

  const onSubmitHandler = () => {
    onNext();
  };

  const onChangeFinish = () => {
    dispatch(updateSearchFilter({
      price: {
        range: range,
        measure: CURRENCY_BUTTONS[activeBtnIndex].measure,
      },
    }));
  };

  if (!isFocused) return null;

  const isRangeDefault = rangeDefault?.min === DEFAULT_PRICE_RANGE.min && rangeDefault?.max === DEFAULT_PRICE_RANGE.max;
  const isRangeSliderDisabled = rangeDefault?.min === rangeDefault?.max || isRangeDefault;

  const activeMetricSymbol = CURRENCY_BUTTONS[activeBtnIndex]?.symbol || stateMetrics?.currency;

  const getTitle = () => {
    if (isRangeDefault) {
      return 'Any';
    }

    return `from ${moneyFormatter(Math.round(range?.lowest), 3)} ${activeMetricSymbol} to ${moneyFormatter(Math.round(range?.highest), 3)} ${activeMetricSymbol}`;
  };

  const maxDefaultValue = getSliderRangeMax(rangeDefault);
  const step = Math.round(maxDefaultValue/rangeDefault?.min);

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.contentContainer}>
        <StepperTitle title='Planned Price' />
        <View style={styles.btnWrap}>
          {CURRENCY_BUTTONS.map((btn, i) => {
            const isActive = i === activeBtnIndex;
            return <Button
              key={btn.measure}
              btnUnderlayColor='transparent'
              style={[styles.btn, isActive ? styles.activeBtn : {}]}
              titleStyles={[styles.btnTitle, isActive ? styles.activeBtnTitle : {}]}
              title={btn.measure}
              onPress={() => onMetricChange(i)}
            />
          })}
        </View>
        <View style={styles.rangeSliderWrap}>
          <View style={styles.rangeTextWrap}>
            <Text style={[TextStyles.btnTitle, styles.rangeText]}>{getTitle()}</Text>
          </View>
          <RangeSlider
            min={rangeDefault?.min}
            max={maxDefaultValue}
            lowValue={stateSearchPrice?.range?.lowest}
            highValue={stateSearchPrice?.range?.highest}
            step={10}
            onChange={setRange}
            onChangeFinish={onChangeFinish}
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

export default OnboardingSearchPrice;
