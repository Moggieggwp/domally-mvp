import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Purchase, requestSubscription, useIAP } from 'react-native-iap';
import { useDispatch } from 'react-redux';
import { Container, Header } from 'src/components';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import { RootStackParamsList } from 'src/types/navigation';

const skus = ['user_premium', 'user_premium_year'];

type Props = {
  navigation: BottomTabNavigationProp<RootStackParamsList, 'Subscription'>;
};

const Subscription = (props: Props) => {
  const { navigation } = props;

  const {
    connected,
    products,
    subscriptions,
    getProducts,
    getSubscriptions,
    finishTransaction,
    currentPurchase,
    currentPurchaseError,
  } = useIAP();
  console.log(subscriptions);
  // useEffect(() => {
  //   console.log('connected', connected);
  //   if (connected) {
	//     getSubscriptions(skus);
  //   }
  // }, [getSubscriptions]);

  useEffect(() => {
    const checkCurrentPurchase = async (purchase?: Purchase): Promise<void> => {
    console.log('purchase', purchase);
    if (purchase) {
      const receipt = purchase.transactionReceipt;
      if (receipt)
        try {
         const ackResult = await finishTransaction(purchase);
         console.log('ackResult', ackResult);
        } catch (ackErr) {
          console.warn('ackErr', ackErr);
        }
      }
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction]);

  const dispatch = useDispatch();

  const doSubscription = async (sku) => {
    try {
      console.log(sku);
      await requestSubscription(sku);
    } catch (err) {
      console.log(err.code, err.message);
    }
  };


  return (
    <>
    <Header title={'Subscribe'} arrowBack onBack={() => navigation.goBack()} />
    <SafeAreaView style={styles.screen}>
      <Container style={styles.container}>
        <TouchableOpacity
        style={{marginBottom: 50, marginTop: 50, }}
          onPress={async () => {
            doSubscription('user_premium');
          }}
        >
          <Text style={{...TextStyles.h1,}}>Buy monthly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            doSubscription('user_premium_year');
          }}
        >
         <Text style={{...TextStyles.h1,}}>Buy yearly</Text>
        </TouchableOpacity>
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
  },
});

export default Subscription;
