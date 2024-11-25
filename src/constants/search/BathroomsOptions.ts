import { ImageSourcePropType } from 'react-native';
import { NumberOfBathrooms } from 'src/types';

const one = require('src/assets/img/numbers/1.png');
const to = require('src/assets/img/numbers/2.png');
const three = require('src/assets/img/numbers/3.png');
const four = require('src/assets/img/numbers/4.png');

export type BedroomOption = {
  title: string;
  iconUrl: ImageSourcePropType;
  type: NumberOfBathrooms;
};

export const OPTIONS: BedroomOption[] = [
  {
    title: '1',
    iconUrl: one,
    type: '1',
  },
  {
    title: '2',
    iconUrl: to,
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
];
