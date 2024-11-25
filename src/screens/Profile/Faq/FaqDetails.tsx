import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Container, Header } from 'src/components';
import Colors from 'src/constants/colors/Colors';
import { TextStyles } from 'src/styles/BaseStyles';
import { RootStackParamsList } from 'src/types/navigation';
import { clockIcon } from '../assets';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'FaqDetails'>;
  route: RouteProp<RootStackParamsList, 'FaqDetails'>;
};

const FaqDetails = (props: Props) => {
  const { navigation, route } = props;
  const faqItem = route.params;
  return (
    <>
      <Header title={'FAQ'} arrowBack onBack={() => navigation.goBack()} />
      <SafeAreaView style={styles.screen}>
        <Container style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={TextStyles.h2}>{faqItem.label}</Text>
            <View style={styles.clockContainer}>
              <Image source={clockIcon} />
              <Text style={styles.minReadLabel}>{`${faqItem.minsToRead} min read`}</Text>
            </View>
            <ScrollView style={styles.desciptionContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.descriptionText}>{faqItem.desciption}</Text>
            </ScrollView>
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
    paddingHorizontal: 16,
    flex: 1,
  },
  headerContainer: {
    marginTop: 16,
  },
  clockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  minReadLabel: {
    ...TextStyles.body2,
    color: Colors.darkGray,
    marginLeft: 6,
  },
  desciptionContainer: {
    marginBottom: 'auto',
  },
  descriptionText: {
    ...TextStyles.h5,
    color: '#595861',
  },
});

export default FaqDetails;
