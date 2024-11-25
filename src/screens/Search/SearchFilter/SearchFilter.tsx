import { StackNavigationProp } from '@react-navigation/stack';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheetContainer from 'reanimated-bottom-sheet';
import ArrowBottom from 'src/assets/img/icons/arrow-bottom.svg';
import drowIcon from 'src/assets/img/icons/drowIcon.png';
import locationIcon from 'src/assets/img/icons/locationIcon.png';
import { BottomSheet, CurrencyToggle, Header, Preloader, RangeSlider, SquareToggle } from 'src/components';
import Checkbox from 'src/components/CheckBox';
import Counter from 'src/components/Counter';
import Colors from 'src/constants/colors/Colors';
import Layout from 'src/constants/Layout';
import { CURRENCY_BUTTONS, SQUARE_BUTTONS } from 'src/constants/MeasureButtons';
import {
  commercialNumberOfUnits,
  COMMERCIAL_SEARCH_OPTIONS,
  CounterStringValues,
  residentialNumberOfBathrooms,
  residentialNumberOfBedrooms,
  residentialNumberOfFloors,
  residentialNumberOfSpots,
  RESIDENTIAL_SEARCH_OPTIONS,
} from 'src/constants/propertyDetails';
import * as Routes from 'src/constants/routes';
import { OPTIONS as CommercialTypeOptions } from 'src/constants/search/CommercialTypeOptions';
import { OPTIONS as IndustrialTypeOptions } from 'src/constants/search/IndustrialTypeOptions';
import { OPTIONS as LandTypeOptions } from 'src/constants/search/LandTypeOptions';
import { OPTIONS as PropertyTypesOptions } from 'src/constants/search/PropertyTypesOptions';
import { OPTIONS as ResidentialTypesOptions } from 'src/constants/search/ResidentialTypesOptions';
import useDidUpdateEffect from 'src/helpers/hooks';
import { moneyFormatter } from 'src/helpers/moneyFormatter';
import { setAppMetrics } from 'src/redux/actions/app';
import { clearSearchRange, partialSearchClear, updateSearchData, updateSearchFilter } from 'src/redux/actions/search';
import { metricsSelector } from 'src/redux/selectors/app';
import { searchGraphicFilter, searchLoadingSelector, searchResultCountSelector, searchResultRanges, searchSelector } from 'src/redux/selectors/search';
import * as NavigationService from 'src/services/NavigationService';
import { TextStyles } from 'src/styles/BaseStyles';
import {
  Action,
  BottomSheetAdditionOptions,
  CommercialAddition,
  CommercialAdditions,
  MeasureCurrency,
  MeasureSquare,
  NumberOfBathrooms,
  NumberOfBedrooms,
  NumberOfFloors,
  NumberOfSpots,
  NumberOfUnits,
  PolygonSearchType,
  PropertyDetailedType,
  PropertyType,
  RangeValue,
  ResidentialAdditions,
  SearchType,
} from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { getSliderRangeMax } from 'src/utils/rangeHelper';

const RoleOptions = ['Rent', 'Buy'];

type RangeValueDefault = {
  min: number;
  max: number;
};

const DEFAULT_PRICE_RANGE: RangeValueDefault = {
  min: 1,
  max: 10000000,
};

const DEFAULT_SQUARE_RANGE: RangeValueDefault = {
  min: 1,
  max: 500000,
};

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'SearchFilter'>;
};

