import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { Header, Preloader } from 'src/components';
import { RootStackParamsList } from 'src/types/navigation';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'PrivacyPolicy'>;
};

const PrivacyPolicy = (props: Props) => {
  const { navigation } = props;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <Preloader />}
      <Header title={'Privacy policy'} arrowBack onBack={() => navigation.goBack()} />
      <SafeAreaView style={styles.screen}>
        <WebView source={{ uri: 'https://app.termly.io/document/privacy-policy/d1b11087-f207-43bc-a367-c580e083c5f5' }} onLoad={() => setIsLoading(false)} />
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

export default PrivacyPolicy;
