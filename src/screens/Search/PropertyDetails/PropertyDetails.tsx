import analytics from '@react-native-firebase/analytics';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Linking, ScrollView, Platform, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView from 'react-native-map-clustering';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheetContainer from 'reanimated-bottom-sheet';
import LikeIcon from 'src/assets/img/icons//property-details/likes-icon.svg';
import backArrow from 'src/assets/img/icons/backArrow.png';
import LikedIcon from 'src/assets/img/icons/likedIcon.svg';
import mapIcon from 'src/assets/img/icons/mapIcon.png';
import moreIcon from 'src/assets/img/icons/moreIcon.png';
import BathroomIcon from 'src/assets/img/icons/property-details/bathroom-icon.svg';
import BedroomIcon from 'src/assets/img/icons/property-details/bedroom-icon.svg';
import CallsIcon from 'src/assets/img/icons/property-details/calls-icon.svg';
import ParkingIcon from 'src/assets/img/icons/property-details/parking-icon.svg';
import ReviewsIcon from 'src/assets/img/icons/property-details/reviews-icon.svg';
import SquareIcon from 'src/assets/img/icons/property-details/square-icon.svg';
import scheduleTourIcon from 'src/assets/img/icons/scheduleTour.png';
import ImagePlaceholder from 'src/assets/img/property-card-placeholder.png';
import { BottomSheet, Button, Carousel, CheckBox, Preloader, TextEditor } from 'src/components';
import Colors from 'src/constants/colors/Colors';
import { getPropertyDetailsLink } from 'src/constants/deepLinks';
import Layout from 'src/constants/Layout';
import { CURRENCY_BUTTONS, SQUARE_BUTTONS } from 'src/constants/MeasureButtons';
import * as Routes from 'src/constants/routes';
import { OPTIONS as CommercialTypeOptions } from 'src/constants/search/CommercialTypeOptions';
import { OPTIONS as IndustrialTypeOptions } from 'src/constants/search/IndustrialTypeOptions';
import { OPTIONS as LandTypeOptions } from 'src/constants/search/LandTypeOptions';
import { OPTIONS as ResidentialTypesOptions } from 'src/constants/search/ResidentialTypesOptions';
import useDidUpdateEffect from 'src/helpers/hooks';
import priceFormatter from 'src/helpers/priceFormatter';
import { likeProperty, unlikeProperty } from 'src/redux/actions/favourites';
import { getPropertyDetails, getPropertyUser, sendPropertyClaim } from 'src/redux/actions/search';
import { isPremiumSelector, isSignedInSelector, profileDataSelector } from 'src/redux/selectors/profile';
import { propertyDetailsSelector, propertyUserProfileSelector, searchLoadingSelector } from 'src/redux/selectors/search';
import { TextStyles } from 'src/styles/BaseStyles';
import mapStyles from 'src/styles/MapStyles';
import { PropertyStatus } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { getFormattedDate } from 'src/utils/dateHelper';
import { getCorrectCurrencyMeasure, getCorrectSquareMeasure } from 'src/utils/metricsHelper';

const CONTAINER_PADDING = 0;
const DEFAULT_MAP_PADDING = { top: 60, right: 60, bottom: 60, left: 60 };
const INITIAL_REGION = {
  latitude: 37.72825,
  longitude: -122.4324,
  latitudeDelta: 0.25,
  longitudeDelta: 0.15,
};

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'PropertyDetails'>;
  route: RouteProp<RootStackParamsList, 'PropertyDetails'>;
};

const complainQuestions = ['Wrong pictures', 'Wrong address', 'Wrong price', 'Cheating', 'Apartment is rented out or sold', 'Not owner', 'Other'];

