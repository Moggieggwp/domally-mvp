import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { Header, Preloader } from 'src/components';
import { RootStackParamsList } from 'src/types/navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'LicenseAgreement'>;
};

const LicenseAgreement = (props: Props) => {
  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader />}
      <Header title={'License agreement'} arrowBack onBack={() => navigation.goBack()} />
      <SafeAreaView style={styles.screen}>
        <WebView source={{ uri: 'https://app.termly.io/document/terms-of-use-for-ios-app/74926a8e-fb2f-46fd-969e-f431a89e06e0' }} onLoad={() => setIsLoading(false)} />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default LicenseAgreement;
