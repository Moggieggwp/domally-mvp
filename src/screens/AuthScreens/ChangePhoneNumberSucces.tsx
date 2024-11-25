import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import successAction from 'src/assets/img/icons/successAction.png';
import { Button, Container } from 'src/components';
import * as Routes from 'src/constants/routes';
import { TextStyles } from 'src/styles/BaseStyles';
import { RootStackParamsList } from 'src/types/navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'ChangePhoneNumberSuccess'>;
};

const ChangePhoneNumberSuccess = (props: Props) => {
  const { navigation } = props;

  return (
    <>
      <SafeAreaView style={styles.screen}>
        <Container style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.textMain}>Success</Text>
            <Text style={styles.textDescription}>Congratulations, you have changed your phone number. Enjoy our app!</Text>
            <Image source={successAction} style={styles.iconStyle} />
            <Button style={styles.buttonStyle} title='Got it' onPress={() => navigation.navigate(Routes.Profile)} />
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
    paddingTop: 32,
    paddingHorizontal: 32,
    flex: 1,
  },
  headerContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  textMain: {
    ...TextStyles.h2,
    textAlign: 'center',
    marginTop: 12,
  },
  textDescription: {
    ...TextStyles.body1,
    textAlign: 'center',
    marginTop: 12,
  },
  buttonStyle: {
    marginTop: 50,
  },
  iconStyle: {
    marginTop: 28,
  },
});

export default ChangePhoneNumberSuccess;
