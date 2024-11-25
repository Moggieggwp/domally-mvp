import React, { useEffect, useState } from 'react';
import { Platform, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchFilter } from 'src/redux/actions/search';
import { searchSelector, searchDetailedType, searchResultCountSelector } from 'src/redux/selectors/search';
import { CircleButton, Container, Page } from 'src/components';
import { commonTypesScreenStyles as styles } from '../../styles/stepperScreens/optionsScreens';
import { OPTIONS } from 'src/constants/search/CommercialTypeOptions';
import Layout from 'src/constants/Layout';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { Property, PropertyDetailedType } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Routes from 'src/constants/routes';
import { updateCopiedArray } from 'src/utils/arrayHelper';
import { isOnboardingBuyFlow } from 'src/redux/selectors/app';
import { currentPropertyId, currentPropertySelector, isNewProperty } from 'src/redux/selectors/currentProperty';
import { saveProperty } from 'src/redux/actions/currentProperty';
import * as NavigationService from 'src/services/NavigationService';

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const CommercialPropertyType = (props: Props) => {
  const { onNext, navigation } = props;
  const [types, setChosenType] = useState<PropertyDetailedType[]>([]);
  const stateTypes = useSelector(searchDetailedType);
  const searchResult = useSelector(searchSelector);
  const isSearchFlow = useSelector(isOnboardingBuyFlow);
  const stateIsNewProperty = useSelector(isNewProperty);
  const stateCurrentProperty = useSelector(currentPropertySelector);
  const propertyId = useSelector(currentPropertyId);
  const stateSearchCount = useSelector(searchResultCountSelector);

  const dispatch = useDispatch();

  const stateType = isSearchFlow ? stateTypes : stateCurrentProperty?.detailedType;

  useEffect(() => {
    if (stateType) {
      const data = typeof stateType === 'string' ? [stateType] : stateType;
      setChosenType(data);
    }
  }, [stateTypes]);

  const onShowResults = () => {
    NavigationService.navigate(Routes.Home, { screen: Routes.Search });
  };

  const setType = (type: PropertyDetailedType) => {
    if (!type) return;

    if (!isSearchFlow) {
      setChosenType([type]);
    } else {
      const copiedTypes = updateCopiedArray(types, type);
      dispatch(updateSearchFilter({ detailedType: copiedTypes }));
    }
  };

  const isChosenType = (type: PropertyDetailedType) => types?.includes(type);

  const onSubmitHandler = async () => {
    if (!isSearchFlow) {
      let data: Property = {};

      if (stateIsNewProperty) {
        data = {
          action: stateCurrentProperty.action,
          type: stateCurrentProperty.type,
          location: stateCurrentProperty.location,
          detailedType: types[0],
        };
      } else {
        data = {
          id: propertyId,
          detailedType: types[0],
        };
      }

      await dispatch(saveProperty(data));
    }

    onNext();
  };

  const optionsMargin = Platform.OS === 'ios' ? (Layout.isMediumDevice ? 17 : 28) : (Layout.window.width - 64 - 90 * 3) / 2;

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.contentContainer}>
        <StepperTitle title='Property Type' />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.optionsWrap}>
          {OPTIONS.map((item, index) => (
            <CircleButton
              key={item.title}
              styleWrap={[styles.circleButton, { marginRight: Layout.isThirdElem(index) ? 0 : optionsMargin }]}
              iconUrl={item.iconUrl}
              title={item.title}
              titleStyle={styles.circleTitle}
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
        isNextBtnDisabled={!isSearchFlow && types?.length <= 0}
      />
    </Page>
  );
};

export default CommercialPropertyType;
