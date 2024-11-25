import { StackNavigationProp } from '@react-navigation/stack';
import { MeasureCurrency, MeasureSquare } from 'domally-utils/src/types';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, CurrencyToggle, Header, SquareToggle } from 'src/components';
import Colors from 'src/constants/colors';
import { setAppMetrics } from 'src/redux/actions/app';
import { metricsSelector } from 'src/redux/selectors/app';
import Typography from 'src/styles/Typography';
import { RootStackParamsList } from 'src/types/navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'Metrics'>;
};

const Metrics = (props: Props) => {
  const { navigation } = props;

  const [selectedCurrency, setSelectedCurrency] = useState<MeasureCurrency>(null);
  const [selectedSquare, setSelectedSquare] = useState<MeasureSquare>(null);
  const stateMetrics = useSelector(metricsSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!stateMetrics) return;

    if (stateMetrics.currency) {
      setSelectedCurrency(stateMetrics.currency);
    }

    if (stateMetrics.square) {
      setSelectedSquare(stateMetrics.square);
    }
  }, [stateMetrics]);

  const handleCurrencyToggle = async (currency: MeasureCurrency) => {
    setSelectedCurrency(currency);
    await dispatch(setAppMetrics({
      currency: currency,
    }));
  };

  const handleSquareToggle = async (square: MeasureSquare) => {
    setSelectedSquare(square);
    await dispatch(setAppMetrics({
      square: square,
    }));
  };

  return (
    <>
      <Header title={'Metrics'} arrowBack onBack={() => navigation.goBack()} />
      <SafeAreaView style={styles.screen}>
        <Container style={styles.container}>
          <View style={styles.toggleContainerMargin}>
            <View style={styles.toggleContainer}>
              <Text style={styles.label}>Currency</Text>
              <CurrencyToggle selectedCurrency={selectedCurrency} handleCurrencyToggle={handleCurrencyToggle} />
            </View>
            <View style={styles.toggleContainer}>
              <Text style={styles.label}>Square</Text>
              <SquareToggle selectedSquare={selectedSquare} handleSquareToggle={handleSquareToggle} />
            </View>
          </View>
        </Container>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  label: {
    ...Typography.body2,
    color: Colors.black,
  },
  toggleContainerMargin: {
    marginTop: 40,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default Metrics;
