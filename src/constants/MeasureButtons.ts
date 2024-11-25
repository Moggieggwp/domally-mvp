import { MeasureCurrency, MeasureSquare } from 'src/types';

export type MetricSquareBtn = {
  measure: MeasureSquare;
  symbol: string;
};

export type MetricCurrencyBtn = {
  measure: MeasureCurrency;
  symbol: string;
};

export const CURRENCY_BUTTONS: MetricCurrencyBtn[] = [
  {
    measure: MeasureCurrency.CAD,
    symbol: 'CA$',
  },
  {
    measure: MeasureCurrency.USD,
    symbol: '$',
  },
];

export const SQUARE_BUTTONS: MetricSquareBtn[] = [
  {
    measure: MeasureSquare.SQM,
    symbol: 'm',
  },
  {
    measure: MeasureSquare.SQFT,
    symbol: 'ft',
  },
];
