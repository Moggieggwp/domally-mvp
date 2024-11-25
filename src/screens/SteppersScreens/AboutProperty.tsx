import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Page, TextInput } from 'src/components';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import Layout from 'src/constants/Layout';
import { currentPropertyId, currentPropertyDescription } from 'src/redux/selectors/currentProperty';
import { saveProperty } from 'src/redux/actions/currentProperty';
import { TextStyles } from 'src/styles/BaseStyles';

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const AboutProperty = (props: Props) => {
  const { onNext } = props;
  const [inputValue, setInputValue] = useState('');

  const propertyId = useSelector(currentPropertyId);
  const dispatch = useDispatch();
  const stateDescription = useSelector(currentPropertyDescription);

  useEffect(() => {
    if (stateDescription) {
      setInputValue(stateDescription.toString());
    }
  }, [stateDescription]);

  const onTextChange = (value: string) => {
    setInputValue(value);
  }

  const onSubmitHandler = async () => {
    await dispatch(saveProperty({
      id: propertyId,
      description: inputValue,
    }));

    onNext();
  };

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={styles.container}>
        <StepperTitle style={styles.title} title='Some words about property' />
        <TextInput
          styleWrap={[TextStyles.body1, styles.input]}
          label='Please enter your description'
          onChangeText={onTextChange}
          value={inputValue}
          multiline={true}
          skipBlurOnSubmit={false}
          autoFocus
          returnKeyType='done'
          useTransformForLabel={false}
        />
      </Container>
      <StepperFooter
        onSubmit={onSubmitHandler}
        isNextBtnDisabled={inputValue.length === 0}
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Layout.getViewHeight(3.2),
  },
  title: {
    marginBottom: 34,
    maxWidth: 280,
  },
  input: {
    maxHeight: 112,
  },
});

export default AboutProperty;
