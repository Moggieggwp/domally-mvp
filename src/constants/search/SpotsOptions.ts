import { ImageSourcePropType } from 'react-native';
import { NumberOfSpots } from 'src/types';

const one = require('src/assets/img/numbers/1.png');
const two = require('src/assets/img/numbers/2.png');
const three = require('src/assets/img/numbers/3.png');
const four = require('src/assets/img/numbers/4.png');
const noParking = require('src/assets/img/parking.png');

export type SpotsOption = {
  title: string;
  iconUrl: ImageSourcePropType;
  type: NumberOfSpots;
};

export const OPTIONS: SpotsOption[] = [
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
    title: 'No parking',
    iconUrl: noParking,
    type: 'no parking',
  },
];
