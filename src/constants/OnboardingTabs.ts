import { ImageSourcePropType, Platform } from 'react-native';
import Layout from 'src/constants/Layout';

const first = require('src/assets/img/onboarding/onboarding-1.png');
const second = require('src/assets/img/onboarding/onboarding-2.png');
const third = require('src/assets/img/onboarding/onboarding-3.png');

const firstSmall = require('src/assets/img/onboarding/onboarding-small-1.png');
const secondSmall = require('src/assets/img/onboarding/onboarding-small-2.png');
const thirdSmall = require('src/assets/img/onboarding/onboarding-small-3.png');

export type OnboardingTab = {
  id: number;
  title: string;
  desc: string;
  imgUrl: ImageSourcePropType;
};

export const Tabs: OnboardingTab[] = [
  {
    id: 1,
    title: 'Buy with Domally',
    desc: 'Find your perfect property with domally, connect directly with the seller and from the convenience of your mobile device!',
    imgUrl: Platform.OS === 'ios' ? (Layout.isMediumDevice ? firstSmall : first) : firstSmall, 
  },
  {
    id: 2,
    title: 'Sell with Domally',
    desc: 'Selling your property never got easier. You\'re not obligated to be tied to a contract or to pay fees. Connect directly to buyers and your preferred lawyer will complete the deal!',
    imgUrl: Platform.OS === 'ios' ? (Layout.isMediumDevice ? secondSmall : second) : secondSmall,
  },
  {
    id: 3,
    title: 'Rent with Domally',
    desc: 'Domally is perfect and the safest environment for tenants or landlords. Find your next property at domally!',
    imgUrl: Platform.OS === 'ios' ? (Layout.isMediumDevice ? thirdSmall : third) : thirdSmall,
  },
];

export const getTabById = (id: number): OnboardingTab => {
  return Tabs.find((tab) => tab.id === id);
};
