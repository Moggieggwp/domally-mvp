import { useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { clearTransactionIOS, useIAP, flushFailedPurchasesCachedAsPendingAndroid, Purchase } from 'react-native-iap';
import { useDispatch } from 'react-redux';
import { acknowledgePurchase } from 'src/redux/actions/app';
import { getPremiumStatus } from 'src/redux/actions/profile';

const PurchaseModule = () => {
  const dispatch = useDispatch();

  const { finishTransaction, currentPurchase, connected } = useIAP();

  useEffect(() => {
    if (connected) {
      try {
        if (Platform.OS === 'ios') {
          clearTransactionIOS().then();
        } else {
          flushFailedPurchasesCachedAsPendingAndroid().then();
        }
      } catch (er) {
        console.error(er);
      }
    }
  }, [connected]);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  useEffect(() => {
    const checkCurrentPurchase = async (purchase?: Purchase): Promise<void> => {
      if (purchase?.transactionId || purchase?.purchaseToken)
        try {
          await dispatch(
            acknowledgePurchase({
              transactionId: Platform.OS === 'ios' ? purchase.originalTransactionIdentifierIOS : purchase.transactionId,
              transactionReceipt: purchase.transactionReceipt,
              purchaseToken: purchase.purchaseToken,
              productId: purchase.productId,
              platform: Platform.OS,
            }),
          );
          await finishTransaction(purchase);
          await dispatch(getPremiumStatus());
        } catch (ackErr) {
          console.error('ackErr', ackErr);
        }
    };
    checkCurrentPurchase(currentPurchase);
  }, [currentPurchase, finishTransaction]);

  const handleAppStateChange = async (appState: AppStateStatus) => {
    switch (appState) {
      case 'active': {
        await dispatch(getPremiumStatus());
        return;
      }
    }
  };

  return null;
};

export default PurchaseModule;
