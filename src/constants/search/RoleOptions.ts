import { ImageSourcePropType } from 'react-native';
import { Action } from 'src/types';

const BuyPropertyIcon = require('src/assets/img/buy-property-card-image.png');
const SellPropertyIcon = require('src/assets/img/sell-property-card-image.png');
const RentPropertyIcon = require('src/assets/img/rent-property-card-image.png');
const RentOutPropertyIcon = require('src/assets/img/rent-out-card-image.png');

export type RoleOption = {
  title: string;
  iconUrl: ImageSourcePropType;
  type: Action;
};

export const OPTIONS: RoleOption[] = [
  {
    title: 'Buy property',
    iconUrl: BuyPropertyIcon,
    type: 'Buy',
  },
  {
    title: 'Sell property',
    iconUrl: SellPropertyIcon,
    type: 'Sell',
  },
  {
    title: 'Rent property',
    iconUrl: RentPropertyIcon,
    type: 'Rent',
  },
  {
    title: 'Rent out property',
    iconUrl: RentOutPropertyIcon,
    type: 'Rent-Out',
  },
];
