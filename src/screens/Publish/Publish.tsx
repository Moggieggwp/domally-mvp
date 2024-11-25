import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Alert, Image, RefreshControl, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AddIcon from 'src/assets/img/icons/add-icon.svg';
import publishEmptyList from 'src/assets/img/icons/publishEmptyList.png';
import FilterIcon from 'src/assets/img/icons/filter-properties-icon.svg';
import noPropertiesFilter from 'src/assets/img/icons/noPropertiesFilter.png';
import PropertyOnMapIcon from 'src/assets/img/property-on-map.svg';
import { BottomSheet, Button, Container, Page, PropertyCard } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import * as Routes from 'src/constants/routes';
import { setOnboardingAction } from 'src/redux/actions/app';
import { deleteProperty, saveProperty, updateCurrentProperty } from 'src/redux/actions/currentProperty';
import { getUsersProperties, setPropertiesFilter } from 'src/redux/actions/usersProperties';
import { currentPropertyLoading } from 'src/redux/selectors/currentProperty';
import { isPremiumSelector, isSignedInSelector, profileDataSelector } from 'src/redux/selectors/profile';
import { loadingSelector, properties, propertiesFilterSelector } from 'src/redux/selectors/usersProperties';
import { TextStyles } from 'src/styles/BaseStyles';
import { fontRegular } from 'src/styles/Typography';
import { Property, PropertyStatus } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { getPropertyEditInitialStep, getSellPropertyRoute } from 'src/utils/stepperRoutes';
import BottomSheetContainer from 'reanimated-bottom-sheet';
import { useBackButtonListener } from 'src/helpers/hooks';

type Props = {
  navigation: BottomTabNavigationProp<RootStackParamsList>;
};

