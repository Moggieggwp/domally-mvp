import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useSelector } from 'react-redux';
import { Alert, Image, Linking, Platform, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import LikeIcon from 'src/assets/img/icons//property-details/likes-icon.svg';
import LikedIcon from 'src/assets/img/icons/likedIcon.svg';
import BathroomIcon from 'src/assets/img/icons/property-details/bathroom-icon.svg';
import BedroomIcon from 'src/assets/img/icons/property-details/bedroom-icon.svg';
import CallsIcon from 'src/assets/img/icons/property-details/calls-icon.svg';
import ParkingIcon from 'src/assets/img/icons/property-details/parking-icon.svg';
import ReviewsIcon from 'src/assets/img/icons/property-details/reviews-icon.svg';
import SquareIcon from 'src/assets/img/icons/property-details/square-icon.svg';
import scheduleTourIcon from 'src/assets/img/icons/scheduleTour.png';
import ImagePlaceholder from 'src/assets/img/property-card-placeholder.png';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { CURRENCY_BUTTONS, SQUARE_BUTTONS } from 'src/constants/MeasureButtons';
import BaseStyles, { TextStyles } from 'src/styles/BaseStyles';
import { FavouriteProperty, Property } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { getFormattedDate } from 'src/utils/dateHelper';
import * as Routes from 'src/constants/routes';
import { getCorrectCurrencyMeasure, getCorrectSquareMeasure } from 'src/utils/metricsHelper';
import { profileDataSelector } from 'src/redux/selectors/profile';
import FastImage from 'react-native-fast-image';
import Label from '../Label';
import priceFormatter from 'src/helpers/priceFormatter';

const CONTAINER_PADDING = 32;

type Props = {
  style?: StyleProp<ViewStyle>;
  property: FavouriteProperty;
  isUnliked: boolean;
  onLikePress?: (property: Property) => void;
  navigation: BottomTabNavigationProp<RootStackParamsList, 'Favourite'>;
};

export default function FavouritePropertyCard(props: Props) {
  const { style, property, isUnliked, onLikePress, navigation } = props;
  const user = useSelector(profileDataSelector);

  const onLike = () => {
    onLikePress?.(property);
  };

  const handleUserCall = () => {
    Linking.openURL(`tel:${property.userPhone}`);
  };

  const onChat = () => navigation.navigate(Routes.Chat, { propertyId: property.id, userId: user.id });

  const onScheduleTour = () => {
    navigation.navigate(Routes.Chat, { scheduleTour: true, propertyId: property.id, userId: user.id });
  };

  if (!property) {
    return null;
  }

  const createdDate = getFormattedDate(property.createdAt);

  const renderSquareDetails = (property: Property) => {
    const bedrooms = property.residentialData?.residentialNumberOfBedrooms;
    const bathrooms = property.residentialData?.residentialNumberOfBathrooms;

    var parkingSpots = null;

    if (property.type === 'Residential') {
      parkingSpots = property.residentialData?.numberOfSpots;
    } else if (property.type === 'Commercial') {
      parkingSpots = property.commercialData?.numberOfSpots;
    }

    var squareUnit = getCorrectSquareMeasure(property?.size);
    var squareMeasure = SQUARE_BUTTONS.find((s) => s.measure == squareUnit?.measure)?.symbol || '';

    return (
      <View style={styles.squareDetails}>
        {bedrooms ? (
          <View style={styles.squareItem}>
            <BedroomIcon />
            <Text style={styles.squareItemText}>{bedrooms}</Text>
          </View>
        ) : null}
        {bathrooms ? (
          <View style={styles.squareItem}>
            <BathroomIcon />
            <Text style={styles.squareItemText}>{bathrooms}</Text>
          </View>
        ) : null}
        {parkingSpots ? (
          <View style={styles.squareItem}>
            <ParkingIcon />
            <Text style={styles.squareItemText}>{parkingSpots}</Text>
          </View>
        ) : null}
        <View style={styles.squareItem}>
          <SquareIcon />
          <Text style={styles.squareItemText}>{`${squareUnit?.value || 'N/A'} ${squareMeasure}`}</Text>
          <Text style={[TextStyles.body2, styles.supStyle]}>2</Text>
        </View>
      </View>
    );
  };

  var priceUnit = getCorrectCurrencyMeasure(property?.price);
  var currencyMeasure = CURRENCY_BUTTONS.find((s) => s.measure == priceUnit?.measure)?.symbol || '';

  return (
    <View style={[styles.card, style]}>
      <View style={styles.carouselWrap}>
        {property?.photos?.length ? (
          <View style={[BaseStyles.flexCenter, styles.containerImage]}>
            <View style={[styles.cardImage, styles.carouselItem]}>
              <FastImage
                style={styles.image}
                source={{
                  uri: property.defaultPhoto,
                  priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.cover}
              />
              <View style={styles.labelContainer}>
                <Label title={property.action} color='red' />
                <Label title={property.detailedType} color='blue' />
              </View>
            </View>
          </View>
        ) : (
          <Image source={ImagePlaceholder} style={styles.imagePlaceholder} />
        )}
      </View>
      <View style={styles.cardContent}>
        <View style={styles.details}>
          <View style={styles.divider} />
          <View style={styles.detailsWrap}>
            <View style={styles.priceWrap}>
              <Text style={[TextStyles.h4]}>{`${currencyMeasure}${priceFormatter(priceUnit?.value) || ' N/A'}`}</Text>
              <Text style={[TextStyles.body2, styles.date]}>{createdDate || ''}</Text>
            </View>
            <View style={styles.propertyDetails}>
              <Text numberOfLines={2} style={[TextStyles.h5, styles.address]}>
                {property.location?.address || ' N/A'}
              </Text>
              <Text style={[TextStyles.h5, styles.address]}>{property?.zoningCode || ' N/A'}</Text>
            </View>
            {renderSquareDetails(property)}
          </View>
        </View>
        <View style={styles.statWrap}>
          <View style={styles.statsContainer}>
            {property.userPhone && (
              <TouchableOpacity style={styles.statsItem} onPress={handleUserCall}>
                <CallsIcon width={20} height={20} />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.statsItem} onPress={onChat}>
              <ReviewsIcon width={20} height={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.statsItem} onPress={onLike}>
              {isUnliked ? <LikeIcon width={20} height={20} /> : <LikedIcon width={20} height={20} />}
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={styles.scheduleTourContainer} onPress={onScheduleTour}>
              <Image source={scheduleTourIcon} style={styles.buttonIcon} />
              <Text style={{ ...TextStyles.h6, color: Colors.white }}>Schedule tour</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

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
    ...Platform.select({
      android: {
        shadowColor: 'rgba(14, 20, 56, 0.6)',
        elevation: 1,
      },
    }),
  },
  carouselWrap: {
    width: '100%',
    backgroundColor: Colors.lightBlue,
    marginBottom: 12,
    borderRadius: 16,
  },
  imagePlaceholder: {
    height: 164,
    width: '100%',
    resizeMode: 'contain',
  },
  carouselItem: {
    justifyContent: 'center',
  },
  cardContent: {
    paddingHorizontal: 12,
    paddingBottom: 14,
  },
  details: {
    width: '100%',
  },
  divider: {
    backgroundColor: Colors.gray,
    borderRadius: 100,
    width: '100%',
    height: 1,
    marginBottom: 10,
  },
  detailsWrap: {
    marginBottom: 32,
  },
  priceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  date: {
    color: Colors.darkGray,
  },
  propertyDetails: {
    overflow: 'hidden',
    alignItems: 'flex-start',
  },
  address: {
    color: Colors.defaultText,
    marginBottom: 10,
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
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 12.5,
  },
  scheduleTourContainer: {
    height: 32,
    width: Platform.OS === 'ios' ? Layout.getViewWidth(36) : Layout.isWideAndroid ? Layout.getViewWidth(36) : Layout.getViewWidth(40),
    borderRadius: 10,
    backgroundColor: Colors.primaryBlue,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginLeft: 20,
    marginRight: 7,
  },

  squareDetails: {
    flexDirection: 'row',
  },
  squareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 17.7,
  },
  squareItemText: {
    ...TextStyles.body2,
    marginLeft: 7.7,
  },
  supStyle: {
    fontSize: 10,
    lineHeight: 10,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    width: '100%',
  },
  cardImage: {
    height: 164,
    width: Layout.window.width - CONTAINER_PADDING,
  },
  containerImage: {
    borderRadius: 17,
    overflow: 'hidden',
  },
  labelContainer: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    alignItems: 'flex-start',
  },
});
