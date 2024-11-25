import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { ChooseActionCard, Container, Page, Button } from 'src/components';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomSheet from 'reanimated-bottom-sheet';
import { partialSearchClear, updateSearchData, updateSearchFilter } from 'src/redux/actions/search';
import { updateCurrentProperty } from 'src/redux/actions/currentProperty';
import { isOnboardingBuyFlow } from 'src/redux/selectors/app';
import TextStyles from 'src/styles/Typography';
import * as Routes from 'src/constants/routes';
import Colors from 'src/constants/colors';
import { OPTIONS, PropertyOption } from 'src/constants/search/PropertyTypesOptions';
import Layout from 'src/constants/Layout';
import { getLocation } from 'src/services/Geolocation';
import { useIsFocused } from '@react-navigation/core';
import { searchSelector } from 'src/redux/selectors/search';

type Props = {
  navigation: StackNavigationProp<RootStackParamsList, 'ChoosePropertyType'>;
};

const ChoosePropertyType = (props: Props) => {
  const { navigation } = props;
  const [activeIndex, setIndex] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [sheetMessage, setSheetMessage] = useState<PropertyOption>(null);
  const isSearchFlow = useSelector(isOnboardingBuyFlow);

  const [bottomSheetHeight, setBottomSheetHeight] = useState(213);

  const stateSearch = useSelector(searchSelector);

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const sheetRef = React.useRef<BottomSheet>(null);

  useEffect(() => {
    if (!isFocused) return;
    clearPreviousData();
  }, [isFocused]);

  const clearPreviousData = () => {
    dispatch(partialSearchClear({
      action: stateSearch?.searchData?.query?.action,
      location: stateSearch?.searchData?.query?.location,
    }));

    dispatch(updateCurrentProperty({
      detailedType: undefined,
    }));
  };

  const onSubmit = async () => {
    const propertyType = OPTIONS[activeIndex].type;

    if (!isSearchFlow) {
      dispatch(updateCurrentProperty({
        type: propertyType,
      }));
    }

    dispatch(updateSearchFilter({ type: propertyType }, false));

    setLoading(true);
    const location = await getLocation();
    setLoading(false);

    if (location) {
      if (isSearchFlow) {
        dispatch(updateSearchFilter({ location: {
          city: location.city,
          coords: location.coords,
          address: null,
        }}, false));
      } else {
        dispatch(updateCurrentProperty({
          location: {
            city: location.city,
            coords: location.coords,
            address: null,
          },
        }));
      }
    }

    navigation.navigate(Routes.ChooseLocation);
  };

  const onInfoPress = (index: number) => {
    setSheetMessage(OPTIONS[index]);
    sheetRef.current.snapTo(0);
  };

  const renderSheetContent = (): ReactNode => {
    if (!sheetMessage) return null;

    return (
      <View style={styles.bottomSheet} onLayout={(event) => setBottomSheetHeight(event.nativeEvent.layout.height)}>
        <View style={styles.divider} />
        <View style={styles.textWrap}>
          <Text style={[TextStyles.h3, styles.sheetTitle]}>{sheetMessage.sheetMessage.title}</Text>
          <Text style={[TextStyles.body1, styles.desc]}>{sheetMessage.sheetMessage.desc}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Page
        onBack={() => navigation.goBack()}
        keyboardAvoidingEnabled={false}
        isLoading={isLoading}
        style={styles.container}
      >
        <Container style={styles.contentContainer}>
          <Text style={[TextStyles.h2, styles.title]}>Please, select a property type</Text>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.optionsWrap}>
            {OPTIONS.map((item, index) => (
              <ChooseActionCard
                key={item.type}
                style={styles.card}
                iconUrl={item.iconUrl}
                title={item.title}
                onPress={() => setIndex(index)}
                index={index}
                isActive={activeIndex === index}
                onInfoPress={onInfoPress}
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
      <BottomSheet
        ref={sheetRef}
        snapPoints={[bottomSheetHeight, -5]}
        initialSnap={1}
        borderRadius={0}
        renderContent={renderSheetContent}
      />
    </>
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
  bottomSheet: {
    alignItems: 'center',
    overflow: 'visible',
    height: 'auto',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 32,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 5,
    shadowColor: 'rgba(14, 20, 56, 0.04)',
    shadowOpacity: 1,
    marginTop: 15,
    paddingBottom: 40,
  },
  divider: {
    width: 32,
    height: 4,
    backgroundColor: Colors.darkGray,
    opacity: 0.6,
    borderRadius: 64,
    alignSelf: 'center',
    marginTop: 10,
  },
  textWrap: {
    marginTop: 12,
    textAlign: 'center',
  },
  sheetTitle: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  desc: {
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 311,
  },
});

export default ChoosePropertyType;
