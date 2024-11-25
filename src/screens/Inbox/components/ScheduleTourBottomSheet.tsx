import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput, Platform, Dimensions, ToastAndroid, Alert } from 'react-native';
import { BottomSheet, Button, RadioButton } from 'src/components';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import BottomSheetContainer from 'reanimated-bottom-sheet';
import PhoneInput from 'react-native-phone-number-input';
import { fontMedium } from 'src/styles/Typography';
import { compareDates, formatAMPM, getFormattedDate } from 'src/utils/dateHelper';
import DateTimePicker from '@react-native-community/datetimepicker';

import scheduleTourImage from 'src/assets/img/schedule-tour.png';
import scheduleTourSuccessImage from 'src/assets/img/schedule-tour-success.png';
import FeatureIcon from 'src/assets/img/icons/checkbox-icon-blue.svg';
import ArrowDown from 'src/assets/img/icons/arrow-down.svg';
import ArrowUp from 'src/assets/img/icons/arrow-up.svg';
import Layout from 'src/constants/Layout';
import { ScheduleTourData, TourType } from 'src/types/chat';

const ANDROID_LARGE_DEVICE_HEIGHT = 750;

type Props = {
  showScheduleTour: boolean;
  showScheduleTourCb: (show: boolean) => void;
  onSubmitCb: (data: ScheduleTourData) => void;
  user: any;
};

type SheetButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

interface ScheduleTourOption {
  id: number;
  title: string;
  description: string;
  new: boolean;
  type: TourType;
}

enum SheetStates {
  Onboarding = 'onboarding',
  Type = 'type',
  LiveChatApp = 'liveChatApp',
  PhoneNumber = 'phoneNumber',
  DateNTime = 'dateNTime',
  DateNAndroidTime = 'DateNAndroidTime',
  DateSelect = 'dateSelect',
  TimeSelect = 'timeSelect',
  Success = 'success',
}

export type IScheduleTourScreens<T> = {
  [key in SheetStates]: T;
};

const snapPointsScheduleTour = [540, 435, 336, 263, 0];

const radioItems: ScheduleTourOption[] = [
  { id: 22, title: 'In Person', description: 'Meet us at the for a pressure-free, private tour with one of our Tour Assistants.', new: false, type: TourType.Offline },
  { id: 33, title: 'Live video chat', description: 'Take a live video tour of this home from your phone, tablet, or desktop.', new: true, type: TourType.Online },
];

const featureItems = ['Free and no obligation', 'Hands off and pressure-free', 'At your own pace'];
const liveChatApps = ['FaceTime', 'Telegram', 'Zoom', 'WhatsApp'];

