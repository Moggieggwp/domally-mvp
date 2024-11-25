import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { saveProperty } from 'src/redux/actions/currentProperty';
import { currentPropertyId, currentPropertyResidentialDetails } from 'src/redux/selectors/currentProperty';
import { Container, Page, SwitchToggle, StringCounter } from 'src/components';
import { OPTIONS } from 'src/constants/createProperty/PropertyDetailsOptions';
import Layout from 'src/constants/Layout';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { ResidentialAdditionData, ResidentialAdditions as ResidentialAdditionsType } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import Counter from 'src/components/Counter';
import { CounterStringValues } from 'src/constants/propertyDetails';

const NUMBER_OF_BATHROOMS_OPTIONS = ['1', '1.5', '2', '2.5', '3', '4', '5', '6', '7', '8', '9', '10'];

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const ResidentialPropertyDetails = (props: Props) => {
  const { onNext } = props;
  const [options, setOptions] = useState<ResidentialAdditionData>(OPTIONS);

  const [numberOfBedrooms, setNumberOfBedrooms] = useState<number>(undefined);
  const [numberOfBathrooms, setNumberOfBathrooms] = useState<number>(undefined);
  const [numberOfFloors, setNumberOfFloors] = useState<number>(undefined);
  const [numberOfSpots, setNumberOfSpots] = useState<number>(undefined);

  const propertyId = useSelector(currentPropertyId);
  const statePropertyDetails = useSelector(currentPropertyResidentialDetails);

  const dispatch = useDispatch();

  useEffect(() => {
    if (statePropertyDetails?.residentialAdditions) {
      setAdditionalOptions(statePropertyDetails.residentialAdditions);
    }

    if (statePropertyDetails?.residentialNumberOfBedrooms) {
      setNumberOfBedrooms(statePropertyDetails.residentialNumberOfBedrooms);
    }

    if (statePropertyDetails?.residentialNumberOfBathrooms) {
      setNumberOfBathrooms(statePropertyDetails.residentialNumberOfBathrooms);
    }

    if (statePropertyDetails?.residentialNumberOfFloors) {
      setNumberOfFloors(statePropertyDetails.residentialNumberOfFloors);
    }

    if (statePropertyDetails?.numberOfSpots) {
      setNumberOfSpots(statePropertyDetails.numberOfSpots);
    }
  }, [statePropertyDetails]);

  const setAdditionalOptions = (opts: ResidentialAdditionData) => {
    if (opts) {
      setOptions(opts);
    }
  };

  const onAdditionPress = (enabled: boolean, title: ResidentialAdditionsType) => {
    const copiedOptions = { ...options };
    copiedOptions[title] = enabled;

    setOptions(copiedOptions);
  };

  const onSubmitHandler = async () => {
    await dispatch(
      saveProperty({
        id: propertyId,
        residentialData: {
          ...statePropertyDetails,
          residentialAdditions: options,
          residentialNumberOfBedrooms: numberOfBedrooms,
          residentialNumberOfBathrooms: numberOfBathrooms,
          residentialNumberOfFloors: numberOfFloors,
          numberOfSpots: numberOfSpots,
        },
      }),
    );

    onNext();
  };

  // TODO: since numberOfFloors minimum and default value is 1, so it always returns false
  const isUnitsEmpty = !numberOfBedrooms && !numberOfBathrooms && !numberOfFloors && !numberOfSpots;

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
            onChange={(value) => onChange(value, setNumberOfBedrooms)}
            style={styles.counter}
            title={'Number of bedrooms'}
            maxValue={99}
            initialCurrent={CounterStringValues.NotApplicable}
            initialValue={numberOfBedrooms}
          />
          <StringCounter
            onChange={(value) => onChange(value, setNumberOfBathrooms)}
            style={styles.counter}
            title={'Number of bathrooms'}
            initialValue={numberOfBathrooms}
            allowableValues={NUMBER_OF_BATHROOMS_OPTIONS}
          />
          <Counter
            onChange={(value) => onChange(value, setNumberOfFloors)}
            style={styles.counter}
            title={'Number of floors'}
            maxValue={99}
            minValue={1}
            initialCurrent={1}
            initialValue={numberOfFloors}
          />
          <Counter
            onChange={(value) => onChange(value, setNumberOfSpots)}
            style={styles.counter}
            title={'Parking spots'}
            maxValue={99}
            initialCurrent={CounterStringValues.NotApplicable}
            initialValue={numberOfSpots}
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
      <StepperFooter onSubmit={onSubmitHandler} isNextBtnDisabled={isUnitsEmpty} />
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
});

export default ResidentialPropertyDetails;
