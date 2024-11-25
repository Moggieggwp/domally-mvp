import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useCallback } from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Header, Preloader } from 'src/components';
import Layout from 'src/constants/Layout';
import { sendEmailToSupport } from 'src/redux/actions/profile';
import { loadingSelector } from 'src/redux/selectors/auth';
import { profileDataSelector } from 'src/redux/selectors/profile';
import { RootStackParamsList } from 'src/types/navigation';
import { emailRegex } from 'src/utils/validation';
import InputRow from './components/InputRow';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'Support'>;
};

const Support = (props: Props) => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const profile = useSelector(profileDataSelector);

  const [firstName, setFirstName] = useState(profile?.firstName);
  const [email, setEmailAddress] = useState(profile?.email);
  const [message, setMessage] = useState('');
  const isLoading = useSelector(loadingSelector);

  const handleSendEmailToSupport = () => {
    dispatch(
      sendEmailToSupport({
        firstName,
        email,
        message,
      }),
    );
  };

  return (
    <>
      {isLoading && <Preloader />}
      <Header title={'Support'} arrowBack onBack={() => navigation.goBack()} />
      <SafeAreaView style={styles.screen}>
        <Container style={styles.container}>
          <View style={styles.menuItemsContainer}>
            <InputRow
              title={'First name'}
              name={'firstName'}
              value={firstName}
              onChange={(text) => setFirstName(text)}
              placeholder={'Enter your First name'}
              maxLength={40}
              validationRules={{ required: { value: true, message: 'First name is required' } }}
            />
            <InputRow
              title={'Email address'}
              name={'email'}
              value={email}
              onChange={(text) => setEmailAddress(text)}
              placeholder={'your@email.com'}
              maxLength={40}
              autoCapitalize={'none'}
              validationRules={{
                required: { value: true, message: 'Email is required' },
                pattern: { value: emailRegex, message: 'Invalid email' },
              }}
            />
            <InputRow
              title={'Message'}
              name={'message'}
              value={message}
              onChange={(v) => setMessage(v)}
              placeholder={'Enter your message'}
              multiline
              validationRules={{ required: { value: true, message: 'Message is required' } }}
            />
          </View>
          <Button style={styles.btn} title={'Submit'} onPress={handleSendEmailToSupport} disabled={!(!!message && !!email && !!firstName)} />
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
    marginBottom: Platform.OS === 'ios' ? (Layout.isMediumDevice ? 20 : 40) : 40,
  },
});

export default Support;
