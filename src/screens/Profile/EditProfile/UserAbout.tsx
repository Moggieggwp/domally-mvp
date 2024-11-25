import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Header, Preloader } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import * as Routes from 'src/constants/routes';
import { useBackButtonListener } from 'src/helpers/hooks';
import { updateUser } from 'src/redux/actions/profile';
import { loadingSelector, profileDataSelector } from 'src/redux/selectors/profile';
import { TextStyles } from 'src/styles/BaseStyles';
import Typography from 'src/styles/Typography';
import { RootStackParamsList } from 'src/types/navigation';
import { emailRegex } from 'src/utils/validation';
import InputRow from './components/InputRow';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'UserAbout'>;
};

const UserAbout = (props: Props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const backListener = useBackButtonListener();

  const userInfo = useSelector(profileDataSelector);
  const isLoading = useSelector(loadingSelector);

  const [firstName, setFirstName] = useState(userInfo?.firstName);
  const [lastName, setLastName] = useState(userInfo?.lastName);
  const [emailAddress, setEmailAddress] = useState(userInfo?.email);

  const [errorMessage, setErrorMessage] = useState(false);

  const updateUserData = (field, value) => {
    const user = {};
    user[field] = value;
    dispatch(updateUser(user));
    setErrorMessage(false);
  };

  const validateData = () => {
    if (!firstName || !lastName || !emailAddress) {
      setErrorMessage(true);
    } else {
      navigation.navigate(Routes.Home);
      resetState();
    }
  };

  const resetState = () => {
    setFirstName('');
    setLastName('');
    setEmailAddress('');
  };

  return (
    <>
      {isLoading && <Preloader />}
      <Header title={'About'} arrowBack={false} onBack={() => {}} />
      <SafeAreaView style={styles.screen}>
        <Container style={styles.container}>
          <View style={styles.menuItemsContainer}>
            <InputRow
              title={'First name'}
              name={'firstName'}
              value={firstName}
              onChange={(text) => setFirstName(text)}
              placeholder={'Enter your First name'}
              onSave={(value) => updateUserData('firstName', value)}
              maxLength={40}
              validationRules={{ required: { value: true, message: 'First name is required' } }}
            />
            <InputRow
              title={'Last name'}
              name={'lastName'}
              value={lastName}
              onChange={(text) => setLastName(text)}
              placeholder={'Enter your Last name'}
              onSave={(value) => updateUserData('lastName', value)}
              maxLength={40}
              validationRules={{ required: { value: true, message: 'Last name is required' } }}
            />
            <InputRow
              title={'Email address'}
              name={'email'}
              value={emailAddress}
              onChange={(text) => setEmailAddress(text)}
              placeholder={'your@email.com'}
              onSave={(value) => updateUserData('email', value)}
              maxLength={40}
              autoCapitalize={'none'}
              validationRules={{
                required: { value: true, message: 'Email is required' },
                pattern: { value: emailRegex, message: 'Invalid email' },
              }}
            />
          </View>
          <View style={styles.bottom}>
            {errorMessage && <Text style={styles.errorText}>Please, fill in all fields</Text>}
            <Button style={styles.btn} title={'Save'} onPress={validateData} />
          </View>
        </Container>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    paddingTop: 16,
    paddingLeft: 16,
    paddingRight: 16,
    flex: 1,
    justifyContent: 'space-between',
  },
  menuItemsContainer: {
    marginTop: 30,
  },
  btn: {
    marginBottom: Layout.isMediumDevice ? 20 : 0,
  },
  errorText: {
    ...Typography.h5,
    marginBottom: 20,
    width: '100%',
    color: Colors.red,
  },
  titleString: {
    ...TextStyles.h3,
    textAlign: 'center',
    maxWidth: Layout.getViewWidth(58),
  },
  bottom: {
    paddingBottom: Layout.isMediumDevice ? 20 : 40,
  }, 
});

export default UserAbout;
