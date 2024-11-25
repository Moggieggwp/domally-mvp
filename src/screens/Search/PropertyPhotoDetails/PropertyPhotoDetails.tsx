import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import BackArrow from 'src/assets/img/icons/back-arrow-white.svg';
import { Carousel, Preloader } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import { propertyDetailsSelector, searchLoadingSelector } from 'src/redux/selectors/search';
import { TextStyles } from 'src/styles/BaseStyles';
import { MeasureCurrency } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';

const CONTAINER_PADDING = 0;

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'PropertyPhotoDetails'>;
};

const PropertyPhotoDetails = (props: Props) => {
  const { navigation } = props;

  const isLoading = useSelector(searchLoadingSelector);
  const property = useSelector(propertyDetailsSelector);

  const price = (() => {
    if (!property?.price) {
      return 'N/A';
    }

    return `${property.price.measure === MeasureCurrency.CAD ? 'CA$' : '$'}${property.price.value}`;
  })();

  const renderHeaderPropertyInfo = () => (
    <View style={styles.headerPropertyInfo}>
      <Text style={[styles.headerPropertyInfoText, styles.headerPropertyInfoAddress]} numberOfLines={1}>
        {property.location.address}
      </Text>
      <Text style={styles.headerPropertyInfoText}>{price}</Text>
    </View>
  );

  if (!property) {
    return <Preloader />;
  }

  return (
    <>
      {isLoading && <Preloader />}
      <View style={styles.screen}>
        <View style={[styles.header]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <BackArrow width={24} height={24} />
          </TouchableOpacity>
          {renderHeaderPropertyInfo()}
        </View>
        <View style={styles.carouselContainer}>
          <Carousel
            items={[...property.photos]}
            defaultPhoto={property.defaultPhoto}
            sliderHeight={Layout.getViewHeight(29)}
            sliderWidth={Layout.window.width - CONTAINER_PADDING}
            itemHeight={Layout.getViewHeight(29)}
            itemWidth={Layout.window.width - CONTAINER_PADDING}
            itemStyle={styles.carouselItem}
            hasTotalCount
            style={styles.carousel}
            paginationStyle={styles.pagination}
            totalStyle={styles.total}
            useScrollView={false}
            canZoom
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.primaryBlack,
    flex: 1,
  },
  header: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 57 : 16, 
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 17 : 33,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  shareHeader: {
    justifyContent: 'space-between',
  },
  carouselContainer: {
    position: 'relative',
    flex: 1,
  },
  carousel: {
    marginVertical: 'auto',
    borderRadius: 0,
    alignItems: 'center',
    flex: 1,
  },
  carouselItem: {
    justifyContent: 'center',
    width: '100%',
    height: Layout.getViewHeight(29),
    marginTop: Layout.getViewHeight(18.5),
  },
  pagination: {
    top: Layout.getViewHeight(15),
  },
  total: {
    top: 0,
    bottom: 'auto',
  },
  headerPropertyInfo: {
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  shareHeaderPropertyInfo: {
    alignItems: 'center',
  },
  headerPropertyInfoText: {
    ...TextStyles.h3,
    color: Colors.white,
    maxWidth: Layout.getViewWidth(70),
  },
  headerPropertyInfoAddress: {
    marginBottom: 4,
    marginTop: 2,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 10,
    padding: 10,
    zIndex: 1,
  },
});

export default PropertyPhotoDetails;
