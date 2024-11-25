import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import TextStyles from 'src/styles/Typography';
import { ChooseActionCard, Container, Page, Button } from 'src/components';
import Layout from 'src/constants/Layout';
import { OPTIONS } from 'src/constants/createProperty/CreatePropertyRoleOptions'
import * as Routes from 'src/constants/routes';

import { updateCurrentProperty, resetCurrentProperty } from 'src/redux/actions/currentProperty';
import { isSignedInSelector } from 'src/redux/selectors/profile';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList>;
};

const CreatePropertyGoal = (props: Props) => {
  const { navigation } = props;
  const [activeIndex, setIndex] = useState(null);
  const dispatch = useDispatch();
  const isSignIn = useSelector(isSignedInSelector);

  useEffect(() => {
    dispatch(resetCurrentProperty());
  }, []);

  const onSubmit = () => {
    const goal = OPTIONS[activeIndex].type;

    if (!isSignIn) {
      navigation.navigate(Routes.SignIn);
      return;
    }

    dispatch(updateCurrentProperty({ action: goal }));

    navigation.navigate(Routes.ChoosePropertyType);
  };

  return (
    <Page onClose={() => navigation.goBack()} keyboardAvoidingEnabled={false} style={styles.container}>
      <Container style={styles.contentContainer}>
        <View style={styles.optionsWrap}>
          <Text style={[TextStyles.h2, styles.title]}>Hello, what do you want to do?</Text>
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
        </View>
        {OPTIONS[activeIndex] ? (
          <View style={styles.btnWrap}>
            <Button title='Next' onPress={onSubmit} />
          </View>
        ) : null}
      </Container>
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? (Layout.isMediumDevice ? Layout.getViewHeight(10.7) : Layout.getViewHeight(13.2)) : Layout.getViewHeight(10.7),
  },
  contentContainer: {
    justifyContent: 'space-between',
    height: '100%',
  },
  title: {
    maxWidth: 200,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    marginTop: 8,
  },
  btnWrap: {
    marginBottom: 40,
  },
  optionsWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreatePropertyGoal;
