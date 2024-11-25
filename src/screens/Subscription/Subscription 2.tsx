import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProrationModesAndroid, useIAP } from 'react-native-iap';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useDispatch, useSelector } from 'react-redux';
import CheckIcon from 'src/assets/img/icons/circle_check.svg';
import { Button, Container, Header, Preloader } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import * as Routes from 'src/constants/routes';
import { getPremiumStatus } from 'src/redux/actions/profile';
import { isPremiumSelector, premiumInfoSelector, profileDataSelector } from 'src/redux/selectors/profile';
import { TextStyles } from 'src/styles/BaseStyles';
import { RootStackParamsList } from 'src/types/navigation';
import products from './products';
import { getImageBadge, getSubscriptionPeriod } from './selectors';

const skus = ['user_premium', 'user_premium_year'];

type Props = {
  navigation: BottomTabNavigationProp<RootStackParamsList, 'Subscription'>;
};

const Subscription = (props: Props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const selectedProduct = products[activeSlideIndex];
  const profile = useSelector(profileDataSelector);
  const premiumInfo = useSelector(premiumInfoSelector);
  const isPremium = useSelector(isPremiumSelector);

  const { connected, requestSubscription, subscriptions, getSubscriptions } = useIAP();

  useEffect(() => {
    dispatch(getPremiumStatus());
  }, []);

  useEffect(() => {
    if (connected) {
      try {
        getSubscriptions(skus);
      } catch (er) {
        console.error(er);
      }
    }
  }, [getSubscriptions, connected]);

  const doSubscription = async (productId) => {
    try {
      setIsLoading(true);
      if (Platform.OS === 'ios') {
        await requestSubscription(productId, false);
      } else {
        await requestSubscription(
          productId,
          null,
          isPremium ? premiumInfo.purchaseToken : null,
          ProrationModesAndroid.IMMEDIATE_WITH_TIME_PRORATION,
          profile.id.toString(),
          profile.id.toString(),
        );
      }
    } finally {
      setIsLoading(false);
      navigation.goBack();
    }
  };

  if (isLoading || !subscriptions || subscriptions?.length === 0) {
    return <Preloader />;
  }

  const { width } = Dimensions.get('window');
  const itemWidth = width * 0.85;

  const renderBuyButton = () => {
    if (!premiumInfo || !isPremium) {
      return <Button style={styles.btn} title={'Buy'} onPress={() => doSubscription(selectedProduct.productId)} />;
    }

    if (isPremium && selectedProduct.productId === premiumInfo.productId) {
      return <Button style={styles.btn} title={'Subscribed'} disabled />;
    } else {
      return <Button style={styles.btn} title={'Change to this'} onPress={() => doSubscription(selectedProduct.productId)} />;
    }
  };

  return (
    <>
      <Header title={'Premium'} arrowBack onBack={() => (isPremium ? navigation.goBack() : navigation.navigate(Routes.Profile))} />
      <SafeAreaView style={styles.screen}>
        <Container style={styles.container}>
          {subscriptions?.length > 0 && (
            <>
              <Carousel
                data={products}
                activeSlideAlignment={'start'}
                onSnapToItem={(index) => setActiveSlideIndex(index)}
                renderItem={({ item }) => {
                  const iappProduct = subscriptions.find((x) => x.productId === item.productId);

                  return (
                    <TouchableOpacity key={item.productId} style={styles.card} onPress={() => doSubscription(item.productId)}>
                      <Image source={getImageBadge(item.productId)} style={styles.imagePlaceholder} />

                      <View style={styles.cardContent}>
                        <View style={styles.descriptionContainer}>
                          <Text style={styles.title}>{item.title}</Text>
                          <View style={styles.priceContainer}>
                            <Text style={styles.currency}>{iappProduct.currency}</Text>
                            <Text style={styles.price}> {iappProduct.price}</Text>
                            <Text style={styles.period}>/{getSubscriptionPeriod(iappProduct)}</Text>
                          </View>
                        </View>
                        <View style={styles.featuresContent}>
                          {item.features.map((feature, index) => (
                            <View key={index} style={styles.features}>
                              <CheckIcon />
                              <Text style={styles.featureTitle}>{feature}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                sliderWidth={width}
                itemWidth={itemWidth}
                enableMomentum={false}
                decelerationRate={'fast'}
              />
              <Pagination
                dotsLength={products.length}
                activeDotIndex={activeSlideIndex}
                dotStyle={styles.activeDot}
                inactiveDotStyle={styles.inactiveDot}
                inactiveDotScale={1}
              />
            </>
          )}
          {renderBuyButton()}
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
  card: {
    width: '100%',
    backgroundColor: Colors.white,
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowRadius: 15,
    shadowColor: Platform.OS === 'ios' ? Colors.shadowColor : 'rgb(220, 220, 220)',
    shadowOpacity: 1,
    borderRadius: 16,
    elevation: 15,
    
  },
  cardContent: {
    padding: 28,
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1FA',
    paddingBottom: 18,
  },
  featuresContent: {
    paddingTop: 16,
  },
  features: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    ...TextStyles.h2,
  },
  featureTitle: {
    ...TextStyles.body2,
    marginLeft: 10,
  },
  imagePlaceholder: {
    height: 180,
    width: '100%',
    borderRadius: 16,
  },
  activeDot: {
    height: 6,
    borderRadius: 5,
    backgroundColor: Colors.primaryBlue,
    width: 21,
  },
  inactiveDot: {
    opacity: 0.2,
    width: 6,
  },
  btn: {
    marginBottom: Layout.isMediumDevice ? 20 : 0,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  currency: {
    ...TextStyles.h6,
    color: '#7B7D89',
    fontWeight: '400',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  price: {
    ...TextStyles.h1,
    color: Colors.primaryBlue,
  },
  period: {
    ...TextStyles.h6,
    color: '#7B7D89',
    fontWeight: '400',
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
});

export default Subscription;
function dispatch(arg0: (dispatch: import('redux').Dispatch<import('redux').AnyAction>) => Promise<void>) {
  throw new Error('Function not implemented.');
}