const ScheduleTourBottomSheet = (props: Props) => {
  const { showScheduleTour, user, showScheduleTourCb, onSubmitCb } = props;
  const scheduleTourRef = useRef<BottomSheetContainer>(null);
  const [scheduleTourOption, setScheduleTourOption] = useState(radioItems[0].type);
  const [scheduleTourLiveChatApp, setScheduleTourLiveChatApp] = useState(liveChatApps[0]);
  const [showDivider, setShowDivider] = useState(false);
  const [sheetState, setSheetState] = useState<SheetStates>(SheetStates.Onboarding);

  const [phoneInputValue, setPhoneInputValue] = useState(user?.phone || '');

  const isInputEmpty = phoneInputValue.length <= 0;
  const validationColor = !isInputEmpty ? Colors.red : Colors.primaryBlue;
  const isAndroid = Platform.OS === 'android';

  const d = new Date();
  const thirtyMinutesMS = 1000 * 60 * 30;
  const [date, setDate] = useState(d);
  const [startTime, setStartTime] = useState(d);
  const [finishTime, setFinishTime] = useState(new Date(d.getTime() + thirtyMinutesMS));
  const [visible, setVisible] = useState(true);

  const selectedDate = getFormattedDate(date);
  const selectedTime = (() => {
    return `${formatAMPM(startTime)} - ${formatAMPM(finishTime)}`;
  })();

  useEffect(() => {
    if (isAndroid) {
      if (Layout.window.height > ANDROID_LARGE_DEVICE_HEIGHT) {
        snapPointsScheduleTour[0] = Layout.window.height / 2 - 29 - 44;
      } else {
        snapPointsScheduleTour[0] = Dimensions.get('screen').height / 2 - 29 - 44;
      }
    } else {
      if (Layout.isMediumDevice) {
        snapPointsScheduleTour[0] = 485;
      } else {
        snapPointsScheduleTour[0] = 540;
      }
    }
  }, []);

  useEffect(() => {
    if (!showScheduleTour) {
      return;
    }

    switch (sheetState) {
      case SheetStates.Onboarding:
      case SheetStates.Type:
      case SheetStates.LiveChatApp:
      case SheetStates.DateSelect:
      case SheetStates.TimeSelect:
        scheduleTourRef.current.snapTo(1);
        break;

      case SheetStates.DateNTime:
        scheduleTourRef.current.snapTo(2);
        break;
      case SheetStates.DateNAndroidTime:
        setVisible(true);
        scheduleTourRef.current.snapTo(2);
        break;

      case SheetStates.Success:
        scheduleTourRef.current.snapTo(2);
        setShowDivider(true);
        break;

      case SheetStates.PhoneNumber:
        scheduleTourRef.current.snapTo(0);
        break;

      default:
        scheduleTourRef.current.snapTo(4);
        break;
    }
  }, [sheetState, showScheduleTour]);

  const hideScheduleTourBottomSheet = () => {
    showScheduleTourCb(false);
    setShowDivider(false);
    setSheetState(SheetStates.Onboarding);

    scheduleTourRef.current.snapTo(4);
  };

  const onTourTypeSelect = () => {
    if (scheduleTourOption === TourType.Offline) {
      setSheetState(SheetStates.DateNTime);
    } else {
      setSheetState(SheetStates.LiveChatApp);
    }
  };

  const onDatePickerChange = (_event, selectedDate: Date) => {
    if (!selectedDate) return;
    setDate(selectedDate);

    if (compareDates(new Date(), selectedDate) && startTime.getTime() < d.getTime()) {
      setStartTime(new Date(d.getTime()));
      setFinishTime(new Date(d.getTime() + thirtyMinutesMS));
    }

    if (isAndroid) {
      setSheetState(SheetStates.DateNTime);
    }
  };

  const onStartTimePickerChange = (_event, selectedDate: Date) => {
    if (isAndroid && _event.type === 'dismissed') {
      setSheetState(SheetStates.DateNTime);
      return;
    }

    if (!isAndroid && selectedDate) {
      setStartTime(selectedDate);
      setFinishTime(selectedDate);
    }

    if (isAndroid && _event.type === 'set') {
      const currentDate = new Date();

      if (compareDates(currentDate, date) && selectedDate.getTime() < startTime.getTime()) {
        setSheetState(SheetStates.DateNTime);
        Alert.alert('Invalid date time!'.toUpperCase(), 'Please, enter correct date!');
        return;
      }
      setVisible(false);
      setStartTime(selectedDate);
      setFinishTime(selectedDate);
      setSheetState(SheetStates.DateNAndroidTime);
    }
  };

  const onFinishTimePickerChange = (_event, selectedDate: Date) => {
    if (isAndroid && _event.type === 'dismissed') {
      setSheetState(SheetStates.DateNTime);
      return;
    }

    if (!isAndroid && selectedDate) {
      setFinishTime(selectedDate);
    }

    if (isAndroid && _event.type === 'set') {
      if (selectedDate.getTime() < startTime.getTime()) {
        setFinishTime(new Date(startTime.getTime() + thirtyMinutesMS));
        Alert.alert(
          'Invalid date!',
          'The end date of the event is set automatically! To set a different date, you can choose a time no less than the start date of the event!',
        );
      } else {
        setFinishTime(selectedDate);
      }
      setVisible(true);
      setSheetState(SheetStates.DateNTime);
    }
  };

  const onSubmit = async () => {
    const tourData: ScheduleTourData = {
      type: scheduleTourOption,
      date: selectedDate,
      time: selectedTime,
      phone: phoneInputValue,
      liveChatPlatform: scheduleTourLiveChatApp && scheduleTourLiveChatApp,
    };
    onSubmitCb(tourData);

    setSheetState(SheetStates.Success);
  };

  const SheetButton = (btnProps: SheetButtonProps) => {
    const { title, onPress, disabled } = btnProps;

    return (
      <Button disabled={disabled} style={styles.scheduleTourBtn} onPress={onPress} btnUnderlayColor={Colors.button.primaryUnderlayColor}>
        <Text style={{ ...TextStyles.btnTitle }}>{title}</Text>
      </Button>
    );
  };

  const Onboarding = () => (
    <>
      <View style={styles.scheduleTourHeading}>
        <Text style={styles.scheduleTourTitle}>Let’s help you tour</Text>
        <Image source={scheduleTourImage} style={styles.scheduleTourImage} />
      </View>
      <Text style={styles.tourFeaturesTitle}>We can meet over live video chat or at the home to let you in. Whichever you choose, your tour is:</Text>
      <View style={styles.tourFeaturesContainer}>
        {featureItems.map((item) => (
          <View key={item} style={styles.tourFeatureItem}>
            <FeatureIcon width={11} height={8} style={styles.tourFeatureItemIcon} />
            <Text style={styles.tourFeatureItemText}>{item}</Text>
          </View>
        ))}
      </View>
      <SheetButton title='Continue' onPress={() => setSheetState(SheetStates.Type)} />
    </>
  );

  const TType = () => (
    <>
      <View style={styles.scheduleTourHeading}>
        <Text style={[styles.scheduleTourTitle, Platform.OS === 'android' && Layout.window.height > ANDROID_LARGE_DEVICE_HEIGHT && styles.titleAndroid]}>
          Tour in person or over live video chat
        </Text>
        <Image source={scheduleTourImage} style={styles.scheduleTourImage} />
      </View>
      <View style={styles.tourOptionsContainer}>
        {radioItems.map((item, i) => {
          const borderStyle = { borderBottomWidth: radioItems.length - 1 === i ? 0 : 1 };
          return (
            <TouchableOpacity key={item.id} style={[styles.listItem, borderStyle]} onPress={() => setScheduleTourOption(item.type)} activeOpacity={1}>
              <>
                <View style={styles.tourOptionItemTextWrap}>
                  <View style={styles.tourOptionItemTitleWrap}>
                    <Text style={styles.listItemTitle}>{item.title}</Text>
                    {item.new && (
                      <View style={styles.tourOptionNew}>
                        <Text style={styles.tourOptionNewText}>new</Text>
                      </View>
                    )}
                  </View>
                  <Text style={TextStyles.body2}>{item.description}</Text>
                </View>
                <RadioButton
                  key={item.id}
                  index={item.id}
                  style={styles.tourOptionRadioItem}
                  checked={scheduleTourOption === item.type}
                  onChange={(id) => setScheduleTourOption(radioItems.find((item) => item.id == id)?.type)}
                />
              </>
            </TouchableOpacity>
          );
        })}
      </View>
      <SheetButton title='Continue' onPress={onTourTypeSelect} />
    </>
  );

  const LiveChatApp = () => (
    <>
      <View style={styles.scheduleTourHeading}>
        <Text style={styles.liveChatAppsTitle}>How would you like us to call you?</Text>
      </View>
      <View style={styles.liveChatAppsContainer}>
        {liveChatApps.map((item, i) => {
          const borderStyle = { borderBottomWidth: liveChatApps.length - 1 === i ? 0 : 1 };
          return (
            <TouchableOpacity key={item} style={[styles.listItem, borderStyle]} onPress={() => setScheduleTourLiveChatApp(item)} activeOpacity={1}>
              <>
                <Text style={styles.listItemTitle}>{item}</Text>
                <RadioButton
                  key={item}
                  index={item}
                  style={styles.liveChatAppRadioItem}
                  checked={scheduleTourLiveChatApp === item}
                  onChange={(app) => setScheduleTourLiveChatApp(app)}
                />
              </>
            </TouchableOpacity>
          );
        })}
      </View>
      <SheetButton title='Continue' onPress={() => setSheetState(SheetStates.PhoneNumber)} />
    </>
  );

  const PhoneNumber = useMemo(() => {
    return (
      <View>
        <View style={styles.scheduleTourHeading}>
          <Text style={{ ...TextStyles.h4 }}>{`What is your phone number of the ${scheduleTourLiveChatApp}?`}</Text>
        </View>
        <TextInput
          onSubmitEditing={() => {
            if (Platform.OS === 'android') {
              setSheetState(SheetStates.DateNTime);
            }
          }}
          style={styles.phoneInputContainer}
          value={phoneInputValue}
          keyboardType='phone-pad'
          autoFocus
          onChangeText={(text) => setPhoneInputValue(text)}
        />
        <SheetButton disabled={!phoneInputValue} title='Continue' onPress={() => setSheetState(SheetStates.DateNTime)} />
      </View>
    );
  }, [phoneInputValue, validationColor, scheduleTourLiveChatApp]);

  const DateNTime = () => (
    <>
      <View style={styles.scheduleTourHeading}>
        <Text style={{ ...TextStyles.h4 }}>Schedule tour</Text>
      </View>
      <View style={styles.dateTimeContainer}>
        <View style={styles.listItem}>
          <Text style={{ ...TextStyles.body2, color: Colors.primaryBlack }}>Date</Text>
          <TouchableOpacity style={{}} onPress={() => setSheetState(SheetStates.DateSelect)}>
            <View style={styles.dateTimeLabelWrap}>
              <Text style={[styles.listItemTitle, styles.dateTimeLabel]}>{date.toDateString()}</Text>
              <ArrowDown width={24} height={24} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.listItem, { borderBottomWidth: 0 }]}>
          <Text style={{ ...TextStyles.body2, color: Colors.primaryBlack }}>Time</Text>
          <TouchableOpacity style={{}} onPress={() => setSheetState(SheetStates.TimeSelect)}>
            <View style={styles.dateTimeLabelWrap}>
              <Text style={[styles.listItemTitle, styles.dateTimeLabel]}>{selectedTime}</Text>
              <ArrowDown width={24} height={24} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <SheetButton title='Submit' onPress={onSubmit} />
    </>
  );

  const DateSelect = useMemo(
    () => (
      <>
        <View style={[styles.scheduleTourHeading, styles.dateTimeSelectHeading]}>
          <Text style={{ ...TextStyles.h4 }}>Which day?</Text>
          <ArrowUp width={24} height={24} />
        </View>
        <View style={styles.datePickerWrap}>
          <DateTimePicker themeVariant='light' testID='datePicker' minimumDate={new Date()} value={date} mode={'date'} display='spinner' onChange={onDatePickerChange} />
        </View>
        <SheetButton title='Continue' onPress={() => setSheetState(SheetStates.DateNTime)} />
      </>
    ),
    [date],
  );

  const StartTimeSelectAndroid = useMemo(() => {
    return (
      <>
        {visible && (
          <DateTimePicker testID='startTimePicker' value={startTime} mode={'time'} display='spinner' onChange={onStartTimePickerChange} style={styles.startTimePicker} />
        )}
      </>
    );
  }, [startTime, finishTime, visible, date]);

  const FinishTimeSelectAndroid = useMemo(() => {
    return (
      <>
        <View style={[styles.scheduleTourHeading, styles.dateTimeSelectHeading]}>
          <Text style={{ ...TextStyles.h4 }}>When are you available?</Text>
          <ArrowUp width={24} height={24} />
        </View>
        <View style={styles.timePickersWrap}>
          {!visible && (
            <DateTimePicker
              testID='finishTimePicker'
              value={finishTime}
              mode={'time'}
              display='spinner'
              themeVariant='light'
              onChange={onFinishTimePickerChange}
              style={styles.finishTimePicker}
            />
          )}
        </View>
        <SheetButton title='Continue' onPress={() => setSheetState(SheetStates.DateNTime)} />
      </>
    );
  }, [finishTime, startTime, date]);

  const TimeSelectIOSChild = useMemo(() => {
    return (
      <>
        <DateTimePicker
          themeVariant='light'
          testID='startTimePicker'
          minimumDate={compareDates(date, new Date()) ? new Date(d.getTime()) : null}
          value={startTime}
          mode={'time'}
          display='spinner'
          onChange={onStartTimePickerChange}
          style={styles.startTimePicker}
        />
        <Text style={[styles.listItemTitle, styles.dateTimeLabel]}>to</Text>
        <DateTimePicker
          testID='finishTimePicker'
          minimumDate={startTime}
          value={finishTime}
          mode={'time'}
          display='spinner'
          themeVariant='light'
          onChange={onFinishTimePickerChange}
          style={styles.finishTimePicker}
        />
      </>
    );
  }, [startTime, finishTime, date]);

  const TimeSelect = useMemo(
    () => (
      <>
        <View style={[styles.scheduleTourHeading, styles.dateTimeSelectHeading]}>
          <Text style={{ ...TextStyles.h4 }}>When are you available?</Text>
          <ArrowUp width={24} height={24} />
        </View>
        <View style={styles.timePickersWrap}>{isAndroid ? StartTimeSelectAndroid : TimeSelectIOSChild}</View>
        <SheetButton title='Continue' onPress={() => setSheetState(SheetStates.DateNTime)} />
      </>
    ),
    [finishTime, startTime, StartTimeSelectAndroid, TimeSelectIOSChild],
  );

  const Success = () => (
    <View style={styles.successContainer}>
      <Image source={scheduleTourSuccessImage} style={styles.successImage} />
      <Text style={styles.successTitle}>Success</Text>
      <Text style={{ ...TextStyles.body1 }}>Your request has been sent.</Text>
      <TouchableOpacity style={styles.successButton} onPress={hideScheduleTourBottomSheet}>
        <Text style={styles.successButtonText}>Ok</Text>
      </TouchableOpacity>
    </View>
  );

  const screens: IScheduleTourScreens<JSX.Element> = {
    onboarding: <Onboarding />,
    type: <TType />,
    liveChatApp: <LiveChatApp />,
    phoneNumber: PhoneNumber,
    dateNTime: <DateNTime />,
    dateSelect: DateSelect,
    timeSelect: TimeSelect,
    DateNAndroidTime: FinishTimeSelectAndroid,
    success: <Success />,
  };

  return (
    <BottomSheet
      sheetRef={scheduleTourRef}
      onClose={() => showScheduleTourCb(false)}
      isActive={showScheduleTour}
      snapPoints={snapPointsScheduleTour}
      initialSnap={4}
      containerStyle={styles.scheduleTourContainer}
      childrenContainerStyle={styles.scheduleTourChildrenContainer}
      dividerStyle={!showDivider ? styles.hidden : null}
      onOutsidePress={hideScheduleTourBottomSheet}
      showBg
    >
      {screens[sheetState]}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
  scheduleTourContainer: {
    height: 'auto',
    paddingTop: 29,
    paddingHorizontal: 24,
    paddingBottom: 44,
    borderRadius: 30,
  },
  scheduleTourChildrenContainer: {
    paddingHorizontal: 0,
    marginTop: 0,
    paddingTop: 0,
  },
  scheduleTourHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  scheduleTourTitle: {
    ...TextStyles.h4,
    maxWidth: 180,
  },
  titleAndroid: {
    maxWidth: 250,
  },
  scheduleTourImage: {
    position: 'absolute',
    top: -17,
    right: -14,
    width: 84,
    height: 81,
  },
  tourOptionsContainer: {
    marginBottom: 18,
  },
  scheduleTourBtn: {
    height: 48,
  },
  listItem: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  tourOptionRadioItem: {
    flexShrink: 0,
    marginRight: 0,
  },
  tourOptionItemTextWrap: {
    maxWidth: '85%',
    alignItems: 'flex-start',
  },
  tourOptionItemTitleWrap: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  listItemTitle: {
    ...TextStyles.cardTitle2,
  },
  tourOptionNew: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    backgroundColor: Colors.secondaryGreen,
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  tourOptionNewText: {
    ...TextStyles.h4,
    color: Colors.white,
    fontSize: 8,
    lineHeight: 12,
    textTransform: 'uppercase',
  },

  tourFeaturesTitle: {
    ...TextStyles.body2,
    marginTop: 33,
    marginBottom: 24,
    maxWidth: 250,
  },
  tourFeaturesContainer: {
    marginBottom: 32,
  },
  tourFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tourFeatureItemIcon: {
    marginRight: 11,
  },
  tourFeatureItemText: {
    ...TextStyles.body2,
    fontFamily: fontMedium,
    color: Colors.primaryBlack,
  },

  liveChatAppsContainer: {
    marginBottom: 32,
  },
  liveChatAppsTitle: {
    ...TextStyles.h4,
    marginBottom: 4,
  },
  liveChatAppRadioItem: {
    flexShrink: 0,
    marginRight: 0,
  },

  phoneInputContainer: {
    width: '100%',
    borderColor: Colors.primaryBlue,
    borderBottomWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    marginBottom: 32,
    marginTop: 20,
    ...Platform.select({
      android: {
        color: Colors.defaultText,
      },
    }),
  },
  phoneInputTextContainer: {
    backgroundColor: 'transparent',
  },
  phoneInput: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  inputText: {
    color: Colors.primaryBlack,
    fontWeight: '400',
    lineHeight: 19,
  },
  numberInput: {
    width: '100%',
  },
  phoneCode: {
    marginRight: 6,
    marginLeft: 30,
    minWidth: 35,
  },
  inputFlagBtn: {
    width: 102,
    position: 'absolute',
    left: 0,
    zIndex: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  flagBtn: {
    position: 'relative',
    transform: [{ scaleX: 0.6 }, { scaleY: 0.6 }],
  },

  dateTimeSelectHeading: {
    justifyContent: 'space-between',
  },
  dateTimeContainer: {
    marginBottom: 50,
  },
  dateTimeLabel: {
    fontSize: 14,
    lineHeight: 18,
    marginRight: 4,
  },
  dateTimeLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  datePickerWrap: {
    position: 'relative',
    left: -24,
    width: Layout.window.width,
    height: 216,
    marginTop: 12,
    marginBottom: 35,
  },

  timePickersWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 35,
    height: 216,
  },
  startTimePicker: {
    width: 155,
  },
  finishTimePicker: {
    width: 155,
  },

  successTitle: {
    ...TextStyles.h2,
    marginBottom: 12,
  },
  successContainer: {
    alignItems: 'center',
  },
  successImage: {
    width: 114,
    height: 114,
  },
  successButton: {
    padding: 16,
    marginBottom: 32,
  },
  successButtonText: {
    ...TextStyles.h4,
    fontSize: 14,
    color: Colors.primaryBlue,
  },
});

export default ScheduleTourBottomSheet;
