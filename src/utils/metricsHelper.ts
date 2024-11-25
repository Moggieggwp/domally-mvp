import { Unit } from 'domally-utils/src/types';
import { CURRENCY_BUTTONS, SQUARE_BUTTONS } from 'src/constants/MeasureButtons';
import store from 'src/redux/store';
import { MeasureCurrency, MeasureSquare } from 'src/types';

export const getCurrencyActiveIndex = (currency: MeasureCurrency) => {
  if (!currency) return null;
  return CURRENCY_BUTTONS.findIndex((b) => b.measure === currency);
};

export const getSquareActiveIndex = (square: MeasureSquare) => {
  if (!square) return null;
  return SQUARE_BUTTONS.findIndex((b) => b.measure === square);
};

export const getCorrectSquareMeasure = (square: Unit) => {
  const usersSquare = store.getState().app.metrics?.square;

  if (!square || square.measure === usersSquare) {
    return square;
  }

  const squareRates = store.getState().app.measureRates?.squareRates;
  switch (square.measure) {
    case MeasureSquare.SQFT:
      return {
        measure: usersSquare,
        value: Math.floor(square.value * squareRates.sqm.sqftRate),
      };
    case MeasureSquare.SQM:
      return {
        measure: usersSquare,
        value: Math.floor(square.value * squareRates.sqft.sqmRate),
      };
    default:
      return square;
  }
};

export const getCorrectCurrencyMeasure = (currency: Unit) => {
  const usersCurrency = store.getState().app.metrics?.currency;

  if (!currency || currency.measure === usersCurrency) {
    return currency;
  }

  const currencyRates = store.getState().app.measureRates?.currencyRates;

  if (!currencyRates){
    return currency;
  }

  switch (currency.measure) {
    case MeasureCurrency.CAD:
      return {
        measure: usersCurrency,
        value: Math.floor(currency.value * currencyRates.usd.cadRate),
      };
    case MeasureCurrency.USD:
      return {
        measure: usersCurrency,
        value: Math.floor(currency.value * currencyRates.cad.usdRate),
      };
    default:
      return currency;
  }
};
