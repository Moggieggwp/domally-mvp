import { ImageSourcePropType } from 'react-native';
import { PropertyType } from 'src/types';

const ResidentalIcon = require('src/assets/img/properties/residental.png');
const CommercialIcon = require('src/assets/img/properties/commercial.png');
const IndustrialIcon = require('src/assets/img/properties/industrial.png');
const LandIcon = require('src/assets/img/properties/land.png');

export type PropertyOption = {
  title: string;
  iconUrl: ImageSourcePropType;
  type: PropertyType;
  sheetMessage: {
    title: string;
    desc: string;
  };
};

export const OPTIONS: PropertyOption[] = [
  {
    title: 'Residential',
    iconUrl: ResidentalIcon,
    type: 'Residential',
    sheetMessage: {
      title: 'Residential',
      desc: 'is property zoned specifically for living or dwelling for individuals or households; it may include standalone single-family dwellings to large, multi-unit apartment buildings.',
    },
  },
  {
    title: 'Commercial',
    iconUrl: CommercialIcon,
    type: 'Commercial',
    sheetMessage: {
      title: 'Commercial',
      desc: 'is a property that is used exclusively for business-related purposes or to provide a workspace rather than as a living space, this broad category of real estate can include everything from a single storefront to a huge shopping center. In some cases, Residential properties containing more than a certain number of units qualify as commercial property for borrowing and tax purposes.',
    },
  },
  {
    title: 'Industrial',
    iconUrl: IndustrialIcon,
    type: 'Industrial',
    sheetMessage: {
      title: 'Industrial',
      desc: 'properties used to develop, manufacture, or produce goods and products, as well as logistics real estate that supports the movement and storage of products and goods.',
    },
  },
  {
    title: 'Land',
    iconUrl: LandIcon,
    type: 'Land',
    sheetMessage: {
      title: 'Land',
      desc: "any land that doesn't have a building located on it is considered 'vacant land'. There is residential vacant land, which can mean land that has been carved up by a developer with the potential for a residential property to be built on to it.",
    },
  },
];

export const PROPERTY_TYPE_HEADER = [
  {
    title: 'Rent',
    type: 'Rent-Out',
  },
  {
    title: 'Buy',
    type: 'Sell',
  },
];
