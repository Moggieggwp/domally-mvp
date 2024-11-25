import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import TextStyles from 'src/styles/Typography';
import { ChooseActionCard, Container, Page, Button } from 'src/components';
import Layout from 'src/constants/Layout';
import { OPTIONS } from 'src/constants/search/RoleOptions';
import * as Routes from 'src/constants/routes';
import { updateSearchFilter, clearSearch, updateSearchData } from 'src/redux/actions/search';
import { updateCurrentProperty, resetCurrentProperty } from 'src/redux/actions/currentProperty';
import { setOnboardingAction } from 'src/redux/actions/app';
import { isSignedInSelector } from 'src/redux/selectors/profile';
import { useIsFocused } from '@react-navigation/native';
import { SearchType } from 'src/types';
import { PropertyAction } from 'domally-utils/src/types';
import Colors from 'src/constants/colors';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'ChooseGoal'>;
};

const ChooseGoal = (props: Props) => {
  const { navigation } = props;
  const [activeIndex, setIndex] = useState(null);
  const dispatch = useDispatch();
  const isSignIn = useSelector(isSignedInSelector);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) return;

    dispatch(resetCurrentProperty());
    dispatch(clearSearch());
  }, [isFocused]);

  const setSearchActionForCreateFlow = (goal: PropertyAction): PropertyAction => {
    switch(goal) {
      case 'Sell':
        return 'Buy';
      case 'Rent-Out':
        return 'Rent';
      default:
        return 'Buy';
    }
  };

  const onSubmit = () => {
    const goal = OPTIONS[activeIndex].type;
    dispatch(setOnboardingAction(goal));
    const isSearchFlow = goal === 'Buy' || goal === 'Rent';

    if (!isSearchFlow && !isSignIn) {
      navigation.navigate(Routes.SignIn);
      return;
    }

    if (isSearchFlow) {
      dispatch(updateSearchFilter({ action: goal }, false));
      dispatch(updateSearchData({ searchType: SearchType.COUNT }, false));
    } else {
      dispatch(updateCurrentProperty({ action: goal }));
      dispatch(updateSearchFilter({ action: setSearchActionForCreateFlow(goal) }, false));
    }

    navigation.navigate(Routes.ChoosePropertyType);
  };

  return (
    <Page keyboardAvoidingEnabled={false} style={styles.container}>
      <Container style={styles.contentContainer}>
        <Text style={[TextStyles.h2, styles.title]}>Hello, what do you want to do?</Text>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.optionsWrap}>
          {OPTIONS.map((item, index) => (
            <ChooseActionCard
              key={item.type}
              style={styles.card}
              iconUrl={item.iconUrl}
              title={item.title}
              onPress={() => setIndex(index)}
              isActive={activeIndex === index}
            />
          ))}
        </ScrollView>
      </Container>
      {OPTIONS[activeIndex] ? (
          <View style={styles.btnWrap}>
            <Button title='Next' onPress={onSubmit} />
          </View>
        ) : null}
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: Layout.isMediumDevice ? Layout.getViewHeight(10.7) : Layout.getViewHeight(13.2),
  },
  contentContainer: {
    justifyContent: 'space-between',
    height: '100%',
  },
  title: {
    maxWidth: 200,
    marginBottom: 16,
    textAlign: 'center',
    width: '100%',
    alignSelf: 'center',
  },
  card: {
    marginTop: 8,
  },
  btnWrap: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 32,
    backgroundColor: Colors.white,
    paddingTop: 17,
    paddingBottom: Layout.isMediumDevice ? 20 : 40,
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  optionsWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: Layout.isMediumDevice ? 100 : 120,
  },
});

export default ChooseGoal;
