import React from 'react';
import { StyleSheet, Text, View, Image, Linking, Platform } from 'react-native';
import { Button, Container, Header, Page, Preloader } from 'src/components';
import { RootStackParamsList } from 'src/types/navigation';
import { TextStyles } from 'src/styles/BaseStyles';
import Colors from 'src/constants/colors';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';

import avatarImage from 'src/assets/img/temp/user-details-avatar.png';
import Layout from 'src/constants/Layout';
import { getPropertyUser } from 'src/redux/actions/search';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { propertyUserProfileSelector } from 'src/redux/selectors/search';
import { RouteProp } from '@react-navigation/native';
import { defaultAvatarRectangle } from 'src/screens/Profile/assets';
import { CachedImage } from 'react-native-img-cache';
import { ISearchState } from 'src/types';

type UserDetailsScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'UserDetails'>;

type Props = {
  navigation: UserDetailsScreenNavigationProp;
  userId: number;
  route: RouteProp<RootStackParamsList, 'Chat'>;
};

const UserDetails = (props: Props) => {
  const { navigation, route } = props;
  const { userId } = route.params;

  const dispatch = useDispatch();
  const user = useSelector(propertyUserProfileSelector);

  useEffect(() => {
    dispatch(getPropertyUser(userId));
  }, [dispatch, userId]);

  const onCallUser = () => {
    if (!user?.isPhoneNumberDisabled && user?.phone) {
      Linking.openURL(`tel:${user.phone}`);
    }
  };

  return (
    <Page keyboardAvoidingEnabled={false} style={styles.container}>
      <Header arrowBackWhite onBack={() => navigation.goBack()} title={null} headerContainerStyles={styles.header} />
      {userId === user?.id ? <ChildUserDetailed user={user} onCallUser={onCallUser} /> : <Preloader />}
    </Page>
  );
};

interface ChildUserDetailedProps {
  onCallUser: () => void;
  user: ISearchState;
}

function ChildUserDetailed({ user, onCallUser }) {
  return (
    <>
      <View style={styles.avatarWrap}>
        {user?.avatar ? (
          Platform.OS === 'ios' ? (
            <Image
              source={{
                uri: user?.avatar,
                cache: 'reload',
              }}
              style={styles.avatar}
            />
          ) : (
            <CachedImage source={{ uri: user?.avatar }} style={styles.avatar} mutable />
          )
        ) : (
          <Image style={styles.avatar} source={defaultAvatarRectangle} />
        )}
        <LinearGradient
          colors={[Colors.userDetails.gradientColor2, Colors.userDetails.gradientColor1]}
          style={[styles.gradientBg, styles.gradientBgTop]}
          locations={[1, 0]}
          pointerEvents='none'
        />
        <LinearGradient
          colors={[Colors.userDetails.gradientColor1, Colors.userDetails.gradientColor2]}
          style={[styles.gradientBg, styles.gradientBgBottom]}
          locations={[1, 0]}
          pointerEvents='none'
        />
        <Text style={styles.name}>
          {user?.firstName} {user?.lastName}
        </Text>
      </View>
      <Container style={styles.contentContainer}>
        {!user?.isPhoneNumberDisabled && (
          <View style={styles.buttonsWrap}>
            <Button title={'Call'} style={styles.callButton} onPress={onCallUser} />
          </View>
        )}
        {user?.bio && (
          <>
            <Text style={styles.bioTitle}>My BIO</Text>
            <Text style={TextStyles.body2}>{user?.bio}</Text>
          </>
        )}
      </Container>
    </>
  );
}

React.memo(ChildUserDetailed);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'transparent',
    zIndex: 20,
    elevation: 1,
    paddingTop: Platform.OS === 'ios' ? 55 : 16,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  avatarWrap: {
    position: 'relative',
    width: '100%',
  },
  avatar: {
    minWidth: '100%',
    width: 'auto',
    height: 392,
    opacity: 1,
  },
  name: {
    ...TextStyles.h4,
    color: Colors.white,
    position: 'absolute',
    bottom: 15,
    left: 32,
  },
  gradientBg: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: Layout.getViewHeight(12),
  },
  gradientBgTop: {
    top: 0,
  },
  gradientBgBottom: {
    bottom: 0,
  },
  buttonsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    marginBottom: 16,
  },
  callButton: {
    height: 48,
  },
  bioTitle: {
    ...TextStyles.h4,
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 6,
  },
});

export default UserDetails;
