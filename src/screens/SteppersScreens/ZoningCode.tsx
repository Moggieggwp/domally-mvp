import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Page, TextInput } from 'src/components';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import Layout from 'src/constants/Layout';
import { currentPropertyId, currentPropertyZoningCode } from 'src/redux/selectors/currentProperty';
import { saveProperty } from 'src/redux/actions/currentProperty';

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const ZoningCode = (props: Props) => {
  const { onNext } = props;
  const [inputValue, setInputValue] = useState('');
  const propertyId = useSelector(currentPropertyId);
  const stateZoningCode = useSelector(currentPropertyZoningCode);
  const dispatch = useDispatch();

  useEffect(() => {
    if (stateZoningCode) {
      setInputValue(stateZoningCode.toUpperCase());
    }
  }, [stateZoningCode]);

  const onTextChange = async (value: string) => {
    setInputValue(value);
  }

  const onSubmitHandler = async () => {
    await dispatch(saveProperty({
      id: propertyId,
      zoningCode: inputValue,
    }));

    onNext();
  };

  const value = inputValue.toUpperCase();

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.container}>
        <StepperTitle style={styles.title} title='Zoning Code' />
        <TextInput
          label='Your zoning code'
          onChange={onTextChange}
          value={value}
          autoFocus
          withClear
        />
      </Container>
      <StepperFooter
        onSubmit={onSubmitHandler}
        isNextBtnDisabled={value.length === 0}
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Layout.getViewHeight(3.2),
  },
  title: {
    marginBottom: 24,
  },
});

export default ZoningCode;
