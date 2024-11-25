import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateSearchFilter } from 'src/redux/actions/search';
import { searchResidentialAdditions, searchResidentialData, searchResultCountSelector } from 'src/redux/selectors/search';
import { Container, Page, SwitchToggle } from 'src/components';
import { OPTIONS } from 'src/constants/search/ResidentalAdditionsOptions';
import Layout from 'src/constants/Layout';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { ResidentialAdditionData, ResidentialAdditions as ResidentialAdditionsType } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Routes from 'src/constants/routes';
import * as NavigationService from 'src/services/NavigationService';

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const ResidentialAdditions = (props: Props) => {
  const { onNext, navigation } = props;
  const [options, setOptions] = useState<ResidentialAdditionData>(null);
  const stateAdditions = useSelector(searchResidentialAdditions);
  const stateResidentialData = useSelector(searchResidentialData);
  const stateSearchCount = useSelector(searchResultCountSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    setAdditionalOptions(stateAdditions);
  }, [stateAdditions]);

  const setAdditionalOptions = (options) => {
    if (options) {
      setOptions(options);
    }
  }

  const onAdditionPress = (enabled: boolean, title: ResidentialAdditionsType) => {
    const copiedOptions = {...options};
    copiedOptions[title] = enabled;

    dispatch(updateSearchFilter({
      residentialData: {
        ...stateResidentialData,
        residentialAdditions: copiedOptions,
      }
    }));
  }

  const onShowResults = () => {
    NavigationService.navigate(Routes.Home, { screen: Routes.Search });
  };

  const onSubmitHandler = () => {
    onNext();
  };

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.contentContainer}>
        <StepperTitle title='Property additions' />
        <View style={styles.optionsWrap}>
          {OPTIONS.map(item => {
            const isEnabled = options?.[item.title];
            return <SwitchToggle
              key={item.title}
              enabled={!!isEnabled}
              title={item.title}
              onChange={onAdditionPress}
              containerStyles={styles.switch}
            />
          })}
        </View>
      </Container>
      <StepperFooter
        onShowResults={onShowResults}
        onSubmit={onSubmitHandler}
        apartmentsLength={stateSearchCount}
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: '100%',
    width: '100%',
    paddingTop: Layout.getViewHeight(3.2),
  },
  optionsWrap: {
    width: '100%',
    flexDirection: 'column',
    zIndex: 1,
    paddingBottom: 170,
  },
  switch: {
    marginBottom: 21,
  }
});

export default ResidentialAdditions;
