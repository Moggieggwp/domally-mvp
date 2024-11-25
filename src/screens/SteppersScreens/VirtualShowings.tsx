import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { currentPropertyId, currentPropertyVirtualShowings } from 'src/redux/selectors/currentProperty';
import { CircleButton, Container, Page } from 'src/components';
import { numberScreensStyles as generalStyles } from 'src/styles/stepperScreens/numberScreens';
import { OPTIONS } from 'src/constants/createProperty/VirtualShowings';
import StepperTitle from 'src/components/stepper/StepperTitle';
import StepperFooter from 'src/components/stepper/StepperFooter';
import { VirtualShowings as VirtualShowingsType } from 'src/types';
import { RootStackParamsList } from 'src/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextStyles } from 'src/styles/BaseStyles';
import { saveProperty } from 'src/redux/actions/currentProperty';
import { VirtualShowings } from 'src/types';
import analytics from '@react-native-firebase/analytics';

type Props = {
  onNext: () => void;
  navigation: StackNavigationProp<RootStackParamsList>;
};

const defaultOptions: VirtualShowings = {
  faceTime: false,
  telegram: false,
  zoom: false,
  whatsApp: false,
}

const VirtualShowingsScreen = (props: Props) => {
  const { onNext } = props;
  const [options, setOptions] = useState<VirtualShowings>(defaultOptions);
  const propertyId = useSelector(currentPropertyId);
  const stateVirtualShowings = useSelector(currentPropertyVirtualShowings);

  const dispatch = useDispatch();

  useEffect(() => {
    if (stateVirtualShowings) {
      setOptions(stateVirtualShowings);
    }
  }, [stateVirtualShowings]);

  const setType = (type: keyof VirtualShowingsType) => {
    setOptions({...options, [type]: !options[type]});
  };

  const isChosenType = (type: keyof VirtualShowingsType) => options[type];

  const onSubmitHandler = async () => {
    await dispatch(saveProperty({
      id: propertyId,
      virtualShowings: options,
    }));

    const selectedOptions = Object.keys(options).filter(k => options[k])
    await analytics().logSelectItem({
      item_list_name: 'communication_channels',
      items: selectedOptions.map(item => ({
        item_name: item
      }))
     } as any);
    onNext();
  };
  
  const isValid = Object.values(options).find(v => v);

  return (
    <Page keyboardAvoidingEnabled={false}>
      <Container style={generalStyles.contentContainer}>
        <StepperTitle style={styles.title} title='Virtual Showings' />
        <Text style={[TextStyles.body1, styles.desc]}>
          Schedule your showings virtually, though your most desired or preferred video platforms, so you can show your property virtually and safely.
        </Text>
        <ScrollView contentContainerStyle={generalStyles.optionsWrap}>
          {OPTIONS.map((item, index) => (
            <CircleButton
              key={item.title}
              styleWrap={[generalStyles.circleButton]}
              iconStyles={generalStyles.icon}
              icon={item.icon}
              title={item.title}
              index={index}
              onPress={() => setType(item.type)}
              isActive={isChosenType(item.type)}
            />
          ))}
        </ScrollView>
      </Container>
      <StepperFooter
        onSubmit={onSubmitHandler}
        isNextBtnDisabled={!isValid}
      />
    </Page>
  );
};

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  },
  desc: {
    marginBottom: 45,
    textAlign: 'center',
    paddingHorizontal: 34,
  },
});

export default VirtualShowingsScreen;
