import { ImageSourcePropType } from 'react-native';
import { NumberOfUnits } from 'src/types';

const zero = require('src/assets/img/numbers/0.png');
const one = require('src/assets/img/numbers/1.png');
const two = require('src/assets/img/numbers/2.png');
const three = require('src/assets/img/numbers/3.png');
const four = require('src/assets/img/numbers/4.png');
const any = require('src/assets/img/numbers/any.png');

export type NumberOfUnitsOption = {
  title: string;
  iconUrl: ImageSourcePropType;
  type: NumberOfUnits;
};

export const OPTIONS: NumberOfUnitsOption[] = [
  {
    title: '0',
    iconUrl: zero,
    type: '0',
  },
  {
    title: '1',
    iconUrl: one,
    type: '1',
  },
  {
    title: '2',
    iconUrl: two,
    type: '2',
  },
  {
    title: '3',
    iconUrl: three,
    type: '3',
  },
  {
    title: '4+',
    iconUrl: four,
    type: '4+',
  },
  {
    title: 'Any',
    iconUrl: any,
    type: 'Any',
  },
];
