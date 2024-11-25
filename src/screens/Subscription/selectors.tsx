import { Platform } from 'react-native';
import ImagePlaceholder from 'src/assets/img/property-card-placeholder.png';
import premiumBadgeBasic from 'src/assets/img/premiumMonth.png';
import premiumBadgePro from 'src/assets/img/premiumYear.png';

export const getSubscriptionPeriod = (iappProduct) => {
  switch (Platform.OS) {
    case 'ios':
      return iappProduct.subscriptionPeriodUnitIOS.charAt(0).toLowerCase();
    case 'android':
      switch (iappProduct.subscriptionPeriodAndroid) {
        case 'P1M':
          return 'm';
        case 'P1Y':
          return 'y';
        default:
          return null;
      }
  }
};

export const getImageBadge = (productId) => {
    switch (productId) {
      case 'user_premium':
        return premiumBadgeBasic;
      case 'user_premium_year':
        return premiumBadgePro;
      default:
        return ImagePlaceholder;
    }
  };
