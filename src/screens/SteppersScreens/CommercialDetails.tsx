import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { saveProperty } from 'src/redux/actions/currentProperty';
import { currentPropertyId, currentPropertyCommercialDetails } from 'src/redux/selectors/currentProperty';
import { Container, Page, SwitchToggle } from 'src/components';
import { OPTIONS } from 'src/constants/createProperty/CommercialPropertyDetails';
import Layout from 'src/constants/Layout';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { CommercialAddition as CommercialAdditionsType, CommercialAdditionData } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import Counter from 'src/components/Counter';
import { CounterStringValues } from 'src/constants/propertyDetails';

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const CommercialDetails = (props: Props) => {
  const { onNext } = props;
  const [options, setOptions] = useState<CommercialAdditionData>(OPTIONS);

  const [numberOfUnits, setNumberOfUnits] = useState<number>(undefined);
  const [numberOfCommercialUnits, setNumberOfCommercialUnits] = useState<number>(undefined);
  const [numberOfResidentialUnits, setNumberOfResidentialUnits] = useState<number>(undefined);
  const [numberOfSpots, setNumberOfSpots] = useState<number>(undefined);

  const propertyId = useSelector(currentPropertyId);
  const statePropertyDetails = useSelector(currentPropertyCommercialDetails);

  const dispatch = useDispatch();

  useEffect(() => {
    if (statePropertyDetails?.commercialAdditions) {
      setAdditionalOptions(statePropertyDetails?.commercialAdditions);
    }

    if (statePropertyDetails?.commercialUnits) {
      setNumberOfUnits(statePropertyDetails?.commercialUnits);
    }

    if (statePropertyDetails?.numberOfCommercialUnits) {
      setNumberOfCommercialUnits(statePropertyDetails?.numberOfCommercialUnits);
    }

    if (statePropertyDetails?.commercialResidentialUnits) {
      setNumberOfResidentialUnits(statePropertyDetails?.commercialResidentialUnits);
    }

    if (statePropertyDetails?.numberOfSpots) {
      setNumberOfSpots(statePropertyDetails?.numberOfSpots);
    }
  }, [statePropertyDetails]);

  const setAdditionalOptions = (opts: CommercialAdditionData) => {
    if (opts) {
      setOptions(opts);
    }
  };

  const onAdditionPress = (enabled: boolean, title: CommercialAdditionsType) => {
    const copiedOptions = { ...options };
    copiedOptions[title] = enabled;

    setOptions(copiedOptions);
  };

  const onSubmitHandler = async () => {
    await dispatch(
      saveProperty({
        id: propertyId,
        commercialData: {
          ...statePropertyDetails,
          commercialUnits: numberOfUnits,
          numberOfCommercialUnits: numberOfCommercialUnits,
          commercialResidentialUnits: numberOfResidentialUnits,
          numberOfSpots: numberOfSpots,
          commercialAdditions: options,
        },
      }),
    );

    onNext();
  };

  const onChange = (value: string | number, setStateAction: (value: React.SetStateAction<number>) => void) => {
    const valueIsNumber = typeof value === 'number';
    setStateAction(valueIsNumber ? value : null);
  };

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.contentContainer}>
        <StepperTitle title={'Property Details'} />
        <View style={styles.counterWrap}>
          <Counter
            onChange={(value) => onChange(value, setNumberOfUnits)}
            style={styles.counter}
            title={'Number of units'}
            maxValue={99}
            initialValue={numberOfUnits}
            initialCurrent={CounterStringValues.NotApplicable}
            titleStyle={styles.counterTitle}
          />
          <Counter
            onChange={(value) => onChange(value, setNumberOfCommercialUnits)}
            style={styles.counter}
            title={'Number of commercial units'}
            maxValue={99}
            initialValue={numberOfCommercialUnits}
            initialCurrent={CounterStringValues.NotApplicable}
            titleStyle={styles.counterTitle}
          />
          <Counter
            onChange={(value) => onChange(value, setNumberOfResidentialUnits)}
            style={styles.counter}
            title={'Number of residential units'}
            maxValue={99}
            initialValue={numberOfResidentialUnits}
            initialCurrent={CounterStringValues.NotApplicable}
            titleStyle={styles.counterTitle}
          />
          <Counter
            onChange={(value) => onChange(value, setNumberOfSpots)}
            style={styles.counter}
            title={'Parking spots'}
            maxValue={99}
            initialValue={numberOfSpots}
            initialCurrent={CounterStringValues.NotApplicable}
          />
        </View>
        <View style={styles.optionsWrap}>
          {Object.keys(OPTIONS).map((item) => {
            const isEnabled = options?.[item];
            return (
              <SwitchToggle key={item} enabled={isEnabled} title={item} onChange={onAdditionPress} containerStyles={styles.switch} titleStyles={styles.switchTitle} />
            );
          })}
        </View>
      </Container>
      <StepperFooter onSubmit={onSubmitHandler} />
    </Page>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    height: '100%',
    width: '100%',
    paddingTop: Layout.getViewHeight(3.2),
    paddingLeft: 16,
    paddingRight: 16,
  },
  counterWrap: {},
  counter: {
    marginBottom: 12,
  },
  optionsWrap: {
    width: '100%',
    flexDirection: 'column',
    zIndex: 1,
  },
  switch: {
    marginBottom: 21,
  },
  switchTitle: {
    fontWeight: '400',
  },
  counterTitle: {
    flexBasis: Platform.OS === 'ios' ? (Layout.isMediumDevice ? 180 : 'auto') : Layout.isWideAndroid ? 'auto' : 180,
  },
});

export default CommercialDetails;
