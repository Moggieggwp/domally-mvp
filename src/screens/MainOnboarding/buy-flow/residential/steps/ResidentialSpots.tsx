import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchFilter } from 'src/redux/actions/search';
import { searchResidentialData, searchResidentialNumberOfSpots, searchResultCountSelector, searchSelector } from 'src/redux/selectors/search';
import { CircleButton, Container, Page } from 'src/components';
import { OPTIONS } from 'src/constants/search/SpotsOptions';
import { numberScreensStyles as styles } from 'src/styles/stepperScreens/numberScreens';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { NumberOfSpots } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Routes from 'src/constants/routes';
import { updateCopiedArray } from 'src/utils/arrayHelper';
import * as NavigationService from 'src/services/NavigationService';

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const ResidentialSpots = (props: Props) => {
  const { onNext, navigation } = props;
  const [options, setOptions] = useState<NumberOfSpots[]>([]);
  const stateNumberOfSpots = useSelector(searchResidentialNumberOfSpots);
  const searchResult = useSelector(searchSelector);
  const stateResidentialData = useSelector(searchResidentialData);
  const stateSearchCount = useSelector(searchResultCountSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    if (stateNumberOfSpots) {
      setOptions(stateNumberOfSpots);
    }
  }, [stateNumberOfSpots]);

  const onShowResults = () => {
    NavigationService.navigate(Routes.Home, { screen: Routes.Search });
  };

  const setType = (option: NumberOfSpots) => {
    const copiedOptions = updateCopiedArray(options, option);

    dispatch(updateSearchFilter({
      residentialData: {
        ...stateResidentialData,
        numberOfSpots: copiedOptions,
      }
    }));
  }

  const isChosenType = (type: NumberOfSpots) => options?.includes(type);

  const onSubmitHandler = () => {
    onNext();
  };

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.contentContainer}>
        <StepperTitle title='Parking spots' />
        <ScrollView contentContainerStyle={styles.optionsWrap}>
          {OPTIONS.map((item, index) => (
            <CircleButton
              key={item.title}
              styleWrap={[styles.circleButton]}
              iconStyles={styles.icon}
              iconUrl={item.iconUrl}
              title={item.title}
              index={index}
              onPress={() => setType(item.type)}
              isActive={isChosenType(item.type)}
            />
          ))}
        </ScrollView>
      </Container>
      <StepperFooter
        onShowResults={onShowResults}
        onSubmit={onSubmitHandler}
        apartmentsLength={stateSearchCount}
      />
    </Page>
  );
};

export default ResidentialSpots;
