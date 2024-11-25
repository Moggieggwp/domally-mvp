import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle, View, Text, Image, Platform } from 'react-native';
import Colors from 'src/constants/colors';
import BaseStyles, { TextStyles } from 'src/styles/BaseStyles';
import { Property } from 'src/types';
import Carousel from '../Carousel';
import Button from '../Button';

import ImagePlaceholder from 'src/assets/img/property-card-placeholder.png';
import BathroomIcon from 'src/assets/img/icons/property-details/bathroom-icon.svg';
import BedroomIcon from 'src/assets/img/icons/property-details/bedroom-icon.svg';
import SquareIcon from 'src/assets/img/icons/property-details/square-icon.svg';
import { getFormattedDate } from 'src/utils/dateHelper';
import CardStatus from './CardStatus';
import { getStatusBtnTitle } from 'src/utils/propertyStatusHelper';
import Layout from 'src/constants/Layout';
import { getCorrectCurrencyMeasure, getCorrectSquareMeasure } from 'src/utils/metricsHelper';
import { CURRENCY_BUTTONS, SQUARE_BUTTONS } from 'src/constants/MeasureButtons';
import FastImage from 'react-native-fast-image';
import Label from '../Label';
import priceFormatter from 'src/helpers/priceFormatter';

type Props = {
  style?: StyleProp<ViewStyle>;
  property: Property;
  onSubmitPress?: () => void;
  onMenuPress?: () => void;
};

const CONTAINER_PADDING = 32;

export default function PropertyCard(props: Props) {
  const { style, property, onSubmitPress, onMenuPress } = props;

  if (!property) {
    return null;
  }

  const createdDate = getFormattedDate(property.createdAt);

  const buttonTitle = getStatusBtnTitle(property.status);
  const bedrooms = property.residentialData?.residentialNumberOfBedrooms;
  const bathrooms = property.residentialData?.residentialNumberOfBathrooms;

  var squareUnit = getCorrectSquareMeasure(property?.size);
  var squareMeasure = SQUARE_BUTTONS.find((s) => s.measure == squareUnit?.measure)?.symbol || '';
  var priceUnit = getCorrectCurrencyMeasure(property?.price);
  var currencyMeasure = CURRENCY_BUTTONS.find((s) => s.measure == priceUnit?.measure)?.symbol || '';

  return (
    <View style={[styles.card, style]}>
      {onMenuPress && (
        <TouchableOpacity activeOpacity={0.8} style={styles.actionBtn} onPress={onMenuPress}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.lastDot]} />
        </TouchableOpacity>
      )}
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
            </View>
          </View>
        ) : (
          <Image source={ImagePlaceholder} style={styles.imagePlaceholder} />
        )}
        <View style={styles.labelContainer}>
          <Label title={property.action} color='red' />
          <Label title={property.detailedType} color='blue' />
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.details}>
          <CardStatus status={property.status} />
          <View style={styles.divider} />
          <View>
            <View style={styles.priceWrap}>
              <Text style={[TextStyles.h4]}>{`${currencyMeasure}${priceFormatter(priceUnit?.value) || 'N/A'}`}</Text>
              <Text style={[TextStyles.body2, styles.date]}>{createdDate || ''}</Text>
            </View>
            <View style={styles.propertyDetails}>
              <Text numberOfLines={2} style={[TextStyles.h5, styles.address]}>
                {property.location?.address || property.location?.city || 'N/A'}
              </Text>
              <Text style={[TextStyles.h5, styles.address]}>{property?.zoningCode}</Text>
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
                <View style={styles.squareItem}>
                  <SquareIcon />
                  <Text style={styles.squareItemText}>{`${squareUnit?.value || 'N/A'} ${squareMeasure || ''}`}</Text>
                  <Text style={[TextStyles.body2, styles.supStyle]}>2</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        {onSubmitPress && buttonTitle && <Button style={styles.btn} title={buttonTitle} onPress={onSubmitPress} />}
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
    ...Platform.select({
      android: {
        shadowColor: 'rgba(14, 20, 56, 0.6)',
        elevation: 1,
      },
    }),
    borderRadius: 16,
  },
  carouselWrap: {
    width: '100%',
    backgroundColor: Colors.grayLight,
    marginBottom: 12,
    borderRadius: 16,
  },
  imagePlaceholder: {
    height: 164,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 16,
  },
  carouselItem: {
    justifyContent: 'center',
    width: '100%',
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
  btn: {
    marginTop: 32,
  },
  actionBtn: {
    width: 24,
    height: 24,
    backgroundColor: Colors.black,
    opacity: 0.7,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 100,
    padding: 15,
  },
  dot: {
    height: 2.34,
    width: 2.34,
    borderRadius: 2.34,
    backgroundColor: Colors.white,
    marginRight: 1.75,
  },
  lastDot: {
    marginRight: 0,
  },
  squareDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  squareItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 17.3,
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