const PropertyDetails = (props: Props) => {
  const { navigation, route } = props;
  const propertyId = route.params?.propertyId;
  const onGoBack = route.params?.onGoBack;

  const isSignedIn = useSelector(isSignedInSelector);
  const isPremium = useSelector(isPremiumSelector);

  const dispatch = useDispatch();
  const isLoading = useSelector(searchLoadingSelector);
  const property = useSelector(propertyDetailsSelector);
  const propertyUserProfile = useSelector(propertyUserProfileSelector);
  const user = useSelector(profileDataSelector);

  const isMyProperty = property?.userId === user?.id;

  useEffect(() => {
    dispatch(getPropertyDetails(propertyId));
    analytics().logEvent('property_view', { id: propertyId });
  }, [dispatch, propertyId]);

  useDidUpdateEffect(() => {
    if (property) {
      dispatch(getPropertyUser(property.userId));
    }
  }, [property]);

  const [readMoreOpened, setReadMore] = useState(false);
  const [showMenuMoreSheet, setShowMenuMoreSheet] = useState(false);
  const [showComplainSheet, setShowComplainSheet] = useState(false);
  const [showMapSheet, setShowMapSheet] = useState(false);
  const [checkedComplainQuestion, setCheckedComplainQuestion] = useState('');
  const [complainDescription, setComplainDescription] = useState('');
  const [descriptionHeight, setDescriptionHeight] = useState(0);

  const descriptionLinesLimit = 3;
  const showReadMoreButton = descriptionHeight > TextStyles.body2.lineHeight * descriptionLinesLimit || property?.description?.length > 190;

  const createdDate = getFormattedDate(property?.createdAt);

  var squareUnit = getCorrectSquareMeasure(property?.size);
  var squareMeasure = SQUARE_BUTTONS.find((s) => s.measure == squareUnit?.measure)?.symbol || '';
  var priceUnit = getCorrectCurrencyMeasure(property?.price);
  var currencyMeasure = CURRENCY_BUTTONS.find((s) => s.measure == priceUnit?.measure)?.symbol || '';

  const totalSquare = getCorrectSquareMeasure({
    measure: property?.size.measure,
    value: property?.squareDetails?.map((x) => x.square).reduce((a, b) => a + b, 0),
  })?.value;

  const moreMenuSheetRef = useRef<BottomSheetContainer>(null);
  const complainSheetRef = useRef<BottomSheetContainer>(null);
  const mapSheetRef = useRef<BottomSheetContainer>(null);
  const mapRef = useRef(null);

  const onShowMorePress = useCallback(() => {
    setShowMenuMoreSheet(true);
    moreMenuSheetRef.current.snapTo(0);
  }, [showMenuMoreSheet]);

  const hideMoreSheet = () => {
    setShowMenuMoreSheet(false);
    moreMenuSheetRef.current.snapTo(1);
  };

  const onShowMapPress = useCallback(() => {
    setShowMapSheet(true);
    mapSheetRef.current.snapTo(0);
  }, [showMapSheet]);

  const hideMapSheet = () => {
    setShowMapSheet(false);
    mapSheetRef.current.snapTo(1);
  };

  const fitMarker = async () => {
    await mapRef.current.setCamera({
      center: {
        latitude: property.location.coords.lat,
        longitude: property.location.coords.lon,
      },
    });
  };

  const handleUserCall = () => {
    if (isSignedIn) {
      if (!isPremium) {
        navigation.navigate(Routes.Subscription);
        return;
      }

      if (!propertyUserProfile?.isPhoneNumberDisabled) {
        Linking.openURL(`tel:${propertyUserProfile.phone}`);
      }
    } else {
      navigation.navigate(Routes.SignIn, {
        navigationParams: {
          screen: Routes.Search,
          params: { screen: Routes.PropertyDetails, params: { propertyId: propertyId, onGoBack: () => navigation.navigate(Routes.Search) } },
        },
      });
    }
  };

  const onChat = () => {
    if (isSignedIn) {
      if (!isPremium) {
        navigation.navigate(Routes.Subscription);
      } else {
        navigation.navigate(Routes.Chat, { propertyId: property.id, userId: user.id });
      }
    } else {
      navigation.navigate(Routes.SignIn, {
        navigationParams: {
          screen: Routes.Search,
          params: { screen: Routes.PropertyDetails, params: { propertyId: propertyId, onGoBack: () => navigation.navigate(Routes.Search) } },
        },
      });
    }
  };

  const onScheduleTour = () => {
    if (isSignedIn) {
      if (!isPremium) {
        navigation.navigate(Routes.Subscription);
      } else {
        navigation.navigate(Routes.Chat, { scheduleTour: true, propertyId: property.id, userId: user.id });
      }
    } else {
      navigation.navigate(Routes.SignIn, {
        navigationParams: {
          screen: Routes.Search,
          params: { screen: Routes.PropertyDetails, params: { propertyId: propertyId, onGoBack: () => navigation.navigate(Routes.Search) } },
        },
      });
    }
  };

  const onShowComplainPress = useCallback(() => {
    setShowComplainSheet(true);
    complainSheetRef.current.snapTo(0);
  }, [showComplainSheet]);

  const hideComplainSheet = () => {
    setShowComplainSheet(false);
    complainSheetRef.current.snapTo(1);
  };

  const handleComplainSubmit = () => {
    if (checkedComplainQuestion || complainDescription) {
      dispatch(
        sendPropertyClaim({
          propertyId: property.id,
          reason: checkedComplainQuestion,
          description: complainDescription,
        }),
      );
      setCheckedComplainQuestion('');
      setComplainDescription('');
      hideComplainSheet();
    }
  };

  const handleShareToPress = async () => {
    const url = getPropertyDetailsLink(property.id);
    let message = 'There is a property details';
    if (Platform.OS === 'android') {
      message += ` ${url}`;
    }

    await Share.share({
      message,
      url,
    });

    hideMoreSheet();
  };

  const handlePhotosPress = () => navigation.navigate(Routes.PropertyPhotoDetails);

  const handleLike = () => {
    if (isSignedIn) {
      if (!isPremium) {
        navigation.navigate(Routes.Subscription);
        return;
      }

      if (!property.hasLike) {
        dispatch(likeProperty(property.id));
      } else {
        dispatch(unlikeProperty(property.id));
      }
      dispatch(getPropertyDetails(propertyId));
    } else {
      navigation.navigate(Routes.SignIn, {
        navigationParams: {
          screen: Routes.Search,
          params: { screen: Routes.PropertyDetails, params: { propertyId: propertyId, onGoBack: () => navigation.navigate(Routes.Search) } },
        },
      });
    }
  };

  const renderPropertyDetails = () => {
    switch (property.type) {
      case 'Residential':
        return renderResidentialDetails();
      case 'Commercial':
        return renderCommercialDetails();
      default:
        return null;
    }
  };

  const renderSquareDetails = () => {
    switch (property.type) {
      case 'Residential':
        return renderResedentialSquareDetails();
      case 'Commercial':
        return renderCommercialSquareDetails();
      default:
        return renderCommonSquareDetails();
    }
  };

  const getDetailedTypeIcon = () => {
    switch (property.type) {
      case 'Residential':
        return ResidentialTypesOptions.find((x) => x.type == property.detailedType).iconUrl;
      case 'Commercial':
        return CommercialTypeOptions.find((x) => x.type == property.detailedType).iconUrl;
      case 'Industrial':
        return IndustrialTypeOptions.find((x) => x.type == property.detailedType).iconUrl;
      case 'Land':
        return LandTypeOptions.find((x) => x.type == property.detailedType).iconUrl;
      default:
        return null;
    }
  };

  const getDetailedTypeText = () => {
    switch (property.type) {
      case 'Residential':
        return ResidentialTypesOptions.find((x) => x.type == property.detailedType).title;
      case 'Commercial':
        return CommercialTypeOptions.find((x) => x.type == property.detailedType).title;
      case 'Industrial':
        return IndustrialTypeOptions.find((x) => x.type == property.detailedType).title;
      case 'Land':
        return LandTypeOptions.find((x) => x.type == property.detailedType).title;
      default:
        return null;
    }
  };

  const renderResedentialSquareDetails = () => {
    const bedrooms = property.residentialData?.residentialNumberOfBedrooms;
    const bathrooms = property.residentialData?.residentialNumberOfBathrooms;
    const parkingSpots = property.residentialData?.numberOfSpots;

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
          <Text style={styles.squareItemText}>{`${squareUnit?.value || 'N/A'} ${squareUnit && squareMeasure}`}</Text>
          <Text style={[TextStyles.body2, styles.supStyle]}>2</Text>
        </View>
      </View>
    );
  };

  const renderCommercialSquareDetails = () => {
    const parkingSpots = property.commercialData?.numberOfSpots;

    return (
      <View style={styles.squareDetails}>
        {parkingSpots ? (
          <View style={styles.squareItem}>
            <ParkingIcon />
            <Text style={styles.squareItemText}>{parkingSpots}</Text>
          </View>
        ) : null}
        <View style={styles.squareItem}>
          <SquareIcon />
          <Text style={styles.squareItemText}>{`${squareUnit?.value || 'N/A'} ${squareUnit && squareMeasure}`}</Text>
          <Text style={[TextStyles.body2, styles.supStyle]}>2</Text>
        </View>
      </View>
    );
  };

  const renderCommonSquareDetails = () => (
    <View style={styles.squareDetails}>
      <View style={styles.squareItem}>
        <SquareIcon />
        <Text style={styles.squareItemText}>{`${squareUnit?.value || 'N/A'} ${squareUnit && squareMeasure}`}</Text>
        <Text style={[TextStyles.body2, styles.supStyle]}>2</Text>
      </View>
    </View>
  );

  const renderResidentialDetails = () => {
    const additions = property.residentialData?.residentialAdditions;
    const squareDetails = property.squareDetails;

    return (
      <View>
        <View style={styles.additionsWrap}>
          {Object.keys(additions).map(
            (key) =>
              additions[key].value && (
                <View key={additions[key].name} style={styles.additionItem}>
                  <Text style={styles.additionItemText}>{additions[key].name}</Text>
                </View>
              ),
          )}
        </View>
        <View style={styles.squareDetailsWrap}>
          <View style={styles.squareItemWrap}>
            <View style={[styles.backhroundCircle, styles.squareDetailsItem]}>
              <Text style={TextStyles.h4}>{`${totalSquare} ${squareMeasure}`}</Text>
              <Text style={[TextStyles.h4, styles.supStyle]}>2</Text>
            </View>
            <Text style={styles.squareName}>Total</Text>
          </View>
          {squareDetails?.map((s) => (
            <View key={s.name} style={styles.squareItemWrap}>
              <View style={[styles.backhroundCircle, styles.squareDetailsItem]}>
                <Text style={TextStyles.h4}>{`${s.square} ${squareMeasure}`}</Text>
                <Text style={[TextStyles.h4, styles.supStyle]}>2</Text>
              </View>
              <Text style={styles.squareName}>{s.name}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderCommercialDetails = () => {
    const additions = property.commercialData?.commercialAdditions;
    const numberOfUnits = property.commercialData?.commercialUnits;
    const numberOfCommercialUnits = property.commercialData?.numberOfCommercialUnits;
    const numberOfResidentialUnits = property.commercialData?.commercialResidentialUnits;

    return (
      <View>
        <View style={styles.additionsWrap}>
          {Object.keys(additions).map(
            (key) =>
              additions[key].value && (
                <View key={additions[key].name} style={styles.additionItem}>
                  <Text style={styles.additionItemText}>{additions[key].name}</Text>
                </View>
              ),
          )}
        </View>
        <View style={styles.commercialUnitWrap}>
          <View style={styles.commercialUnitItem}>
            <View style={[styles.backhroundCircle]}>
              <Text style={TextStyles.h4}>{numberOfUnits || 'N/A'}</Text>
            </View>
            <Text style={[styles.squareName]}>Number of units</Text>
          </View>
          <View style={styles.commercialUnitItem}>
            <View style={[styles.backhroundCircle]}>
              <Text style={TextStyles.h4}>{numberOfCommercialUnits || 'N/A'}</Text>
            </View>
            <Text style={[styles.squareName]}>Number of commercial units</Text>
          </View>
          <View style={styles.commercialUnitItem}>
            <View style={[styles.backhroundCircle]}>
              <Text style={TextStyles.h4}>{numberOfResidentialUnits || 'N/A'}</Text>
            </View>
            <Text style={[styles.squareName]}>Number of residental units</Text>
          </View>
        </View>
      </View>
    );
  };

  if (!property || property.id !== propertyId) {
    return <Preloader />;
  }

  return (
    <>
      {isLoading && <Preloader />}
      <View style={styles.screen}>
        <TouchableOpacity
          onPress={() => {
            onGoBack ? onGoBack() : navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Image source={backArrow} />
        </TouchableOpacity>
        {property?.status === PropertyStatus.PUBLISHED && (
          <TouchableOpacity onPress={onShowMorePress} style={styles.moreButton}>
            <Image source={moreIcon} />
          </TouchableOpacity>
        )}
        <ScrollView>
          <View>
            {property?.photos?.length ? (
              <Carousel
                items={property.photos}
                defaultPhoto={property.defaultPhoto}
                sliderHeight={Layout.getViewHeight(29)}
                sliderWidth={Layout.window.width - CONTAINER_PADDING}
                itemHeight={Layout.getViewHeight(29)}
                itemWidth={Layout.window.width - CONTAINER_PADDING}
                itemStyle={styles.carouselItem}
                hasTotalCount
                propertyType={property.detailedType}
                propertyAction={property.action}
                style={styles.carousel}
                onPressCb={handlePhotosPress}
              />
            ) : (
              <Image source={ImagePlaceholder} style={styles.imagePlaceholderStyle} />
            )}
          </View>
          <View style={styles.container}>
            <View style={styles.rowWrap}>
              <Text style={[TextStyles.h4]}>{`${currencyMeasure}${priceFormatter(priceUnit?.value) || ' N/A'}`}</Text>
              <Text style={styles.date}>{createdDate || ''}</Text>
            </View>

            <View style={styles.headerWrap}>
              <View style={styles.propertyDetails}>
                {renderSquareDetails()}
                <Text numberOfLines={2} style={[TextStyles.h5, styles.address]}>
                  {property?.location?.address || 'N/A'}
                </Text>
                <Text numberOfLines={1} style={[TextStyles.h5, styles.address]}>
                  {property?.zoningCode || 'N/A'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.mapCircleWrap}
                onPress={() => {
                  onShowMapPress();
                  fitMarker();
                }}
              >
                <Image source={mapIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.featureDetails}>
              <View style={styles.detailedTypeWrap}>
                <View style={styles.backhroundCircle}>
                  <Image source={getDetailedTypeIcon()} style={styles.detailedTypeIcon} />
                </View>
                <Text style={styles.detailedTypeText}>{getDetailedTypeText()}</Text>
              </View>
              {renderPropertyDetails()}
            </View>

            <View style={styles.descriptionDetails}>
              <Text
                onLayout={(event) => setDescriptionHeight(event.nativeEvent.layout.height)}
                numberOfLines={readMoreOpened ? null : descriptionLinesLimit}
                style={styles.descriptionText}
              >
                {property?.description}
              </Text>
              {showReadMoreButton &&
                (!readMoreOpened ? (
                  <TouchableOpacity onPress={() => setReadMore(true)}>
                    <Text style={styles.readMoreText}>Read More</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => setReadMore(false)}>
                    <Text style={styles.readMoreText}>Hide Info</Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </ScrollView>
        {!isMyProperty && (
          <View style={styles.footer}>
            <View style={styles.bottomContainer}>
              <View style={styles.statsContainer}>
                {property.userId === propertyUserProfile?.id && !propertyUserProfile?.isPhoneNumberDisabled && (
                  <TouchableOpacity style={styles.statsItem} onPress={handleUserCall}>
                    <CallsIcon width={20} height={20} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.statsItem} onPress={onChat}>
                  <ReviewsIcon width={20} height={20} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.statsItem} onPress={handleLike}>
                  {property.hasLike ? <LikedIcon width={20} height={20} /> : <LikeIcon width={20} height={20} />}
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.scheduleTourContainer} onPress={onScheduleTour}>
                <Image source={scheduleTourIcon} style={styles.buttonIcon} />
                <Text style={styles.scheduleTourText}>Schedule tour</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <BottomSheet
          sheetRef={moreMenuSheetRef}
          onClose={() => setShowMenuMoreSheet(false)}
          onOutsidePress={hideMoreSheet}
          isActive={showMenuMoreSheet}
          snapPoints={[213, -5]}
          containerStyle={styles.sheetContainer}
          showBg
        >
          <View style={styles.sheetButtonsContainer}>
            {isSignedIn && !isMyProperty && (
              <TouchableOpacity
                style={styles.sheetButton}
                onPress={() => {
                  hideMoreSheet();
                  onShowComplainPress();
                }}
              >
                <Text style={styles.complainSheetText}>Complain</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.shareToButton} onPress={handleShareToPress}>
              <Text style={styles.defaultSheetText}>Share to...</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.cancelSheetButton}>
            <TouchableOpacity onPress={hideMoreSheet}>
              <Text style={styles.cancelSheetText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>

        <BottomSheet
          title={'What’s wrong?'}
          sheetRef={complainSheetRef}
          onClose={() => setShowComplainSheet(false)}
          onOutsidePress={hideComplainSheet}
          isActive={showComplainSheet}
          snapPoints={[600, -5]}
          containerStyle={{ height: 'auto' }}
          showBg
        >
          <View style={styles.sheetButtonsContainer}>
            {complainQuestions.map((item) => {
              const isChecked = checkedComplainQuestion === item;
              return (
                <TouchableOpacity onPress={() => setCheckedComplainQuestion(item)} key={item} style={styles.claimItem}>
                  <Text style={styles.claimItemText}>{item}</Text>
                  <CheckBox checked={isChecked} onChange={() => setCheckedComplainQuestion(item)} />
                </TouchableOpacity>
              );
            })}
            <View>
              <TextEditor
                title={'description'}
                name={'description'}
                value={complainDescription}
                placeholder={'Your comment'}
                containerStyle={styles.textEditorContainer}
                multiline
                onChange={(value) => setComplainDescription(value)}
              />
            </View>
            <View>
              <Button title={'Submit'} style={styles.claimSubmitBtn} onPress={handleComplainSubmit} />
            </View>
          </View>
          <View style={styles.cancelSheetButton}>
            <TouchableOpacity onPress={hideComplainSheet}>
              <Text style={styles.cancelSheetText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </BottomSheet>

        <BottomSheet
          sheetRef={mapSheetRef}
          onClose={() => setShowMapSheet(false)}
          isActive={showMapSheet}
          snapPoints={[600, -5]}
          containerStyle={styles.complainSheetContainer}
          childrenContainerStyle={{ paddingHorizontal: 0, paddingTop: 0 }}
          onOutsidePress={hideMapSheet}
          showBg
        >
          <MapView
            mapRef={(ref) => {
              mapRef.current = ref;
            }}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyles}
            initialRegion={INITIAL_REGION}
            loadingEnabled={Platform.OS === 'android'}
            maxZoomLevel={19}
            minZoomLevel={10}
            showsBuildings={false}
            pitchEnabled={false}
            showsCompass={false}
            showsIndoors={false}
            zoomTapEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              key={property.id}
              identifier={property.id.toString()}
              pinColor={'transparent'}
              tracksViewChanges={false}
              coordinate={{
                longitude: property.location?.coords?.lon,
                latitude: property.location?.coords?.lat,
              }}
            >
              <View style={[styles.marker, { backgroundColor: Colors.white }]}>
                <Text style={[styles.markerText, { color: Colors.black }]}>${property.price.value}</Text>
              </View>
              <View style={[styles.triangle, { borderBottomColor: Colors.white }]} />
            </Marker>
          </MapView>
        </BottomSheet>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  container: {
    padding: 24,
    flex: 1,
  },
  carousel: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  backButton: {
    position: 'absolute',
    zIndex: 1,
    top: Platform.OS === 'ios' ? 54 : 16,
    left: 16,
    backgroundColor: Colors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    position: 'absolute',
    zIndex: 1,
    top: Platform.OS === 'ios' ? 54 : 16,
    right: 16,
    opacity: 0.7,
    backgroundColor: Colors.black,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselItem: {
    justifyContent: 'center',
    width: '100%',
    height: Layout.getViewHeight(29),
  },
  propertyDetails: {
    marginTop: 14,
    overflow: 'hidden',
    alignItems: 'flex-start',
    paddingBottom: 12,
    width: '80%',
  },
  squareDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  address: {
    marginVertical: 7,
    color: Colors.defaultText,
  },
  date: {
    ...TextStyles.body2,
    color: Colors.darkGray,
  },
  footer: {
    height: Layout.getViewHeight(10),
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 15,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    paddingHorizontal: 35,
    paddingBottom: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginRight: 25,
    alignSelf: 'center',
    padding: 5,
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
  scheduleTourText: {
    ...TextStyles.h6,
    color: Colors.white,
    marginRight: 20,
  },
  descriptionText: {
    ...TextStyles.body2,
  },
  descriptionDetails: {
    marginTop: 16,
    paddingBottom: 16,
  },
  imagePlaceholderStyle: {
    justifyContent: 'center',
    width: '100%',
    height: Layout.getViewHeight(29),
    borderBottomRightRadius: 17,
    borderBottomLeftRadius: 17,
  },
  featureDetails: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    paddingBottom: 16,
  },
  featureText: {
    ...TextStyles.btnTitle,
    color: Colors.primaryBlack,
  },
  featureLabel: {
    ...TextStyles.btnTitle,
    color: Colors.defaultText,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  readMoreText: {
    ...TextStyles.body2,
    color: '#5883FC',
    marginTop: 12,
  },
  rowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backhroundCircle: {
    height: 70,
    width: 70,
    borderRadius: 45,
    backgroundColor: Colors.defaultBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailedTypeWrap: {
    width: '30%',
  },
  supStyle: {
    fontSize: 10,
    lineHeight: 10,
  },
  mapCircle: {
    height: 70,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapCircleWrap: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  detailedTypeIcon: {
    width: 55,
    height: 55,
  },
  detailedTypeText: {
    ...TextStyles.body2,
    textTransform: 'capitalize',
    color: Colors.black,
    marginTop: 8,
  },
  additionsWrap: {
    marginTop: 16,
    flexDirection: 'row',
  },
  additionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primaryBlack,
    borderRadius: 100,
    marginRight: 5,
  },
  squareDetailsWrap: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  squareItemWrap: {
    alignItems: 'center',
    marginRight: 16,
    marginTop: 16,
  },
  squareDetailsItem: {
    flexDirection: 'row',
  },
  squareName: {
    ...TextStyles.body2,
    marginTop: 6,
    textAlign: 'center',
  },
  additionItemText: {
    ...TextStyles.checkBoxTitle,
    textTransform: 'capitalize',
    paddingHorizontal: 5,
  },
  headerWrap: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commercialUnitWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  commercialUnitItem: {
    alignItems: 'center',
    marginTop: 16,
    width: '30%',
    marginRight: 12,
  },
  sheetContainer: {
    height: 220,
  },
  sheetButtonsContainer: {
    marginTop: 12,
  },
  sheetButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  copyLinkButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  shareToButton: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 8,
  },
  cancelSheetButton: {
    marginTop: 14,
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 10,
  },
  cancelSheetText: {
    ...TextStyles.h5,
    color: Colors.darkGray,
  },
  defaultSheetText: {
    ...TextStyles.h5,
    color: Colors.primaryBlue,
  },
  complainSheetText: {
    ...TextStyles.h5,
    color: Colors.red,
  },
  complainSheetContainer: {
    height: 620,
  },
  textEditorContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: Colors.darkGray,
    marginTop: 24,
  },
  claimItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  claimSubmitBtn: {
    marginTop: 16,
    height: Layout.getViewHeight(5),
  },
  claimItemText: {
    ...TextStyles.body1,
    color: Colors.primaryBlack,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  marker: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  markerText: {
    ...TextStyles.h5,
    alignSelf: 'center',
    fontWeight: '600',
    textAlign: 'center',
    zIndex: 1,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.white,
    transform: [{ rotate: '180deg' }],
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
    zIndex: 2,
  },
});

export default PropertyDetails;
