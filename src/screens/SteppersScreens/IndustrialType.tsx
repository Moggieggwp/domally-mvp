import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchFilter } from 'src/redux/actions/search';
import { searchDetailedType, searchResultCountSelector } from 'src/redux/selectors/search';
import { isOnboardingBuyFlow } from 'src/redux/selectors/app';

import { commonTypesScreenStyles as styles } from '../../styles/stepperScreens/optionsScreens';
import { CircleButton, Container, Page } from 'src/components';
import { OPTIONS } from 'src/constants/search/IndustrialTypeOptions';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { Property, PropertyDetailedType } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Routes from 'src/constants/routes';
import { updateCopiedArray } from 'src/utils/arrayHelper';
import { currentPropertyId, currentPropertySelector, isNewProperty } from 'src/redux/selectors/currentProperty';
import { saveProperty } from 'src/redux/actions/currentProperty';
import * as NavigationService from 'src/services/NavigationService';

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const IndustrialTypeScreen = (props: Props) => {
  const { onNext, navigation } = props;
  const [chosenTypes, setChosenType] = useState<PropertyDetailedType[]>([]);
  const stateIndustrialType = useSelector(searchDetailedType);
  const isSearchFlow = useSelector(isOnboardingBuyFlow);
  const stateIsNewProperty = useSelector(isNewProperty);
  const stateCurrentProperty = useSelector(currentPropertySelector);
  const propertyId = useSelector(currentPropertyId);
  const stateSearchCount = useSelector(searchResultCountSelector);

  const dispatch = useDispatch();

  const stateType = isSearchFlow ? stateIndustrialType : stateCurrentProperty?.detailedType;

  useEffect(() => {
    if (stateType) {
      const data = typeof(stateType) === 'string' ? [stateType] : stateType;
      setChosenType(data);
    }
  }, [stateType]);

  const onShowResults = () => {
    NavigationService.navigate(Routes.Home, { screen: Routes.Search });
  };

  const setType = (type: PropertyDetailedType) => {
    if (!type) return;

    if (!isSearchFlow) {
      setChosenType([type]);

    } else {
      const copiedTypes = updateCopiedArray(chosenTypes, type);
      dispatch(updateSearchFilter({ detailedType: copiedTypes }));
    }
  }

  const isChosenType = (type: PropertyDetailedType) => chosenTypes?.includes(type);

  const onSubmitHandler = async () => {
    if (!isSearchFlow) {
      let data: Property = {};

      if (stateIsNewProperty) {
        data = {
          action: stateCurrentProperty.action,
          type: stateCurrentProperty.type,
          location: stateCurrentProperty.location,
          detailedType: chosenTypes[0],
        };
      } else {
        data = {
          id: propertyId,
          detailedType: chosenTypes[0],
        };
      }

      await dispatch(saveProperty(data));
    }

    onNext();
  };

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.contentContainer}>
        <StepperTitle title='Property Type' />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.optionsWrap, industrialStyles.optionsContainer]}>
          {OPTIONS.map((item, index) => (
            <CircleButton
              key={item.type}
              styleWrap={[styles.circleButton]}
              iconUrl={item.iconUrl}
              title={item.title}
              titleStyle={[styles.circleTitle, industrialStyles.circleTitle]}
              index={index}
              onPress={() => setType(item.type)}
              isActive={isChosenType(item.type)}
            />
          ))}
        </ScrollView>
      </Container>
      <StepperFooter
        onShowResults={isSearchFlow ? onShowResults : null}
        onSubmit={onSubmitHandler}
        apartmentsLength={isSearchFlow ? stateSearchCount : null}
        isNextBtnDisabled={!isSearchFlow && chosenTypes?.length <= 0}
      />
    </Page>
  );
};

const industrialStyles = StyleSheet.create({
  optionsContainer: {
    justifyContent: 'space-between',
  },
  circleTitle: {
    maxWidth: 120,
  },
});

export default IndustrialTypeScreen;
