import React from 'react';
import { Image, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LikeIcon from 'src/assets/img/icons//property-details/likes-icon.svg';
import LikedIcon from 'src/assets/img/icons/likedIcon.svg';
import BathroomIcon from 'src/assets/img/icons/property-details/bathroom-icon.svg';
import BedroomIcon from 'src/assets/img/icons/property-details/bedroom-icon.svg';
import ReviewsIcon from 'src/assets/img/icons/property-details/reviews-icon.svg';
import SquareIcon from 'src/assets/img/icons/property-details/square-icon.svg';
import scheduleTourIcon from 'src/assets/img/icons/scheduleTour.png';
import ImagePlaceholder from 'src/assets/img/property-card-placeholder.png';
import Label from 'src/components/Label';
import Colors from 'src/constants/colors/Colors';
import Layout from 'src/constants/Layout';
import { CURRENCY_BUTTONS, SQUARE_BUTTONS } from 'src/constants/MeasureButtons';
import * as Routes from 'src/constants/routes';
import priceFormatter from 'src/helpers/priceFormatter';
import { likeProperty, unlikeProperty } from 'src/redux/actions/favourites';
import { profileDataSelector } from 'src/redux/selectors/profile';
import * as NavigationService from 'src/services/NavigationService';
import { TextStyles } from 'src/styles/BaseStyles';
import { Property } from 'src/types';
import { getFormattedDate } from 'src/utils/dateHelper';
import { getCorrectCurrencyMeasure, getCorrectSquareMeasure } from 'src/utils/metricsHelper';

type Props = {
  style?: StyleProp<ViewStyle>;
  property: Property;
  isSignedIn: boolean;
  isPremium: boolean;
  onCardPress: () => void;
};

const MapPropertyCard = (props: Props) => {
  const { style, property, isSignedIn, isPremium, onCardPress } = props;

  const dispatch = useDispatch();
  const user = useSelector(profileDataSelector);

  const handleLike = () => {
    if (isSignedIn) {
      if (!isPremium) {
        NavigationService.navigate(Routes.Subscription, {});
        return;
      }
      if (property.hasLike) {
        dispatch(unlikeProperty(property.id));
      } else {
        dispatch(likeProperty(property.id));
      }
    } else {
      NavigationService.navigate(Routes.SignIn, { navigationParams: { screen: Routes.Search, params: { screen: Routes.Search } } });
    }
  };

  const handleChatIconPress = () => {
    if (isSignedIn) {
      if (!isPremium) {
        NavigationService.navigate(Routes.Subscription, {});
      } else {
        NavigationService.navigate(Routes.Chat, { propertyId: property.id, userId: user.id });
      }
    } else {
      NavigationService.navigate(Routes.SignIn, { navigationParams: { screen: Routes.Search, params: { screen: Routes.Search } } });
    }
  };

  const onScheduleTour = () => {
    if (isSignedIn) {
      if (!isPremium) {
        NavigationService.navigate(Routes.Subscription, {});
      } else {
        NavigationService.navigate(Routes.Chat, { scheduleTour: true, propertyId: property.id, userId: user.id });
      }
    } else {
      NavigationService.navigate(Routes.SignIn, { navigationParams: { screen: Routes.Search, params: { screen: Routes.Search } } });
    }
  };

  if (!property) {
    return null;
  }

  const createdDate = getFormattedDate(property.createdAt);

  const bedrooms = property.residentialData?.residentialNumberOfBedrooms;
  const bathrooms = property.residentialData?.residentialNumberOfBathrooms;

  var squareUnit = getCorrectSquareMeasure(property?.size);
  var squareMeasure = SQUARE_BUTTONS.find((s) => s.measure == squareUnit?.measure)?.symbol || '';
  var priceUnit = getCorrectCurrencyMeasure(property?.price);
  var currencyMeasure = CURRENCY_BUTTONS.find((s) => s.measure == priceUnit?.measure)?.symbol || '';

  return (
    <TouchableOpacity style={[styles.card, style]} activeOpacity={1} onPress={onCardPress}>
      <View style={styles.cardContent}>
        <View style={styles.rowWrap}>
          <View style={styles.column}>
            <Text style={[TextStyles.h4]}>{`${currencyMeasure}${priceFormatter(priceUnit?.value) || ' N/A'}`}</Text>
            <View style={styles.labelContainer}>
                <Label title={property.action} color='red' />
                <Label title={property.detailedType} color='blue' labelContainerStyle={{ maxWidth: 90 }} />
              </View>
            <View style={styles.propertyDetails}>
              <View style={styles.squareDetails}>
                {bedrooms > 0 && (
                  <View style={styles.squareItem}>
                    <BedroomIcon />
                    <Text style={styles.squareItemText}>{bedrooms}</Text>
                  </View>
                )}
                {bathrooms > 0 && (
                  <View style={styles.squareItem}>
                    <BathroomIcon />
                    <Text style={styles.squareItemText}>{bathrooms}</Text>
                  </View>
                )}
                <View style={styles.squareItem}>
                  <SquareIcon />
                  <Text style={styles.squareItemText}>{`${squareUnit?.value || 'N/A'} ${squareMeasure || ''}`}</Text>
                  <Text style={[TextStyles.body2, styles.supStyle]}>2</Text>
                </View>
              </View>
            </View>
            <Text numberOfLines={1} style={[TextStyles.thinBody, styles.address]}>
              {property.location?.address || 'N/A'}
            </Text>
            <Text style={[TextStyles.thinBody, styles.address]}>{property?.zoningCode || 'N/A'}</Text>

            <Text style={[TextStyles.body2, styles.date]}>{createdDate || ''}</Text>
          </View>
          <View style={styles.column}>
            {property.defaultPhoto ? (
              <Image source={{ uri: property.defaultPhoto.toString() }} style={styles.imagePlaceholder} />
            ) : (
              <Image source={ImagePlaceholder} style={styles.imagePlaceholder} />
            )}
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.statWrap}>
            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.statsItem} onPress={handleChatIconPress}>
                <ReviewsIcon width={20} height={20} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.statsItem} onPress={handleLike}>
                {property.hasLike ? <LikedIcon width={20} height={20} /> : <LikeIcon width={20} height={20} />}
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.scheduleTourContainer} onPress={onScheduleTour}>
            <Image source={scheduleTourIcon} style={styles.buttonIcon} />
            <Text style={styles.scheduleTourText}>Schedule tour</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 15,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 1,
    borderRadius: 16,
  },
  cardContent: {
    padding: 12,
  },
  rowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
  },
  propertyDetails: {
    marginTop: 10,
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  squareDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  squareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  squareItemText: {
    ...TextStyles.body2,
    marginLeft: 7.7,
  },
  address: {
    marginVertical: 4,
    color: Colors.defaultText,
    maxWidth: Layout.getViewWidth(49),
    paddingRight: 5,
  },
  date: {
    color: Colors.darkGray,
  },
  statWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsItem: {
    paddingHorizontal: 15,
    alignSelf: 'center',
    paddingVertical: 5,
  },
  imagePlaceholder: {
    height: Layout.getViewHeight(13),
    width: Layout.getViewWidth(36),
    borderRadius: 10,
  },
  scheduleTourContainer: {
    height: 32,
    borderRadius: 10,
    backgroundColor: Colors.primaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginLeft: 20,
    marginRight: 7,
  },
  bottomContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  scheduleTourText: {
    ...TextStyles.h6,
    color: Colors.white,
    marginRight: 20,
  },
  supStyle: {
    fontSize: 10,
    lineHeight: 10,
  },
  labelContainer: {
    flexDirection: 'row',
  },
});

export default MapPropertyCard;