const SearchFilter = (props: Props) => {
  const { navigation } = props;

  const dispatch = useDispatch();
  const search = useSelector(searchSelector);
  const searchResultCount = useSelector(searchResultCountSelector);
  const loading = useSelector(searchLoadingSelector);
  const stateRanges = useSelector(searchResultRanges);
  const stateMetrics = useSelector(metricsSelector);
  const stateGraphFilter = useSelector(searchGraphicFilter);

  const hasPolygon = stateGraphFilter?.polygon?.coordinates?.length > 0;
  const hasCustomPolygon = hasPolygon && stateGraphFilter?.polygonSearchType === PolygonSearchType.CUSTOM;

  const searchData = search.searchData;
  const searchFilter = searchData.query;
  const residentialData = searchFilter.residentialData;
  const commercialData = searchFilter.commercialData;
  const residentialAdditions = { ...searchFilter.residentialData?.residentialAdditions };
  const commercialAdditions = { ...searchFilter.commercialData?.commercialAdditions };

  const propertyTypeTab = searchFilter.type || 'Residential';
  const propertyRoleTab = searchFilter.action && RoleOptions.includes(searchFilter.action) ? searchFilter.action : ('Rent' as Action);

  const location = searchFilter.location?.city || '';
  const currency = stateMetrics?.currency;
  const square = stateMetrics?.square;

  const [priceRangeLocal, setPriceRangeLocal] = useState<RangeValueDefault>({ min: DEFAULT_PRICE_RANGE.min, max: DEFAULT_PRICE_RANGE.max });
  const [squareRangeLocal, setSquareRangeLocal] = useState<RangeValueDefault>({ min: DEFAULT_SQUARE_RANGE.min, max: DEFAULT_SQUARE_RANGE.max });
  const [priceRange, setPriceRange] = useState<RangeValue>(null);
  const [squareRange, setSquareRange] = useState<RangeValue>(null);
  const [isRangeSwiping, setRangeSwiping] = useState(false);

  const checkedPropertyTypeItems = searchFilter.detailedType || [];

  const additionsBottomSheetRef = useRef<BottomSheetContainer>(null);
  const [activeAddition, setActiveAddition] = useState<ResidentialAdditions | CommercialAddition>(null);
  const [additionsBottomSheetIsActive, setAdditionsBottomSheetIsActive] = useState(false);
  const additionsSnapPoints = [271, 0];
  const bottomSheetAdditionOptions: BottomSheetAdditionOptions = [
    {
      title: 'Any',
      value: undefined,
    },
    {
      title: `${activeAddition} only`,
      value: true,
    },
    {
      title: `No ${activeAddition}`,
      value: false,
    },
  ];

  const showAdditionsBottomSheet = (addition: ResidentialAdditions | CommercialAddition) => {
    setAdditionsBottomSheetIsActive(true);
    setActiveAddition(addition);
    additionsBottomSheetRef.current.snapTo(0);
  };

  const hideAdditionsBottomSheet = () => {
    setAdditionsBottomSheetIsActive(false);
    setActiveAddition(null);
    additionsBottomSheetRef.current.snapTo(1);
  };

  const debouncedSearch = debounce(() => doSearch(), 1000);
  const debouncedSearchWithoutRangeUpdate = useCallback(
    debounce(() => doSearchWithoutRangeUpdate(), 1000),
    [],
  );

  useDidUpdateEffect(() => {
    debouncedSearch();
  }, [
    searchFilter.action,
    searchFilter.commercialData?.commercialUnits,
    searchFilter.commercialData?.numberOfCommercialUnits,
    searchFilter.commercialData?.commercialResidentialUnits,
    searchFilter.commercialData?.commercialAdditions,
    searchFilter.detailedType,
    searchFilter.industrialData,
    searchFilter.landData,
    searchFilter.location,
    searchFilter.residentialData?.residentialAdditions,
    searchFilter.residentialData?.numberOfSpots,
    searchFilter.residentialData?.residentialNumberOfBathrooms,
    searchFilter.residentialData?.residentialNumberOfBedrooms,
    searchFilter.residentialData?.residentialNumberOfFloors,
    searchFilter.type,
  ]);

  useDidUpdateEffect(() => {
    debouncedSearchWithoutRangeUpdate();
  }, [searchFilter.price?.range, searchFilter.size?.range]);

  useEffect(() => {
    dispatch(
      updateSearchFilter(
        {
          action: (RoleOptions.includes(searchFilter.action) && searchFilter.action) || undefined,
          type: searchFilter.type || 'Residential',
        },
        false,
      ),
    );
  }, []);

  useEffect(() => {
    setSquareRangeLocal({
      min: parseFloat(stateRanges?.minSize) || DEFAULT_SQUARE_RANGE.min,
      max: parseFloat(stateRanges?.maxSize) || DEFAULT_SQUARE_RANGE.max,
    });

    setPriceRangeLocal({
      min: parseFloat(stateRanges?.minPrice) || DEFAULT_PRICE_RANGE.min,
      max: parseFloat(stateRanges?.maxPrice) || DEFAULT_PRICE_RANGE.max,
    });
  }, [stateRanges]);

  useDidUpdateEffect(() => {
    if (!stateMetrics) return;
    dispatch(
      updateSearchFilter(
        {
          price: {
            measure: stateMetrics.currency,
            range: searchFilter?.price?.range,
          },
          size: {
            range: searchFilter?.size?.range,
            measure: stateMetrics.square,
          },
        },
        false,
      ),
    );

    debouncedSearch();
  }, [stateMetrics]);

  const doSearch = async () => {
    await dispatch(clearSearchRange());

    await dispatch(
      updateSearchData({
        currency: currency as MeasureCurrency,
        square: square as MeasureSquare,
        searchType: SearchType.COUNT,
      }),
    );
  };

  const doSearchWithoutRangeUpdate = async () => {
    await dispatch(
      updateSearchData({
        currency: undefined,
        square: undefined,
        searchType: SearchType.COUNT,
      }),
    );
  };

  const handleSelectPropertyTypesCheckbox = (item: PropertyDetailedType) => {
    const isItemChecked = checkedPropertyTypeItems.find((x) => x === item);
    if (!!isItemChecked) {
      let newCheckedItems = checkedPropertyTypeItems.filter((x) => x !== item);
      newCheckedItems = newCheckedItems.length === 0 ? undefined : newCheckedItems;
      dispatch(updateSearchFilter({ detailedType: newCheckedItems }, false));
    } else {
      const newCheckedItems = [...checkedPropertyTypeItems, item];
      dispatch(updateSearchFilter({ detailedType: newCheckedItems }, false));
    }
  };

  const handleSelectAddition = (item: ResidentialAdditions | CommercialAdditions, enabled: boolean) => {
    if (searchFilter.type === 'Residential') {
      residentialAdditions[item] = enabled;
      dispatch(updateSearchFilter({ residentialData: { ...residentialData, residentialAdditions: residentialAdditions } }, false));
    }
    if (searchFilter.type === 'Commercial') {
      commercialAdditions[item] = enabled;
      dispatch(updateSearchFilter({ commercialData: { ...commercialData, commercialAdditions: commercialAdditions } }, false));
    }

    hideAdditionsBottomSheet();
  };

  const handleSelectAllPress = () => {
    dispatch(updateSearchFilter({ detailedType: getPropertyTypes().map((x) => x.type) }, false));
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

  const navigateToChooseLocation = () => {
    navigation.navigate(Routes.ChooseLocation, {
      isSingleSearchMode: true,
      onBack: () => {
        navigation.navigate(Routes.SearchFilter);
      },
      onSubmit: () => {
        navigation.navigate(Routes.SearchFilter);
      },
    });
  };

  const getPropertyTypes = () => {
    switch (propertyTypeTab) {
      case 'Residential':
        return ResidentialTypesOptions;
      case 'Commercial':
        return CommercialTypeOptions;
      case 'Industrial':
        return IndustrialTypeOptions;
      case 'Land':
        return LandTypeOptions;
      default:
        return [];
    }
  };

  const renderPropertyDetails = () => {
    switch (propertyTypeTab) {
      case 'Residential':
        return renderResidentialPropertyDetails();
      case 'Commercial':
        return renderCommercialPropertyDetails();
      default:
        return null;
    }
  };

  const isSquareRangeDefault = squareRangeLocal?.min === DEFAULT_SQUARE_RANGE.min && squareRangeLocal?.max === DEFAULT_SQUARE_RANGE.max;
  const isPriceRangeDefault = priceRangeLocal?.min === DEFAULT_PRICE_RANGE.min && priceRangeLocal?.max === DEFAULT_PRICE_RANGE.max;
  const isPriceSliderDisabled = priceRangeLocal?.min === priceRangeLocal?.max || isPriceRangeDefault;
  const isSquareSliderDisabled = squareRangeLocal?.min === squareRangeLocal?.max || isSquareRangeDefault;

  const getPriceTitle = (range: RangeValue, measure: string) => {
    const activeMetricSymbol = CURRENCY_BUTTONS.find((x) => x.measure === measure)?.symbol;

    if (isPriceRangeDefault) {
      return 'Any';
    }

    if (range?.lowest && range?.highest) {
      return `from ${activeMetricSymbol}${moneyFormatter(range?.lowest, 3)} to ${activeMetricSymbol}${moneyFormatter(range?.highest, 3)}`;
    }
  };

  const getSquareTitle = (range: RangeValue, measure: string) => {
    const activeMetric = SQUARE_BUTTONS.find((x) => x.measure === measure)?.symbol;

    if (isSquareRangeDefault) {
      return <Text style={styles.anyText}>Any</Text>;
    }

    if (range?.lowest && range?.highest) {
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          <Text style={styles.anyText}>{`from ${Math.round(range?.lowest)} ${activeMetric}`}</Text>
          <Text style={[styles.anyText, { fontSize: 12, lineHeight: 18 }]}>2</Text>
          <Text style={styles.anyText}>{` to ${Math.round(range?.highest)} ${activeMetric}`}</Text>
          <Text style={[styles.anyText, { fontSize: 12, lineHeight: 18 }]}>2</Text>
        </View>
      );
    }
  };

  const onPriceRangeFinished = (range: RangeValue) => {
    dispatch(
      updateSearchFilter(
        {
          price: {
            measure: currency,
            range: range,
          },
        },
        false,
      ),
    );
  };

  const onSizeRangeFinished = (range: RangeValue) => {
    dispatch(
      updateSearchFilter(
        {
          size: {
            measure: square,
            range: range,
          },
        },
        false,
      ),
    );
  };

  const clearFilters = async () => {
    setPriceRangeLocal({ min: DEFAULT_PRICE_RANGE.min, max: DEFAULT_PRICE_RANGE.max });
    setSquareRangeLocal({ min: DEFAULT_SQUARE_RANGE.min, max: DEFAULT_SQUARE_RANGE.max });

    await dispatch(
      partialSearchClear({
        action: searchFilter.action,
        location: searchFilter.location,
        type: searchFilter.type,
      }),
    );
  };

  const handleClearFilters = async () => {
    await clearFilters();
    await doSearch();
  };

  const handlePropertyTypeChange = async (type: PropertyType) => {
    if (searchFilter?.type === type) return;

    await clearFilters();
    dispatch(updateSearchFilter({ type: type }, false));
  };

  const handleActionChange = async (action: Action) => {
    if (searchFilter?.action === action) return;

    dispatch(updateSearchFilter({ action: action }, false));
  };

  const handleSquareToggle = async (value: MeasureSquare) => {
    await dispatch(
      setAppMetrics({
        square: value,
      }),
    );
  };

  const handleCurrencyToggle = async (value: MeasureCurrency) => {
    await dispatch(
      setAppMetrics({
        currency: value,
      }),
    );
  };

  const selectedOption = (item: ResidentialAdditions | CommercialAdditions) => {
    const additions = propertyTypeTab === 'Residential' ? residentialAdditions : commercialAdditions;
    const addition = additions?.[item];
    if (additions && addition !== undefined) {
      return addition ? `${item} only` : `No ${item}`;
    }

    return 'Any';
  };

  const renderResidentialPropertyDetails = () => {
    const initialBedrooms = residentialData?.residentialNumberOfBedrooms || CounterStringValues.Any;
    const initialBathrooms = residentialData?.residentialNumberOfBathrooms || CounterStringValues.Any;
    const initialFloors = residentialData?.residentialNumberOfFloors || CounterStringValues.Any;
    const initialSpots = residentialData?.numberOfSpots || CounterStringValues.Any;

    return (
      <View style={styles.propertyDetailsContainer}>
        <Text style={styles.budgetText}>Property Details</Text>
        <View style={styles.propertyDetailsWrap}>
          <Counter
            onChange={(value: NumberOfBedrooms) => dispatch(updateSearchFilter({ residentialData: { ...residentialData, residentialNumberOfBedrooms: value } }, false))}
            style={styles.counter}
            title={'Number of bedrooms'}
            initialValue={initialBedrooms}
            allowableValues={residentialNumberOfBedrooms}
          />
          <Counter
            onChange={(value: NumberOfBathrooms) => dispatch(updateSearchFilter({ residentialData: { ...residentialData, residentialNumberOfBathrooms: value } }, false))}
            style={styles.counter}
            title={'Number of bathrooms'}
            initialValue={initialBathrooms}
            allowableValues={residentialNumberOfBathrooms}
          />
          <Counter
            onChange={(value: NumberOfFloors) => dispatch(updateSearchFilter({ residentialData: { ...residentialData, residentialNumberOfFloors: value } }, false))}
            style={styles.counter}
            title={'Number of floors'}
            initialValue={initialFloors}
            allowableValues={residentialNumberOfFloors}
          />
          <Counter
            onChange={(value: NumberOfSpots) => dispatch(updateSearchFilter({ residentialData: { ...residentialData, numberOfSpots: value } }, false))}
            style={styles.counter}
            title={'Parking spots'}
            initialValue={initialSpots}
            allowableValues={residentialNumberOfSpots}
          />
        </View>
        <View>
          {Object.keys(RESIDENTIAL_SEARCH_OPTIONS).map((item: ResidentialAdditions) => {
            const isActive = additionsBottomSheetIsActive && item === activeAddition;

            return (
              <TouchableOpacity key={item} onPress={() => showAdditionsBottomSheet(item)} style={styles.additionOptionButton}>
                <>
                  <Text style={styles.additionTitle}>{item}</Text>
                  <View style={styles.selectedAddition}>
                    <Text style={styles.selectedAdditionText}>{selectedOption(item)}</Text>
                    <ArrowBottom width={16} height={16} style={{ transform: [{ scaleY: isActive ? -1 : 1 }] }} />
                  </View>
                </>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderCommercialPropertyDetails = () => {
    const initialCommercialUnits = commercialData?.commercialUnits || CounterStringValues.Any;
    const initialNumberOfCommercialUnits = commercialData?.numberOfCommercialUnits || CounterStringValues.Any;
    const initialCommercialResidentialUnits = commercialData?.commercialResidentialUnits || CounterStringValues.Any;

    return (
      <View style={styles.propertyDetailsContainer}>
        <Text style={styles.budgetText}>Property Details</Text>
        <View style={styles.propertyDetailsWrap}>
          <Counter
            onChange={(value: NumberOfUnits) => dispatch(updateSearchFilter({ commercialData: { ...commercialData, commercialUnits: value } }, false))}
            style={styles.counter}
            title={'Number of units'}
            initialValue={initialCommercialUnits}
            allowableValues={commercialNumberOfUnits}
          />
          <Counter
            onChange={(value: NumberOfUnits) => dispatch(updateSearchFilter({ commercialData: { ...commercialData, numberOfCommercialUnits: value } }, false))}
            style={styles.counter}
            title={'Number of commercial units'}
            initialValue={initialNumberOfCommercialUnits}
            allowableValues={commercialNumberOfUnits}
          />
          <Counter
            onChange={(value: NumberOfUnits) => dispatch(updateSearchFilter({ commercialData: { ...commercialData, commercialResidentialUnits: value } }, false))}
            style={styles.counter}
            title={'Number of residental units'}
            initialValue={initialCommercialResidentialUnits}
            allowableValues={commercialNumberOfUnits}
          />
        </View>
        <View>
          {Object.keys(COMMERCIAL_SEARCH_OPTIONS).map((item: CommercialAddition) => {
            const isActive = additionsBottomSheetIsActive && item === activeAddition;

            return (
              <TouchableOpacity key={item} onPress={() => showAdditionsBottomSheet(item)} style={styles.additionOptionButton}>
                <>
                  <Text style={styles.additionTitle}>{item}</Text>
                  <View style={styles.selectedAddition}>
                    <Text style={styles.selectedAdditionText}>{selectedOption(item)}</Text>
                    <ArrowBottom width={16} height={16} style={{ transform: [{ scaleY: isActive ? -1 : 1 }] }} />
                  </View>
                </>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const maxPriceDefaultValue = getSliderRangeMax(priceRangeLocal);
  const maxSquareDefaultValue = getSliderRangeMax(squareRangeLocal);

  return (
    <>
      {loading && <Preloader />}
      <Header
        title={'Search filters'}
        backText={'Cancel'}
        onBack={() => navigation.goBack()}
        headerOptions={
          <TouchableOpacity style={{ padding: 5 }} onPress={handleClearFilters}>
            <Text style={[TextStyles.body2, { color: Colors.primaryBlue }]}>Clear all</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.screen}>
        <ScrollView scrollEnabled={!isRangeSwiping} bounces={false} style={styles.container}>
          <View style={styles.headerContainer}>
            <>
              <TouchableOpacity style={styles.locationContainer} onPress={handleLocationChange}>
                <View style={styles.locationWrap}>
                  <Image source={locationIcon} style={styles.locationIcon} />
                  <Text style={styles.locationLabel}>CITY</Text>
                  <Text style={styles.locationText}>{location}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.propertyTypeTabContainer}>
                {PropertyTypesOptions.map((item) => {
                  const activeTab = item.type === propertyTypeTab;
                  return (
                    <TouchableOpacity key={item.type} onPress={() => handlePropertyTypeChange(item.type)} style={styles.propertyTypeTabItem}>
                      <Text style={[activeTab ? styles.activePropertyTypeTabText : styles.inactivePropertyTypeTabText]}>{item.title}</Text>
                      <View style={activeTab ? styles.activePropertyTypeTabLine : styles.inactivePropertyTypeTabLine} />
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={styles.propertyRoleTabContainer}>
                {RoleOptions.map((action: Action) => {
                  const activeTab = action === propertyRoleTab;

                  return (
                    <TouchableOpacity key={action} onPress={() => handleActionChange(action)} style={styles.propertyRoleTabItem}>
                      <Text style={[activeTab ? styles.activePropertyTypeTabText : styles.inactivePropertyTypeTabText]}>{action}</Text>
                      <View style={activeTab ? styles.activePropertyTypeTabLine : styles.inactivePropertyTypeTabLine} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
            <>
              <TouchableOpacity onPress={() => NavigationService.navigate(Routes.Search, { screen: Routes.Search })} style={styles.drawMapWrap}>
                <Image source={drowIcon} />
                <Text style={styles.drawMapText}>Draw on map</Text>
              </TouchableOpacity>
            </>
            <>
              <View style={styles.priceContainer}>
                <Text style={styles.budgetText}>Budget: </Text>
                <CurrencyToggle selectedCurrency={currency} handleCurrencyToggle={handleCurrencyToggle} />
              </View>
              <Text style={styles.anyText}>{getPriceTitle(priceRange, currency)}</Text>
              <RangeSlider
                min={priceRangeLocal?.min}
                max={maxPriceDefaultValue}
                lowValue={searchFilter.price?.range?.lowest}
                highValue={searchFilter.price?.range?.highest}
                step={10}
                onChange={setPriceRange}
                onChangeFinish={onPriceRangeFinished}
                rangeDisabled={isPriceSliderDisabled}
                onTouchStart={() => setRangeSwiping(true)}
                onTouchEnd={() => setRangeSwiping(false)}
              />
            </>
          </View>
          <View>
            <View style={styles.propertyTypeContainer}>
              <View style={styles.propertyTypeTextWrap}>
                <Text style={styles.budgetText}>Property Type</Text>
                <TouchableOpacity style={{ paddingHorizontal: 15 }} onPress={handleSelectAllPress}>
                  <Text style={styles.selectAllText}>Select All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.propertyTypeWrap}>
                {getPropertyTypes().map((item) => {
                  const isItemChecked = checkedPropertyTypeItems.find((itm) => itm == item.type);
                  return (
                    <TouchableOpacity
                      key={item.type}
                      style={isItemChecked ? styles.propertyTypeItemChecked : styles.propertyTypeItemUnchecked}
                      onPress={() => handleSelectPropertyTypesCheckbox(item.type)}
                    >
                      <Checkbox checked={!!isItemChecked} />
                      <Text style={styles.propertyTypeItemTitle}>{item.title}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
          {renderPropertyDetails()}
          <View>
            <View style={styles.squareContainer}>
              <View style={styles.squareWrap}>
                <Text style={styles.budgetText}>Square: </Text>
                <SquareToggle selectedSquare={square} handleSquareToggle={handleSquareToggle} />
              </View>
              <View style={{ alignItems: 'center' }}>{getSquareTitle(squareRange, square)}</View>
              <RangeSlider
                min={squareRangeLocal?.min}
                max={maxSquareDefaultValue}
                lowValue={searchFilter.size?.range?.lowest}
                highValue={searchFilter.size?.range?.highest}
                step={1}
                onChange={setSquareRange}
                onChangeFinish={onSizeRangeFinished}
                rangeDisabled={isSquareSliderDisabled}
                onTouchStart={() => setRangeSwiping(true)}
                onTouchEnd={() => setRangeSwiping(false)}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.allListningContainer} onPress={() => navigation.navigate(Routes.PropertiesList)}>
            <Text style={styles.amountOfItemsText}>See {searchResultCount || 0} listings</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheet
        sheetRef={additionsBottomSheetRef}
        onClose={() => setAdditionsBottomSheetIsActive(false)}
        isActive={additionsBottomSheetIsActive}
        snapPoints={additionsSnapPoints}
        containerStyle={styles.bottomSheetContainer}
        onOutsidePress={hideAdditionsBottomSheet}
        showBg
        title={activeAddition}
        titleStyle={styles.bottomSheetTitle}
      >
        <View style={styles.additionOptionsContainer}>
          {bottomSheetAdditionOptions.map((op) => {
            const optionIsSelected =
              searchFilter.type === 'Commercial' ? commercialAdditions?.[activeAddition] === op.value : residentialAdditions?.[activeAddition] === op.value;

            return (
              <TouchableOpacity key={op.title} style={styles.additionOption} onPress={() => handleSelectAddition(activeAddition, op.value)}>
                <Text style={[styles.additionOptionText, { color: optionIsSelected ? Colors.primaryBlue : Colors.primaryBlack }]}>{op.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <TouchableOpacity onPress={hideAdditionsBottomSheet} style={styles.bottomSheetCancelButton}>
          <Text style={styles.bottomSheetCancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  container: {
    paddingLeft: 0,
    paddingRight: 0,
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 15,
    shadowColor: 'rgba(14, 20, 56, 0.06)',
    shadowOpacity: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 16,
  },
  locationContainer: {
    alignItems: 'center',
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 6,
  },
  locationLabel: {
    ...TextStyles.h6,
    color: Colors.primaryBlue,
    marginRight: 8,
  },
  locationText: {
    ...TextStyles.h6,
    color: Colors.primaryBlack,
  },
  propertyTypeTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginVertical: 16,
  },
  propertyTypeTabItem: {
    width: '25%',
    alignItems: 'center',
  },
  propertyRoleTabItem: {
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
  inactivePropertyTypeTabLine: {
    marginTop: 8,
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(27, 30, 37, 0.1)',
  },
  inactivePropertyTypeTabText: {
    ...TextStyles.h6,
    fontWeight: '400',
    fontFamily: 'Gilroy-Regular',
    color: Colors.defaultText,
  },
  propertyRoleTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginBottom: 33,
  },
  drawMapWrap: {
    backgroundColor: Colors.defaultBg,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawMapText: {
    ...TextStyles.btnTitle,
    color: Colors.primaryBlue,
    marginLeft: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 22,
  },
  budgetText: {
    ...TextStyles.btnTitle,
    color: Colors.primaryBlack,
  },
  anyText: {
    ...TextStyles.btnTitle,
    color: Colors.primaryBlue,
    textAlign: 'center',
  },
  selectAllText: {
    ...TextStyles.body2,
    color: Colors.primaryBlue,
  },
  propertyTypeContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingBottom: 24,
  },
  propertyTypeTextWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  propertyTypeWrap: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  propertyTypeItemChecked: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 30,
    borderWidth: 1,
    marginRight: 5,
    marginTop: 5,
  },
  propertyTypeItemUnchecked: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 30,
    marginRight: 5,
    marginTop: 5,
    backgroundColor: Colors.defaultBg,
  },
  propertyTypeItemTitle: {
    ...TextStyles.checkBoxTitle,
    marginLeft: 7,
  },
  propertyDetailsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingBottom: 24,
  },
  propertyDetailsWrap: {
    marginTop: 16,
  },
  squareContainer: {
    paddingHorizontal: 16,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingBottom: 48,
  },
  squareWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  counter: {
    marginBottom: 12,
  },
  footer: {
    height: Layout.getViewHeight(10),
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 15,
    shadowColor: 'rgba(14, 20, 56, 0.06)',
    shadowOpacity: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 35,
    paddingBottom: 10,
  },
  amountOfItemsText: {
    ...TextStyles.body2,
    color: Colors.primaryBlue,
    textAlign: 'center',
  },
  additionTitle: {
    ...TextStyles.body1,
    textTransform: 'capitalize',
    lineHeight: 24,
    color: Colors.primaryBlack,
  },
  additionOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  selectedAddition: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedAdditionText: {
    ...TextStyles.btnTitle,
    marginRight: 4,
    textTransform: 'capitalize',
    color: Colors.primaryBlack,
  },
  bottomSheetTitle: {
    ...TextStyles.h5,
    fontWeight: '500',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  bottomSheetContainer: {
    marginTop: 0,
    paddingBottom: 40,
    height: 'auto',
  },
  additionOption: {
    paddingVertical: 6,
    width: '100%',
  },
  additionOptionText: {
    ...TextStyles.h5,
    color: Colors.primaryBlack,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  additionOptionsContainer: {
    alignItems: 'center',
    borderBottomColor: Colors.gray,
    borderBottomWidth: 1,
    paddingTop: 4,
    marginBottom: 25,
  },
  bottomSheetCancelButton: {
    alignItems: 'center',
  },
  bottomSheetCancelButtonText: {
    ...TextStyles.h5,
    color: Colors.darkGray,
  },
  allListningContainer: {
    paddingVertical: 15,
    width: '100%',
  },
});

export default SearchFilter;
