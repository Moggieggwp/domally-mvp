import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, StyleSheet, Platform, Text, View } from 'react-native';
import AppleIcon from 'src/assets/img/icons/apple-icon.svg';
import FacebookIcon from 'src/assets/img/icons/facebook-icon.svg';
import GoogleIcon from 'src/assets/img/icons/google-icon.svg';
import { Button, Container, Logo, Page } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import * as Routes from 'src/constants/routes';
import { useBackButtonListener } from 'src/helpers/hooks';
import * as NavigationService from 'src/services/NavigationService';
import BaseStyles, { TextStyles } from 'src/styles/BaseStyles';
import { RootStackParamsList } from 'src/types/navigation';
import { getIsMainOnboardCompleted } from 'src/utils/storage';

const bgImagePath = require('src/assets/img/signIn-bg.png');
const bgSmallImagePath = require('src/assets/img/signIn-bg-small.png');

type Props = {
  navigation: StackNavigationProp<RootStackParamsList>;
  route: RouteProp<RootStackParamsList, 'SignIn'>;
};

const SignIn = (props: Props) => {
  const { navigation, route } = props;
  const bg = Platform.OS === 'ios' ? (Layout.isMediumDevice ? bgSmallImagePath : bgImagePath) : bgSmallImagePath;
  const skip = async () => {
    const isOnboarded = await getIsMainOnboardCompleted();

    if (isOnboarded) {
      NavigationService.navigate(Routes.Home, { screen: Routes.Search });
    } else {
      NavigationService.navigate(Routes.ChooseGoal, {});
    }
  };

  const backListener = useBackButtonListener();

  return (
    <Page keyboardAvoidingEnabled={false} style={styles.container}>
      <View style={[styles.bgContainer]}>
        <Image style={[styles.image]} source={bg} />
        <Logo style={styles.logo} hasLabel />
      </View>
      <Container style={styles.contentContainer}>
        <View style={styles.textWrap}>
          <Text style={[TextStyles.h1, styles.title, BaseStyles.textCenter]}>Hi there!</Text>
          <Text style={[TextStyles.body1, BaseStyles.textCenter, styles.desc]}>Sign up to get acess to all Domally services</Text>
        </View>
        <View>
          {/* <View style={styles.socialBtnWrap}>
            <Button onPress={() => alert('Facebook')} style={styles.socialBtn}>
              <View style={styles.btnLabelWrap}>
                <FacebookIcon style={styles.btnIcon} />
                <Text style={[TextStyles.btnTitle, TextStyles.body2, { color: Colors.white }]}>Facebook</Text>
              </View>
            </Button>
            <Button onPress={() => alert('Google')} style={[styles.socialBtn, styles.borderedBtn]} isGhost>
              <View style={styles.btnLabelWrap}>
                <GoogleIcon style={styles.btnIcon} />
                <Text style={[TextStyles.btnTitle, TextStyles.body2, { color: Colors.primaryBlack }]}>Google</Text>
              </View>
            </Button>
          </View>

          <View style={styles.dividerWrap}>
            <View style={styles.divider} />
            <Text style={[TextStyles.body2]}>or</Text>
            <View style={styles.divider} />
          </View> */}

          <View style={styles.signupBtnWrap}>
            <Button
              onPress={() => navigation.navigate(Routes.PhoneSignIn, route.params)}
              style={[styles.borderedBtn, styles.phone]}
              titleStyles={[TextStyles.body2, { color: Colors.primaryBlack }]}
              title='Phone number'
              isGhost
            />
            {/* <Button onPress={() => alert('Apple sign in')} style={styles.appleBtn}>
              <View style={styles.btnLabelWrap}>
                <AppleIcon style={styles.appleIcon} />
                <Text style={[TextStyles.btnTitle, TextStyles.body2, { color: Colors.white }]}>Sign in with Apple</Text>
              </View>
            </Button> */}
            <Button onPress={skip} titleStyles={styles.skipBtn} title='Skip for now' isGhost />
          </View>
        </View>
      </Container>
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  bgContainer: {
    position: 'relative',
    top: 0,
    width: '100%',
    height: Layout.getViewHeight(45),
    marginBottom: Layout.isMediumDevice ? 15 : 35,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    overflow: 'visible',
    top: 0,
  },
  logo: {
    position: 'absolute',
    alignSelf: 'center',
    top: Platform.OS === 'ios' ? Layout.getViewHeight(8) : 16,
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
  },
  textWrap: {
    marginBottom: Layout.isMediumDevice ? 16 : 36,
  },
  title: {
    marginBottom: 10,
  },
  desc: {
    width: '100%',
  },
  socialBtnWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  socialBtn: {
    width: '48.5%',
    height: 44,
  },
  borderedBtn: {
    borderWidth: 1,
    borderColor: Colors.typography.body2,
  },
  btnLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  dividerWrap: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  divider: {
    height: 1,
    width: '45%',
    backgroundColor: Colors.gray,
    borderRadius: 100,
  },
  signupBtnWrap: {
    width: '100%',
  },
  phone: {
    marginBottom: 9,
    height: 44,
  },
  appleBtn: {
    backgroundColor: Colors.primaryBlack,
    marginBottom: Platform.OS === 'ios' ? (Layout.isMediumDevice ? 10 : 60) : Layout.isMediumDevice ? '10%' : '10%',
    height: 44,
  },
  appleIcon: {
    height: 20,
    width: 17,
    marginRight: 8,
  },
  skipBtn: {
    color: Colors.button.ghostBtnColor,
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21,
  },
});

export default SignIn;
