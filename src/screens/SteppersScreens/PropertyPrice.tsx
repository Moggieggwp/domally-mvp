import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, CurrencyToggle, Page, TextInput } from 'src/components';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import Layout from 'src/constants/Layout';
import { currentPropertyId, currentPropertyPrice } from 'src/redux/selectors/currentProperty';
import { saveProperty } from 'src/redux/actions/currentProperty';
import { CURRENCY_DEFAULT_SETTING } from 'src/utils/storageKeys';
import StorageAsync from 'src/services/Storage';
import { CURRENCY_BUTTONS } from 'src/constants/MeasureButtons';
import { MeasureCurrency } from 'src/types';
import { metricsSelector } from 'src/redux/selectors/app';
import { setAppMetrics } from 'src/redux/actions/app';
import priceFormatter from 'src/helpers/priceFormatter';

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const PropertyPrice = (props: Props) => {
  const { onNext } = props;
  const [inputValue, setInputValue] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<MeasureCurrency>(null);
  const propertyId = useSelector(currentPropertyId);
  const statePrice = useSelector(currentPropertyPrice);
  const stateMetrics = useSelector(metricsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (statePrice) {
      setInputValue(statePrice.value?.toString());
    }
  }, [statePrice]);

  useEffect(() => {
    if (!stateMetrics) return;

    setSelectedCurrency(stateMetrics.currency);
  }, [stateMetrics]);

  const onTextChange = (value: string) => {
    setInputValue(value.replace(/,/g,''));
  };

  const handleCurrencyToggle = (currency: MeasureCurrency) => {
    dispatch(setAppMetrics({
      currency: currency,
    }));
  };

  const onSubmitHandler = async () => {
    await dispatch(saveProperty({
      id: propertyId,
      price: {
        value: parseInt(inputValue),
        measure: selectedCurrency,
      },
    }));

    onNext();
  };

  const formatTextInput = value => {
    if(!value) return null;

    return priceFormatter(value);
  }

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.container}>
        <StepperTitle style={styles.title} title='Price' />
        <View style={styles.content}>
          <TextInput
            styleWrap={styles.inputWrap}
            label='Please enter price'
            onChange={onTextChange}
            value={formatTextInput(inputValue)}
            autoFocus
            keyboardType='numeric'
          />
          <CurrencyToggle selectedCurrency={selectedCurrency} handleCurrencyToggle={handleCurrencyToggle} />
        </View>
      </Container>
      <StepperFooter
        onSubmit={onSubmitHandler}
        isNextBtnDisabled={inputValue?.length === 0}
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Layout.getViewHeight(3.2),
  },
  title: {
    marginBottom: 24,
  },
  content: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputWrap: {
    width: 170,
  },
});

export default PropertyPrice;