const Publish = (props: Props) => {
  const { navigation } = props;
  const [propertiesList, setPropertiesList] = useState<Property[]>(null);
  const [showPropertyMenuSheet, setShowPropertyMenuSheet] = useState(false);
  const [showPropertyFilterSheet, setShowPropertyFilterSheet] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [currentPropertyId, setCurrentPropertyId] = useState<number>(null);

  const isLoading = useSelector(loadingSelector);
  const isPropertyLoading = useSelector(currentPropertyLoading);
  const stateFilter = useSelector(propertiesFilterSelector);
  const filteredProperties = useSelector(properties);
  const isSignIn = useSelector(isSignedInSelector);
  const isPremium = useSelector(isPremiumSelector);
  const profileData = useSelector(profileDataSelector);
  const isFocused = useIsFocused();
  const backListener = useBackButtonListener();

  const dispatch = useDispatch();

  const sheetPropertyMenuRef = React.useRef<BottomSheetContainer>(null);
  const sheetFilterMenuRef = React.useRef<BottomSheetContainer>(null);

  const filterItems = PropertyStatus.AllPropertyStatuses;

  useEffect(() => {
    dispatch(setOnboardingAction(null));
  }, []);

  useEffect(() => {
    if (!isSignIn) return;
    if (isFocused) {
      setActiveFilter(stateFilter);
      dispatch(getUsersProperties(stateFilter));
    }
  }, [stateFilter, isFocused]);

  useEffect(() => {
    if (!isFocused || !isSignIn) return;
    if (!profileData?.firstName || !profileData.lastName || !profileData.email) {
      navigation.navigate(Routes.UserAbout);
    }
  }, [isFocused]);

  useEffect(() => {
    setPropertiesList(filteredProperties);
  }, [filteredProperties]);

  if (!isPremium) {
    navigation.navigate(Routes.Subscription);
  }

  const addNewPropertyHandler = () => {
    const route = isSignIn ? Routes.CreatePropertyGoal : Routes.SignIn;
    navigation.navigate(route);
  };

  const showOnMapHandler = () => {
    navigation.navigate(Routes.UsersPropertyOnMap);
  };

  const onEditPress = () => {
    setEditPropertyRoute(currentPropertyId);
    closePropertyMenu();
  };

  const onContinuePress = async (property: Property) => {
    setEditPropertyRoute(property.id);
  };

  const onMakeVisiblePress = async (property: Property) => {
    onUpdateStatusPress(PropertyStatus.PUBLISHED, property.id);
  };

  const onShowRejectReasonPress = (property: Property) => {
    if (!property.rejectReason) {
      return;
    }
    Alert.alert('This property is rejected', `${property.rejectReason}`);
  };

  const onPublishPress = async (property: Property) => {
    if (!property.id) return;

    await dispatch(
      saveProperty({
        id: property.id,
        status: PropertyStatus.PENDING,
      }),
    );

    dispatch(getUsersProperties(activeFilter));
  };

  const setEditPropertyRoute = (propertyId: number) => {
    const currentProperty = propertiesList.find((p) => p.id === propertyId);

    if (!currentProperty) return;

    dispatch(updateCurrentProperty(currentProperty));

    const route = getSellPropertyRoute(currentProperty.type);
    const initialStep = getPropertyEditInitialStep(currentProperty);
    setCurrentPropertyId(null);
    navigation.navigate(route, { initialStep: initialStep });
  };

  const openPropertyMenu = (propertyId: number) => {
    if (!propertyId) return;

    setCurrentPropertyId(propertyId);

    setShowPropertyMenuSheet(true);
    sheetPropertyMenuRef.current.snapTo(0);
  };

  const closePropertyMenu = () => {
    setShowPropertyMenuSheet(false);

    sheetPropertyMenuRef.current.snapTo(1);

    setCurrentPropertyId(null);
  };

  const openPropertyFilter = () => {
    setShowPropertyFilterSheet(true);
    sheetFilterMenuRef.current.snapTo(0);
  };

  const closePropertyFilter = () => {
    setShowPropertyFilterSheet(false);
    sheetFilterMenuRef.current.snapTo(1);
  };

  const onRefresh = () => {
    if (!isSignIn) return;
    dispatch(getUsersProperties(activeFilter));
  };

  const onPropertyDelete = () => {
    Alert.alert('Do you really want to delete property?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: deletePropertyById,
        style: 'destructive',
      },
    ]);
  };

  const deletePropertyById = async () => {
    if (!currentPropertyId) return;

    await dispatch(deleteProperty(currentPropertyId));
    closePropertyMenu();
    await dispatch(getUsersProperties());
  };

  const getSubmitMethodByStatus = (property: Property) => {
    const { status } = property;
    switch (status) {
      case PropertyStatus.NOT_PUBLISHED:
        return onPublishPress;
      case PropertyStatus.NOT_COMPLETED:
        return onContinuePress;
      case PropertyStatus.REJECTED:
        return onShowRejectReasonPress;
      case PropertyStatus.INVISIBLE:
      case PropertyStatus.ARCHIVED:
        return onMakeVisiblePress;
      default:
        return null;
    }
  };

  const getNoFoundFilterTitle = (status: PropertyStatus) => {
    return `Your list of "${status}" properties is empty now`;
  };

  const onFilterStatusPress = (status: PropertyStatus) => {
    dispatch(setPropertiesFilter(status));
    closePropertyFilter();
  };

  const onUpdateStatusPress = async (status: PropertyStatus, propertyId: number) => {
    if (!propertyId || !status) return;

    closePropertyMenu();
    await dispatch(
      saveProperty({
        id: propertyId,
        status: status,
      }),
    );

    dispatch(getUsersProperties(activeFilter));
  };

  const setAllFilter = async () => {
    dispatch(setPropertiesFilter(null));
    closePropertyFilter();
  };

  const handleCardPress = (property: Property) => {
    if (property?.status === PropertyStatus.NOT_COMPLETED) return;
    navigation.navigate(Routes.PropertyDetails, { propertyId: property.id });
  };

  const renderPropertyMenu = (): ReactNode => {
    const property = propertiesList?.find((p) => p.id === currentPropertyId);
    const isArchiveEnabled = property?.status === PropertyStatus.PUBLISHED || property?.status === PropertyStatus.INVISIBLE;
    const isInvisibleEnabled = property?.status === PropertyStatus.PUBLISHED;
    const isVisibleEnabled = property?.status === PropertyStatus.INVISIBLE || property?.status === PropertyStatus.ARCHIVED;

    return (
      <>
        <Text onPress={onEditPress} style={[styles.sheetItem, styles.sheetItemBlue]}>
          Edit
        </Text>
        {isVisibleEnabled && (
          <Text onPress={() => onUpdateStatusPress(PropertyStatus.PUBLISHED, property.id)} style={[styles.sheetItem, styles.sheetItemBlue]}>
            Make Visible
          </Text>
        )}
        {!isVisibleEnabled && (
          <Text
            onPress={() => isInvisibleEnabled && onUpdateStatusPress(PropertyStatus.INVISIBLE, property.id)}
            style={[styles.sheetItem, styles.sheetItemBlue, !isInvisibleEnabled && styles.sheetItemDisabled]}
          >
            Make Invisible
          </Text>
        )}
        <Text
          onPress={() => isArchiveEnabled && onUpdateStatusPress(PropertyStatus.ARCHIVED, property.id)}
          style={[styles.sheetItem, styles.sheetItemBlue, !isArchiveEnabled && styles.sheetItemDisabled]}
        >
          Archive
        </Text>
        <Text onPress={onPropertyDelete} style={[styles.sheetItem, styles.sheetDelete]}>
          Delete
        </Text>
        <View style={styles.sheetDivider} />
        <Text onPress={closePropertyMenu} style={[styles.sheetItem, styles.sheetCancel]}>
          Cancel
        </Text>
      </>
    );
  };

  const renderFilterOptions = (): ReactNode => {
    return (
      <>
        <Text onPress={setAllFilter} style={[styles.sheetItem, { color: !activeFilter ? Colors.primaryBlue : Colors.defaultText }]}>
          All
        </Text>
        {filterItems.map((status) => {
          const isActive = status === activeFilter;
          return (
            <Text key={status} onPress={() => onFilterStatusPress(status)} style={[styles.sheetItem, { color: isActive ? Colors.primaryBlue : Colors.defaultText }]}>
              {status}
            </Text>
          );
        })}
      </>
    );
  };

  const renderPlaceholder = () => {
    return (
      <Container style={styles.placeholderWrap}>
        <View style={styles.emptyListHeaderContainer}>
          <Text style={[TextStyles.h2, styles.placeholderTitle]}>Rent and sell your property with ease</Text>
          <Image source={publishEmptyList} style={{ marginTop: 20 }} />
        </View>

        <Button onPress={addNewPropertyHandler} style={styles.addBtn} isGhost>
          <AddIcon width={18} height={18} />
          <Text style={[TextStyles.textBtn, styles.addBtnTitle]}>Add new property</Text>
        </Button>
      </Container>
    );
  };

  const isShowOnMapDisabled = !propertiesList?.length || activeFilter === PropertyStatus.NOT_COMPLETED;

  return (
    <Page isLoading={isLoading || isPropertyLoading} keyboardAvoidingEnabled={false} style={styles.container}>
      {!propertiesList || (propertiesList?.length === 0 && !activeFilter) ? (
        renderPlaceholder()
      ) : (
        <>
          <View style={styles.header}>
            <Text style={[TextStyles.h3, styles.headerTitle]}>My properties</Text>
            <TouchableOpacity style={styles.headerFilterBtn} onPress={openPropertyFilter}>
              <FilterIcon style={styles.headerIcon} />
            </TouchableOpacity>
            <TouchableOpacity disabled={isShowOnMapDisabled} style={styles.headerIconBtn} onPress={showOnMapHandler}>
              <PropertyOnMapIcon style={[styles.headerIcon, { opacity: isShowOnMapDisabled ? 0.5 : 1 }]} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.listWrap} refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>
            {propertiesList?.length ? (
              propertiesList.map((property) => {
                const onBtnPress = getSubmitMethodByStatus(property);
                return (
                  <TouchableOpacity
                    activeOpacity={property?.status === PropertyStatus.NOT_COMPLETED ? 1 : 0.8}
                    style={styles.publishCard}
                    key={property.id}
                    onPress={() => handleCardPress(property)}
                  >
                    <PropertyCard
                      key={property.id}
                      style={styles.card}
                      property={property}
                      onMenuPress={() => openPropertyMenu(property.id)}
                      onSubmitPress={() => {
                        onBtnPress(property);
                      }}
                    />
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyListHeaderContainer}>
                <Image source={publishEmptyList} style={styles.notFoundFilterPropertiesLogo} />
                <Text style={styles.noResult}>{getNoFoundFilterTitle(activeFilter)}</Text>
              </View>
            )}
          </ScrollView>
          <Button onPress={() => addNewPropertyHandler()} style={styles.addBtnInList} isGhost>
            <AddIcon width={18} height={18} />
            <Text style={[TextStyles.textBtn, styles.addBtnTitle]}>Add new property</Text>
          </Button>
        </>
      )}
      <BottomSheet
        sheetRef={sheetPropertyMenuRef}
        onClose={closePropertyMenu}
        onOutsidePress={closePropertyMenu}
        isActive={showPropertyMenuSheet}
        snapPoints={[279, 0]}
        containerStyle={styles.bottomSheetContainer}
        childrenContainerStyle={styles.bottomSheetContainerChildrenContainerStyle}
        dividerStyle={styles.hidden}
        showBg
      >
        {renderPropertyMenu()}
      </BottomSheet>

      <BottomSheet
        sheetRef={sheetFilterMenuRef}
        onClose={closePropertyFilter}
        onOutsidePress={closePropertyFilter}
        isActive={showPropertyFilterSheet}
        snapPoints={[363, 0]}
        containerStyle={[styles.bottomSheetContainer, styles.bottomSheetContainerPadding]}
        childrenContainerStyle={[styles.bottomSheetContainerChildrenContainerStyle]}
        dividerStyle={styles.hidden}
        showBg
      >
        {renderFilterOptions()}
      </BottomSheet>
    </Page>
  );
};

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
  container: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    marginTop: 120,
    marginBottom: 30,
  },
  card: {
    marginBottom: 37,
  },
  listWrap: {
    width: '100%',
    marginTop: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  placeholderWrap: {
    paddingTop: Layout.isMediumDevice ? Layout.getViewHeight(8) : Layout.getViewHeight(10),
    flex: 1,
  },
  placeholderTitle: {
    marginTop: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  placeholderDesc: {
    textAlign: 'center',
  },
  addBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignSelf: 'center',
    width: 'auto',
    position: 'absolute',
    bottom: 48,
  },
  addBtnInList: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: 'auto',
  },
  addBtnTitle: {
    color: Colors.primaryBlue,
    marginLeft: 9,
  },
  header: {
    height: Platform.OS === 'ios' ? Layout.getViewHeight(12.8) : Layout.getViewHeight(9.34),
    backgroundColor: Colors.white,
    justifyContent: 'flex-end',
    zIndex: 1,
    paddingBottom: 30,
  },
  headerTitle: {
    textAlign: 'center',
  },
  headerIconBtn: {
    width: 40,
    height: 35,
    position: 'absolute',
    right: 21,
    top: Platform.OS === 'ios' ? Layout.getViewHeight(12.8) / 2 : Layout.getViewHeight(9.34) / 4,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  headerFilterBtn: {
    width: 50,
    height: 35,
    position: 'absolute',
    right: 62,
    top: Platform.OS === 'ios' ? Layout.getViewHeight(12.8) / 2 : Layout.getViewHeight(9.34) / 4,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  shadowContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black,
  },
  shadow: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
    elevation: 40,
    zIndex: -1,
  },
  bottomSheetContainer: {
    backgroundColor: Colors.white,
    paddingTop: 0,
    marginTop: 0,
    height: 'auto',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  bottomSheetContainerPadding: {
    paddingBottom: 6,
  },
  bottomSheetContainerChildrenContainerStyle: {
    paddingTop: 6,
  },
  sheetDivider: {
    marginTop: 10,
    marginBottom: 14,
    backgroundColor: Colors.gray,
    borderRadius: 100,
    width: '100%',
    height: 1,
  },
  sheetItem: {
    ...TextStyles.h5,
    fontFamily: fontRegular,
    paddingTop: 10,
    paddingBottom: 10,
    width: '100%',
    textAlign: 'center',
  },
  sheetItemDisabled: {
    opacity: 0.5,
  },
  sheetItemBlue: {
    color: Colors.primaryBlue,
  },
  sheetCancel: {
    color: Colors.darkGray,
    marginBottom: 29,
  },
  sheetDelete: {
    color: Colors.red,
  },
  noResult: {
    ...TextStyles.h2,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  emptyListHeaderContainer: {
    alignItems: 'center',
  },
  notFoundFilterPropertiesLogo: {
    height: 300,
    width: 300,
  },
  publishCard: {
    flex: 1,
    width: '100%',
  },
});

export default Publish;
