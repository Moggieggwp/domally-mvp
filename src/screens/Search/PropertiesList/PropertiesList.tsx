import { useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, RefreshControl, SafeAreaView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import emptyPropertyList from 'src/assets/img/icons/emptyPropertyList.png';
import ListIcon from 'src/assets/img/icons/list-icon.svg';
import { CircleButton, Preloader, SearchInput } from 'src/components';
import Colors from 'src/constants/colors';
import * as Routes from 'src/constants/routes';
import { likeProperty, unlikeProperty } from 'src/redux/actions/favourites';
import { updateSearchData } from 'src/redux/actions/search';
import { isPremiumSelector, isSignedInSelector, profileDataSelector } from 'src/redux/selectors/profile';
import { searchGraphicFilter, searchLoadingSelector, searchLocation, searchResultCountSelector, searchResultSelector } from 'src/redux/selectors/search';
import { TextStyles } from 'src/styles/BaseStyles';
import { PolygonSearchType, Property, SearchType } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import PropertyListCard from './components/PropertyListCard';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'PropertiesList'>;
};

const PropertiesList = (props: Props) => {
  const { navigation } = props;
  const [locationValue, setLocationValue] = useState('');
  const dispatch = useDispatch();
  const properties = useSelector(searchResultSelector);
  const propertiesCount = useSelector(searchResultCountSelector);
  const stateSearchLocation = useSelector(searchLocation);
  const isLoading = useSelector(searchLoadingSelector);
  const user = useSelector(profileDataSelector);
  const isSignedIn = useSelector(isSignedInSelector);
  const stateGraphFilter = useSelector(searchGraphicFilter);
  const isPremium = useSelector(isPremiumSelector);

  const hasPolygon = stateGraphFilter?.polygon?.coordinates?.length > 0;
  const hasCustomPolygon = hasPolygon && stateGraphFilter?.polygonSearchType === PolygonSearchType.CUSTOM;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;
    dispatch(updateSearchData({ searchType: SearchType.LIST }));
  }, [isFocused]);

  const onRefresh = useCallback(() => {}, []);

  useEffect(() => {
    if (stateSearchLocation?.city) {
      setLocationValue(stateSearchLocation.city);
    }
  }, [stateSearchLocation]);

  const backToTheMapHandler = () => {
    dispatch(updateSearchData({ searchType: SearchType.MAP }));
    navigation.navigate(Routes.Search);
  };

  const navigateToChooseLocation = () => {
    navigation.navigate(Routes.ChooseLocation, {
      isSingleSearchMode: true,
      onBack: () => {
        navigation.navigate(Routes.PropertiesList);
      },
      onSubmit: () => {
        navigation.navigate(Routes.PropertiesList);
      },
    });
  };

  const handleLocationChange = () => {
    if (hasCustomPolygon) {
      handlePolygonRemoveAlert(async () => {
        await dispatch(updateSearchData({ filter: undefined }, false));
        navigateToChooseLocation();
      });
    } else {
      navigateToChooseLocation();
    }
  };

  const handlePolygonRemoveAlert = (cb: () => void) => {
    Alert.alert('Warning', 'Geographic filters will be reset if you proceed.', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Continue',
        onPress: cb,
        style: 'destructive',
      },
    ]);
  };

  const handleLike = (property: Property) => {
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
    } else {
      navigation.navigate(Routes.SignIn, { navigationParams: { screen: Routes.Search, params: { screen: Routes.PropertiesList } } });
    }
  };

  return (
    <>
      {isLoading && <Preloader />}
      <SafeAreaView style={styles.screen}>
        <View style={styles.contentContainer}>
          <View style={styles.inputsWrap}>
            <View style={styles.searchInputWrap}>
              <SearchInput
                styleWrap={styles.searchInput}
                onChange={(v) => {}}
                onFilterPress={() => navigation.navigate(Routes.SearchFilter)}
                placeholder='City'
                disabled
                value={locationValue || ''}
              />
              <TouchableOpacity onPress={handleLocationChange} activeOpacity={0.8} style={styles.inputBtn} />
            </View>
            <View>
              <CircleButton onPress={backToTheMapHandler} icon={ListIcon} styleBtn={styles.listBtn} />
              <View style={styles.listBtnBadge}>
                <Text style={styles.listBtnBadgeText}>{propertiesCount || 0}</Text>
              </View>
            </View>
          </View>
          {properties?.length > 0 ? (
            <ScrollView
              style={{ marginTop: 16 }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listWrap}
              refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}
            >
              {properties.map((property) => (
                <TouchableOpacity key={property.id} onPress={() => navigation.navigate(Routes.PropertyDetails, { propertyId: property.id })}>
                  <PropertyListCard
                    key={property.id}
                    style={styles.card}
                    property={property}
                    isLiked={property.hasLike}
                    isSignedIn={isSignedIn}
                    isPremium={isPremium}
                    onLikePress={handleLike}
                    navigation={navigation}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyListHeaderContainer}>
              <Image source={emptyPropertyList} />
              <View style={styles.emptyListDescription}>
                <Text style={[TextStyles.h2, styles.emptyListMainLabelDesctiption]}>No results found for this search</Text>
                <Text style={[TextStyles.body1, styles.emptyListLabelDesctiption]}>Try broadeining the area for this search or changing area for this search filter</Text>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  emptyListHeaderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyListDescription: {
    marginTop: 20,
    alignItems: 'center',
  },
  emptyListMainLabelDesctiption: {
    textAlign: 'center',
  },
  emptyListLabelDesctiption: {
    marginTop: 12,
    textAlign: 'center',
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

  contentContainer: {
    width: '100%',
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
  },
  inputsWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  listBtn: {
    width: 46,
    height: 46,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 10,
    shadowColor: 'rgba(67, 137, 235, 0.1)',
    shadowOpacity: 1,
    borderRadius: 10,
  },
  listBtnBadge: {
    position: 'absolute',
    backgroundColor: Colors.secondaryGreen,
    top: -5,
    alignSelf: 'center',
    paddingHorizontal: 3,
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowRadius: 10,
    shadowColor: 'rgba(61, 82, 136, 0.2)',
    shadowOpacity: 1,
    borderRadius: 9,
  },
  listBtnBadgeText: {
    ...TextStyles.smallBody,
    color: Colors.white,
    fontWeight: '500',
  },
  searchInputWrap: {
    width: '83%',
    height: 46,
  },
  searchInput: {
    width: '100%',
  },
  inputBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '80%',
    height: '100%',
  },
});

export default PropertiesList;
