import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import arrowRight from 'src/assets/img/icons/arrowRightIcon.png';
import { Container, Header, Preloader } from 'src/components';
import Colors from 'src/constants/colors/Colors';
import Layout from 'src/constants/Layout';
import * as Routes from 'src/constants/routes';
import { fetchFaqSettings } from 'src/redux/actions/profile';
import { faqSettingsSelector, loadingSelector } from 'src/redux/selectors/profile';
import { TextStyles } from 'src/styles/BaseStyles';
import { RootStackParamsList } from 'src/types/navigation';
import { faqHeaderIcon } from '../assets';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'FAQ'>;
};

const FAQ = (props: Props) => {
  const { navigation } = props;
  const faqSettings = useSelector(faqSettingsSelector);
  const isLoading = useSelector(loadingSelector);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFaqSettings());
  }, []);

  return (
    <>
      {isLoading && <Preloader />}
      <Header title={'FAQ'} arrowBack onBack={() => navigation.goBack()} />
      <SafeAreaView style={styles.screen}>
        <Container style={styles.container}>
          <View style={styles.headerContainer}>
            <Image source={faqHeaderIcon} />
            <Text style={styles.textMain}>Hi, how can we help?</Text>
            <Text style={styles.textDescription}>Save photo and videos to your Ukraine collection.</Text>
          </View>
          <View style={styles.itemsContainer}>
            {faqSettings.map((item, index) => (
              <TouchableOpacity key={`${item.label}_${index}`} style={styles.item} onPress={() => navigation.navigate(Routes.FaqDetails, item)}>
                <View style={styles.itemIconAndDescriptionContainer}>
                  <Image source={{ uri: item.imageUrl }} style={styles.iconStyle} />
                  <Text style={styles.itemDescription}>{item.label}</Text>
                </View>
                <Image source={arrowRight} style={styles.arrowStyle} />
              </TouchableOpacity>
            ))}
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
    paddingHorizontal: 32,
    flex: 1,
  },
  headerContainer: {
    marginTop: Layout.isMediumDevice ? 0 : 32,
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
  itemsContainer: {
    marginTop: Layout.isMediumDevice ? 20 : 50,
  },
  item: {
    height: 80,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 20,
    marginBottom: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemIconAndDescriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDescription: {
    marginLeft: 10,
    width: 130,
    ...TextStyles.body3,
  },
  arrowStyle: {
    tintColor: Colors.primaryBlack,
  },
  iconStyle: {
    width: 56,
    height: 56,
  },
});

export default FAQ;
