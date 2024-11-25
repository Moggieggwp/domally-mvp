import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { useDispatch, useSelector } from 'react-redux';
import ClearIcon from 'src/assets/img/icons/clear-input-icon.svg';
import BtnArrow from 'src/assets/img/icons/down-arrow.svg';
import { Button, Container, Page } from 'src/components';
import Colors from 'src/constants/colors';
import { clearAuthErrors, getVerificationCode } from 'src/redux/actions/auth';
import { loadingSelector, signUpErrorMessageSelector } from 'src/redux/selectors/auth';
import BaseStyles, { TextStyles } from 'src/styles/BaseStyles';
import { IAuthData } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';

const phoneSignInImage = require('src/assets/img/phone-sign-in.png');

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'PhoneSignIn'>;
  route: RouteProp<RootStackParamsList, 'PhoneSignIn'>;
};

const PhoneSignIn = (props: Props) => {
  const { navigation, route } = props;
  const phoneInput = useRef<PhoneInput>(null);
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const isLoading = useSelector(loadingSelector);
  const signUpErrorMessage = useSelector(signUpErrorMessageSelector);
  const dispatch = useDispatch();

  const isChangingPhoneNumber = route.params.isChangingPhoneNumber;

  useEffect(() => {
    if (signUpErrorMessage && signUpErrorMessage.includes('400')) {
      Alert.alert(
        'Oops!',
        'You entered invalid phone number.',
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

  const onInputClear = () => {
    setValue('');
    setFormattedValue('');

    phoneInput.current.setState({
      number: '',
    });
  };

  const onSubmit = async () => {
    const data: IAuthData = {
      phone: formattedValue,
    };

    await dispatch(getVerificationCode(data, isChangingPhoneNumber, route.params?.navigationParams));
  };

  const isValid = phoneInput.current?.isValidNumber(value);
  const isInputEmpty = value.length <= 0;
  const validationColor = !isValid && !isInputEmpty ? Colors.red : Colors.primaryBlue;

  return (
    <Page isLoading={isLoading} keyboardAvoidingEnabled onClose={() => navigation.goBack()}>
      <Container style={styles.container}>
        <View style={styles.imageWrap}>
          <Image style={styles.image} source={phoneSignInImage} />
        </View>
        <View style={styles.textWrap}>
          <Text style={[TextStyles.h1, styles.title, BaseStyles.textCenter]}>{isChangingPhoneNumber ? 'Change phone number' : 'Sign In'}</Text>
          <Text style={[TextStyles.body1, BaseStyles.textCenter]}>{isChangingPhoneNumber ? 'Enter your new phone number' : 'Use your mobile number to authorize'}</Text>
        </View>
        <View style={styles.inputWrap}>
          <View style={[styles.divider, { backgroundColor: validationColor }]} />
          <BtnArrow style={styles.inputArrow} />
          {!isInputEmpty && (
            <TouchableOpacity style={[styles.clearBtnWrap]} onPress={onInputClear}>
              <ClearIcon style={styles.clearBtn} />
            </TouchableOpacity>
          )}
          <PhoneInput
            containerStyle={[styles.inputContainer, { borderColor: validationColor }]}
            textInputStyle={styles.input}
            textContainerStyle={styles.inputTextContainer}
            textInputProps={{
              placeholder: '',
              style: [TextStyles.body1, styles.inputText, styles.numberInput],
              keyboardType: 'number-pad',
              returnKeyType: 'done',
            }}
            codeTextStyle={[TextStyles.body1, styles.inputText, styles.phoneCode]}
            disableArrowIcon
            ref={phoneInput}
            placeholder=''
            defaultValue={value || ''}
            defaultCode='CA'
            onChangeText={(text) => setValue(text)}
            onChangeFormattedText={(text) => setFormattedValue(text)}
            withDarkTheme={false}
            withShadow={false}
            autoFocus
            flagButtonStyle={styles.flagBtn}
            countryPickerButtonStyle={styles.inputFlagBtn}
          />
        </View>
        <View style={styles.btnWrap}>
          <Button onPress={onSubmit} style={styles.btn} title='Next' disabled={!isValid} />
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
    paddingTop: 59,
  },
  imageWrap: {
    position: 'relative',
    width: 214,
    maxHeight: 214,
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
    marginTop: -10,
    marginBottom: 19,
  },
  title: {
    marginBottom: 10,
  },
  inputWrap: {
    width: '100%',
    marginBottom: 17,
    justifyContent: 'center',
  },
  btnWrap: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  btn: {
    height: 56,
  },
  inputContainer: {
    width: '100%',
    borderRadius: 10,
    borderColor: Colors.primaryBlue,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  inputArrow: {
    position: 'absolute',
    left: 92,
    width: 10,
    height: 10,
  },
  inputTextContainer: {
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  input: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  inputText: {
    color: Colors.primaryBlack,
    fontWeight: '400',
    lineHeight: 19,
  },
  numberInput: {
    width: '100%',
  },
  phoneCode: {
    marginRight: 39,
    marginLeft: 30,
    minWidth: 35,
  },
  inputFlagBtn: {
    width: 100,
    position: 'absolute',
    left: 0,
    zIndex: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flagBtn: {
    position: 'relative',
    transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }],
  },
  divider: {
    position: 'absolute',
    left: 110,
    alignSelf: 'center',
    opacity: 0.5,
    borderRadius: 100,
    width: 1,
    height: 32,
  },
  clearBtnWrap: {
    position: 'absolute',
    right: 17,
    width: 14,
    height: 14,
    alignSelf: 'center',
    zIndex: 11,
  },
  clearBtn: {
    width: '100%',
    height: '100%',
  },
});

export default PhoneSignIn;
