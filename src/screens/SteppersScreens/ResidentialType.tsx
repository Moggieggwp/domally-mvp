import React, { useEffect, useState } from 'react';
import { Platform, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchFilter } from 'src/redux/actions/search';
import { saveProperty } from 'src/redux/actions/currentProperty';
import { searchDetailedType, searchResultCountSelector } from 'src/redux/selectors/search';
import { isNewProperty, currentPropertySelector, currentPropertyId } from 'src/redux/selectors/currentProperty';
import { isOnboardingBuyFlow } from 'src/redux/selectors/app';
import { CircleButton, Container, Page } from 'src/components';
import { commonTypesScreenStyles as styles } from 'src/styles/stepperScreens/optionsScreens';
import { OPTIONS } from 'src/constants/search/ResidentialTypesOptions';
import Layout from 'src/constants/Layout';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { Property, PropertyDetailedType } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Routes from 'src/constants/routes';
import { updateCopiedArray } from 'src/utils/arrayHelper';
import * as NavigationService from 'src/services/NavigationService';

type Props = {
  onNext?: () => void;
  navigation?: StackNavigationProp<RootStackParamsList>;
};

const ResidentialTypeScreen = (props: Props) => {
  const { onNext, navigation } = props;
  const [types, setChosenTypes] = useState<PropertyDetailedType[]>([]);
  const isSearchFlow = useSelector(isOnboardingBuyFlow);
  const stateSearchResidentialType = useSelector(searchDetailedType);
  const stateIsNewProperty = useSelector(isNewProperty);
  const stateCurrentProperty = useSelector(currentPropertySelector);
  const propertyId = useSelector(currentPropertyId);
  const stateSearchCount = useSelector(searchResultCountSelector);

  const stateResidentialType = isSearchFlow ? stateSearchResidentialType : stateCurrentProperty?.detailedType;

  const dispatch = useDispatch();

  useEffect(() => {
    if (stateResidentialType) {
      const data = typeof stateResidentialType === 'string' ? [stateResidentialType] : stateResidentialType;
      setChosenTypes(data);
    }
  }, [stateResidentialType]);

  const onShowResults = () => {
    NavigationService.navigate(Routes.Home, { screen: Routes.Search });
  };

  const setType = (type: PropertyDetailedType) => {
    if (!type) return;

    if (!isSearchFlow) {
      setChosenTypes([type]);
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

  let optionsMargin = Platform.OS === 'ios' ? (Layout.isMediumDevice ? 17 : 28) : (Layout.window.width - 64 - 90 * 3) / 2;

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.contentContainer}>
        <StepperTitle title='Property Type' />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.optionsWrap}>
          {OPTIONS.map((item, index) => (
            <CircleButton
              key={item.title}
              styleWrap={[
                styles.circleButton,
                {
                  marginRight: Layout.isThirdElem(index) ? 0 : optionsMargin,
                },
              ]}
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

export default ResidentialTypeScreen;
