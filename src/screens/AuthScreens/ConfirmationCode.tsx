import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Keyboard, StyleSheet, Text, View } from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill } from 'react-native-confirmation-code-field';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Page } from 'src/components';
import Colors from 'src/constants/colors';
import * as Routes from 'src/constants/routes';
import { getVerificationCode, sendVerificationCode, changePhoneNumber, clearAuthErrors } from 'src/redux/actions/auth';
import { loadingSelector, signUpErrorMessageSelector, userPhoneNumberSelector } from 'src/redux/selectors/auth';
import BaseStyles, { TextStyles } from 'src/styles/BaseStyles';
import { RootStackParamsList } from 'src/types/navigation';

const ConfirmationCodeImage = require('src/assets/img/phone-confirmation.png');

type ConfCodeScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'ConfirmationCode'>;

type Props = {
  navigation: ConfCodeScreenNavigationProp;
  route: RouteProp<RootStackParamsList, 'PhoneSignIn'>;
};

const CELL_COUNT = 6;

const ConfirmationCode = (props: Props) => {
  const { navigation, route } = props;
  const [value, setCode] = useState('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const userPhoneNumber = useSelector(userPhoneNumberSelector);
  const isLoading = useSelector(loadingSelector);
  const signUpErrorMessage = useSelector(signUpErrorMessageSelector);
  const dispatch = useDispatch();

  const isChangingPhoneNumber = route.params.isChangingPhoneNumber;
  const signInParams = route.params.navigationParams;

  useEffect(() => {
    onChangeValue();
  }, [value]);

  useEffect(() => {
    if (signUpErrorMessage && signUpErrorMessage.includes('401')) {
      Alert.alert(
        'Oops!',
        'Invalid confirmation code.',
        [
          {
            text: 'Ok',
            onPress: () => dispatch(clearAuthErrors('sign-up')),
            style: 'default',
          },
        ],
      );
    }
  }, [signUpErrorMessage]);

  const verifyCode = async () => {
    if (!isChangingPhoneNumber) {
      await dispatch(
        sendVerificationCode({
          phone: userPhoneNumber,
          code: value,
        }, signInParams),
      );
    } else {
      await dispatch(
        changePhoneNumber({
          phone: userPhoneNumber,
          code: value,
        }),
      );
    }
  };

  const resend = async () => {
    await dispatch(
      getVerificationCode(
        {
          phone: userPhoneNumber,
        },
        isChangingPhoneNumber,
        route.params?.navigationParams,
      ),
    );
  };

  const onChangeValue = async () => {
    if (value.length === CELL_COUNT) {
      await verifyCode();
    }
  };

  return (
    <Page isLoading={isLoading} keyboardAvoidingEnabled onBack={() => navigation.navigate(Routes.PhoneSignIn)}>
      <Container style={styles.container}>
        <View style={styles.imageWrap}>
          <Image style={styles.image} source={ConfirmationCodeImage} />
        </View>
        <View style={styles.textWrap}>
          <Text style={[TextStyles.h1, styles.title, BaseStyles.textCenter]}>Confirmation code</Text>
          <Text style={[TextStyles.body1, BaseStyles.textCenter]}>We just sent SMS with the confirmation code to your mobile number {userPhoneNumber || ''}</Text>
        </View>
        <View style={styles.inputWrap}>
          <CodeField
            ref={ref}
            value={value}
            onChangeText={(newValue) => setCode(newValue)}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType='number-pad'
            textContentType='oneTimeCode'
            returnKeyType='done'
            onSubmitEditing={Keyboard.dismiss}
            autoFocus={true}
            renderCell={({ index, symbol, isFocused }) => (
              <View key={index} style={[styles.cell, isFocused && styles.focusCell, { marginRight: index == 2 ? 16 : 0 }]}>
                <Text style={[TextStyles.body1, styles.cellText]}>{symbol || (isFocused ? <Cursor /> : null)}</Text>
              </View>
            )}
          />
        </View>
        <View style={styles.btnWrap}>
          <Button onPress={resend} titleStyles={[TextStyles.ghostBtnTitle]} title='Resend' isGhost />
        </View>
      </Container>
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-start',
    paddingTop: 85,
  },
  imageWrap: {
    position: 'relative',
    marginBottom: 15,
    width: 142,
    maxHeight: 157,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  textWrap: {
    marginBottom: 22,
  },
  title: {
    marginBottom: 10,
  },
  inputWrap: {
    width: '100%',
    marginBottom: 16,
    justifyContent: 'center',
  },
  btnWrap: {
    flex: 1,
    width: '100%',
  },
  btn: {
    height: 56,
  },
  codeFieldRoot: {
    justifyContent: 'space-between',
  },
  cell: {
    width: 45,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  focusCell: {
    borderColor: Colors.primaryBlue,
  },
  cellText: {
    color: Colors.primaryBlack,
  },
});

export default ConfirmationCode;
