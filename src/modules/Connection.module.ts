import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';

const ConnnectionModule = () => {
  const [isShowAlert, setShowedAlert] = useState(false);

  const checkConnection = async () => {
    const state = await NetInfo.fetch();
    const { isConnected } = state;

    if (!isConnected) return;
    RNRestart.Restart();
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const { isConnected } = state;
      if (!isConnected && !isShowAlert) {
        setShowedAlert(true);
        Alert.alert('No internet connection', 'Please check your network settings or reopen the app', [
          {
            text: 'Try again',
            onPress: async () => {
              await checkConnection();
              setShowedAlert(false);
            },
          },
        ]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isShowAlert]);

  return null;
};

export default ConnnectionModule;
