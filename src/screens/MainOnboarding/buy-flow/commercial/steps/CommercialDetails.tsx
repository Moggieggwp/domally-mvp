import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchFilter } from 'src/redux/actions/search';
import { searchResultCountSelector, searchSelector } from 'src/redux/selectors/search';
import { BottomSheet, Container, Page } from 'src/components';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { BottomSheetAdditionOptions, CommercialAddition, CommercialAdditions, NumberOfUnits } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Routes from 'src/constants/routes';
import * as NavigationService from 'src/services/NavigationService';
import Counter from 'src/components/Counter';
import Layout from 'src/constants/Layout';
import BottomSheetContainer from 'reanimated-bottom-sheet';
import { commercialNumberOfUnits, COMMERCIAL_SEARCH_OPTIONS, CounterStringValues } from 'src/constants/propertyDetails';
import { TextStyles } from 'src/styles/BaseStyles';
import Colors from 'src/constants/colors';

import ArrowBottom from 'src/assets/img/icons/arrow-bottom.svg';

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const CommercialDetails = (props: Props) => {
  const { onNext } = props;

  const dispatch = useDispatch();

  const stateSearchCount = useSelector(searchResultCountSelector);
  const search = useSelector(searchSelector);
  const searchFilter = search.searchData.query;
  const commercialData = searchFilter.commercialData;

  const initialCommercialUnits = commercialData?.commercialUnits || CounterStringValues.Any;
  const initialNumberOfCommercialUnits = commercialData?.numberOfCommercialUnits || CounterStringValues.Any;
  const initialCommercialResidentialUnits = commercialData?.commercialResidentialUnits || CounterStringValues.Any;
  const additions = { ...commercialData?.commercialAdditions };

  const additionsBottomSheetRef = useRef<BottomSheetContainer>(null);
  const [activeAddition, setActiveAddition] = useState<CommercialAdditions>(null);
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

  const showAdditionsBottomSheet = (addition: CommercialAdditions) => {
    setAdditionsBottomSheetIsActive(true);
    setActiveAddition(addition);
    additionsBottomSheetRef.current.snapTo(0);
  };

  const hideAdditionsBottomSheet = () => {
    setAdditionsBottomSheetIsActive(false);
    setActiveAddition(null);
    additionsBottomSheetRef.current.snapTo(1);
  };

  const handleSelectAddition = (item: CommercialAdditions, enabled: boolean) => {
    additions[item] = enabled;
    dispatch(updateSearchFilter({ commercialData: { ...commercialData, commercialAdditions: additions } }));
  };

  const onShowResults = () => {
    NavigationService.navigate(Routes.Home, { screen: Routes.Search });
  };

  const onSubmitHandler = () => {
    onNext();
  };

  const selectedOption = (item: CommercialAdditions) => {
    const addition = additions?.[item];
    if (additions && addition !== undefined) {
      return addition ? `${item} only` : `No ${item}`;
    }

    return 'Any';
  };

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.contentContainer}>
        <StepperTitle title={'Property Details'} />
        <View style={styles.propertyDetailsContainer}>
          <View style={styles.propertyDetailsWrap}>
            <Counter
              onChange={(value: NumberOfUnits) => dispatch(updateSearchFilter({ commercialData: { ...commercialData, commercialUnits: value } }))}
              style={styles.counter}
              title={'Number of units'}
              allowableValues={commercialNumberOfUnits}
              initialValue={initialCommercialUnits}
            />
            <Counter
              onChange={(value: NumberOfUnits) => dispatch(updateSearchFilter({ commercialData: { ...commercialData, numberOfCommercialUnits: value } }))}
              style={styles.counter}
              title={'Number of commercial units'}
              allowableValues={commercialNumberOfUnits}
              initialValue={initialNumberOfCommercialUnits}
            />
            <Counter
              onChange={(value: NumberOfUnits) => dispatch(updateSearchFilter({ commercialData: { ...commercialData, commercialResidentialUnits: value } }))}
              style={styles.counter}
              title={'Number of residential units'}
              allowableValues={commercialNumberOfUnits}
              initialValue={initialCommercialResidentialUnits}
            />
          </View>
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
      </Container>
      <StepperFooter onShowResults={onShowResults} onSubmit={onSubmitHandler} apartmentsLength={stateSearchCount} />
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
            const optionIsSelected = additions?.[activeAddition] === op.value;

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
    </Page>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: '100%',
    width: '100%',
    paddingTop: Layout.getViewHeight(3.2),
    overflow: 'visible',
    paddingLeft: 0,
    paddingRight: 0,
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
  counter: {
    marginBottom: 12,
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
    marginBottom: 20,
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
    marginBottom: 12,
  },
  additionOptionText: {
    ...TextStyles.h5,
    color: Colors.primaryBlack,
    textTransform: 'capitalize',
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
});

export default CommercialDetails;
