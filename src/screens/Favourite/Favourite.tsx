import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useIsFocused } from '@react-navigation/native';
import { PropertyDto } from 'domally-utils';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Linking, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, FavouritePropertyCard, Preloader } from 'src/components';
import Colors from 'src/constants/colors';
import * as Routes from 'src/constants/routes';
import { OPTIONS as PropertyTypesOptions, PROPERTY_TYPE_HEADER } from 'src/constants/search/PropertyTypesOptions';
import { getFavouriteProperties, likeProperty, unlikeProperty } from 'src/redux/actions/favourites';
import { favouritePropertiesSelector, loadingSelector, unlikedFavouritesSelector } from 'src/redux/selectors/favourites';
import { isPremiumSelector, isSignedInSelector, profileDataSelector } from 'src/redux/selectors/profile';
import { TextStyles } from 'src/styles/BaseStyles';
import { FavouriteProperty, Property, PropertyType, PropertyTypeHeader } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { emptyFavourites, favouritesHome } from './assets';
import * as NavigationService from 'src/services/NavigationService';
import { useBackButtonListener } from 'src/helpers/hooks';

type Props = {
  navigation: BottomTabNavigationProp<RootStackParamsList, 'Favourite'>;
};

const Favourite = (props: Props) => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const isSignedIn = useSelector(isSignedInSelector);
  const favourtiteProperties = useSelector(favouritePropertiesSelector);
  const isLoading = useSelector(loadingSelector);
  const isPremium = useSelector(isPremiumSelector);
  const unlikedFavourites = useSelector(unlikedFavouritesSelector);
  const [activePropertyTab, setActivePropertyTab] = useState<PropertyType>('Residential');
  const [activeHeaderPropertyTab, setHeaderActivePropertyTab] = useState<PropertyTypeHeader>(PROPERTY_TYPE_HEADER[0].type);
  const [filteredProperties, setFilteredProperties] = useState<FavouriteProperty[]>();
  const user = useSelector(profileDataSelector);

  const isFocused = useIsFocused();
  const backListener = useBackButtonListener();

  useEffect(() => {
    if (isSignedIn && isFocused) {
      dispatch(getFavouriteProperties());
    }
  }, [dispatch, isSignedIn, isFocused]);

  if (!isPremium){
    navigation.navigate(Routes.Subscription);
  }

  useEffect(() => {
    setFilteredProperties(favourtiteProperties.filter((x) => x.type === activePropertyTab && x.action === activeHeaderPropertyTab));
  }, [favourtiteProperties, activePropertyTab, activeHeaderPropertyTab]);

  const onRefresh = useCallback(() => {
    dispatch(getFavouriteProperties());
  }, [dispatch]);

  const onLikePress = (property: FavouriteProperty) => {
    unlikedFavourites.includes(property.id) ? dispatch(likeProperty(property.id)) : dispatch(unlikeProperty(property.id));
  };

  const renderEmptyResult = () => (
    <View style={styles.signInHeaderContainer}>
      <Image source={emptyFavourites} />
      <View style={styles.signInDescription}>
        <Text style={TextStyles.h2}>No saved favourites yet</Text>
        <Text style={[TextStyles.body1, styles.signUpLabelDesctiption]}>Save favourites by tapping the heart icon in the map or list</Text>
        <Text onPress={() => NavigationService.navigate(Routes.Search, { screen: Routes.Search })} style={[TextStyles.body1, styles.signUpLabelDesctiptionUnderline]}>Search for Listings</Text>
      </View>
    </View>
  );

  return (
    <>
      {isLoading && <Preloader />}
      <SafeAreaView style={styles.screen}>
        <Container style={styles.container}>
          <Text style={styles.title}>Favorite</Text>
          <View style={styles.propertyTypeTabContainer}>
            {PROPERTY_TYPE_HEADER.map((item) => {
              const activeTab = item.type === activeHeaderPropertyTab;
              return (
                <TouchableOpacity key={item.type} onPress={() => setHeaderActivePropertyTab(item.type)} style={styles.propertyHeaderTypeTabItem}>
                  <Text style={[activeTab ? styles.activePropertyTypeTabText : styles.inactivePropertyTypeTabText]}>{item.title}</Text>
                  <View style={activeTab ? styles.activePropertyTypeTabLine : styles.inactivePropertyTypeTabLine} />
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={styles.propertyTypeTabContainer}>
            {PropertyTypesOptions.map((item) => {
              const activeTab = item.type === activePropertyTab;
              return (
                <TouchableOpacity key={item.type} onPress={() => setActivePropertyTab(item.type)} style={styles.propertyTypeTabItem}>
                  <Text style={[activeTab ? styles.activePropertyTypeTabText : styles.inactivePropertyTypeTabText]}>{item.title}</Text>
                  <View style={activeTab ? styles.activePropertyTypeTabLine : styles.inactivePropertyTypeTabLine} />
                </TouchableOpacity>
              );
            })}
          </View>
          {!isSignedIn ? (
            <View style={styles.signInHeaderContainer}>
              <Image source={favouritesHome} />
              <View style={styles.signInDescription}>
                <Text style={TextStyles.h2}>Dear guest, please</Text>
                <Text style={[TextStyles.body1, styles.signUpLabelDesctiption]}>Sign in to sync up favourite properties at all your devices.</Text>
                <TouchableOpacity onPress={() => navigation.navigate(Routes.SignIn, { navigationParams: { screen: Routes.Favourite } })}>
                  <Text style={[TextStyles.body2, styles.signInButton]}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : filteredProperties?.length === 0 ? (
            renderEmptyResult()
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listWrap}
              refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
            >
              {filteredProperties?.map(
                (property) =>
                  property.type === activePropertyTab && (
                    <TouchableOpacity style={{width: '100%'}} key={property.id} onPress={() => navigation.navigate(Routes.PropertyDetails, { propertyId: property.id, userId: user.id })}>
                      <FavouritePropertyCard
                        key={property.id}
                        style={styles.card}
                        property={property}
                        onLikePress={onLikePress}
                        isUnliked={unlikedFavourites.includes(property.id)}
                        navigation={navigation}
                      />
                    </TouchableOpacity>
                  ),
              )}
            </ScrollView>
          )}
        </Container>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  container: {
    paddingTop: 16,
    paddingLeft: 0,
    paddingRight: 0,
    flex: 1,
  },
  title: {
    ...TextStyles.h3,
    textAlign: 'center',
    marginBottom: 4,
  },
  signInHeaderContainer: {
    alignItems: 'center',
  },
  signInDescription: {
    marginTop: 16,
    alignItems: 'center',
  },
  signUpLabelDesctiption: {
    marginTop: 12,
    textAlign: 'center',
  },
  signUpLabelDesctiptionUnderline: {
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  signInButton: {
    marginTop: 16,
    color: Colors.primaryBlue,
  },
  listWrap: {
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  card: {
    marginBottom: 37,
  },
  propertyTypeTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  propertyTypeTabItem: {
    width: '25%',
    alignItems: 'center',
  },
  propertyHeaderTypeTabItem: {
    width: '50%',
    alignItems: 'center',
  },
  activePropertyTypeTabText: {
    ...TextStyles.h6,
    fontWeight: '400',
    color: Colors.primaryBlack,
  },
  activePropertyTypeTabLine: {
    marginTop: 8,
    height: 4,
    width: '100%',
    backgroundColor: Colors.primaryBlack,
  },
  inactivePropertyTypeTabText: {
    ...TextStyles.h6,
    fontWeight: '400',
    fontFamily: 'Gilroy-Regular',
    color: Colors.defaultText,
  },
  inactivePropertyTypeTabLine: {
    marginTop: 8,
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(27, 30, 37, 0.1)',
  },
  h2: {
    textAlign: 'center',
  },
});

export default Favourite;
