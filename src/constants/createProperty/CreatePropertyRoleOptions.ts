import { ImageSourcePropType } from 'react-native';
import { Action } from 'src/types';

const SellPropertyIcon = require('src/assets/img/sell-property-card-image.png');
const RentOutPropertyIcon = require('src/assets/img/rent-out-card-image.png');

export type RoleOption = {
  title: string;
  iconUrl: ImageSourcePropType;
  type: Action;
};

export const OPTIONS: RoleOption[] = [
  {
    title: 'Sell property',
    iconUrl: SellPropertyIcon,
    type: 'Sell',
  },
  {
    title: 'Rent out property',
    iconUrl: RentOutPropertyIcon,
    type: 'Rent-Out',
  },
];
