import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Linking, AppState, AppStateStatus, Keyboard, Platform } from 'react-native';
import { BottomSheet, Header, Page, Preloader } from 'src/components';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from 'src/types/navigation';
import { GiftedChat, IMessage, Send, InputToolbar, Composer } from 'react-native-gifted-chat';
import Layout from 'src/constants/Layout';
import Colors from 'src/constants/colors';
import { TextStyles } from 'src/styles/BaseStyles';
import BottomSheetContainer from 'reanimated-bottom-sheet';
import * as Routes from 'src/constants/routes';
import ScheduleTourBottomSheet from '../components/ScheduleTourBottomSheet';
import { RouteProp } from '@react-navigation/native';
import ChatMessage from '../components/ChatMessage';
import ChatPlaceholder from '../components/ChatPlaceholder';
import ChatFooter from '../components/ChatFooter';
import DeviceInfo from 'react-native-device-info';
import * as NavigationService from 'src/services/NavigationService';

import ChatIcon from 'src/assets/img/icons/send-message-icon.svg';
import MoreIcon from 'src/assets/img/icons/more-icon.svg';
import PhoneIcon from 'src/assets/img/icons/phone-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearChatMessages,
  clearCurrentChat,
  getChat,
  getChatMessages,
  readAllMessages,
  reloadChatMessagesOnForeground,
  sendChatClaim,
  setMessage,
} from 'src/redux/actions/inbox';
import Websocket from 'src/services/Websocket';
import { getChatMessage, selectChatMessageLoading, selectCurrentChat, selectPendingChatMessage } from 'src/redux/selectors/inbox';
import { profileDataSelector } from 'src/redux/selectors/profile';
import { ScheduleTourData, TourType } from 'src/types/chat';
import { Property } from 'src/types';
import { getCorrectCurrencyMeasure } from 'src/utils/metricsHelper';
import { CURRENCY_BUTTONS } from 'src/constants/MeasureButtons';
import moment from 'moment';
import priceFormatter from 'src/helpers/priceFormatter';

import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamsList, 'Chat'>;

type Props = {
  navigation: ChatScreenNavigationProp;
  route: RouteProp<RootStackParamsList, 'Chat'>;
};

const renderInputToolbar = (p: InputToolbar['props']) => {
  return <InputToolbar {...p} containerStyle={styles.inputToolbar} />;
};

const renderSend = (p: Send['props']) => (
  <Send {...p} containerStyle={styles.sendBtn}>
    <ChatIcon />
  </Send>
);

const headerOptions = (onOptionsPress: () => void, phoneAvailable: boolean, onCall: () => void) => (
  <View style={styles.options}>
    {phoneAvailable && (
      <TouchableOpacity style={styles.phoneButton} onPress={onCall}>
        <PhoneIcon width={24} height={24} />
      </TouchableOpacity>
    )}
    {onOptionsPress && (
      <TouchableOpacity style={styles.moreButton} onPress={onOptionsPress}>
        <MoreIcon width={24} height={24} />
      </TouchableOpacity>
    )}
  </View>
);

const reportOptions = ['This is spam', 'Promotes violence', 'Offensive content', 'Child nudity', 'Copyright', 'Endangers life'];

const notch = DeviceInfo.hasNotch();

const Chat = (props: Props) => {
  const { route, navigation } = props;
  const { userId, propertyId, scheduleTour, onGoBack } = route.params;

  const dispatch = useDispatch();

  const userData = useSelector(profileDataSelector);
  const currentChat = useSelector(selectCurrentChat);

  const mappedMessage: IMessage[] = useSelector(getChatMessage);
  const pendingMessages: IMessage[] = useSelector(selectPendingChatMessage);
  const isLoading = useSelector(selectChatMessageLoading);

  const messages = [...pendingMessages, ...mappedMessage];

  const [showScheduleTour, setShowScheduleTour] = useState(false);
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const [showReportOptions, setShowReportOptions] = useState(false);
  const [scheduleTourData, setScheduleTourData] = useState<ScheduleTourData>(null);

  const senderId = userData.id;

  const snapPointsMenu = [213, -5];
  const snapPointsReports = [390, -5];

  const moreMenuSheetRef = useRef<BottomSheetContainer>(null);
  const complainSheetRef = useRef<BottomSheetContainer>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      AndroidKeyboardAdjust.setAdjustResize();
      return () => AndroidKeyboardAdjust.setAdjustPan();
    }
  }, []);

  useEffect(() => {
    dispatch(clearChatMessages());
    dispatch(getChatMessages({ propertyId, userId }));

    AppState.addEventListener('change', onUpdateMsgs);
    return () => {
      AppState.removeEventListener('change', onUpdateMsgs);
      dispatch(clearCurrentChat());
    };
  }, [propertyId, userId]);

  useEffect(() => {
    if (currentChat?.id) {
      dispatch(readAllMessages([currentChat?.id], senderId));
    } else {
      dispatch(getChat({ propertyId, userId }));
    }
  }, [dispatch, propertyId, userId, currentChat?.id]);

  const onUpdateMsgs = (appState: AppStateStatus) => {
    if (appState === 'active' && propertyId && senderId) {
      dispatch(reloadChatMessagesOnForeground({ propertyId, userId }));
    }
  };

  const onSend = useCallback(
    (msgs: IMessage[] = []) => {
      if (!msgs[0].text.trim()) {
        return;
      }
      Websocket.send({ ...msgs[0], propertyId, userId });
      dispatch(setMessage({ ...msgs[0], pending: true, userId }));
    },
    [dispatch, propertyId, userId],
  );

  useEffect(() => {
    if (scheduleTour) {
      showScheduleTourBottomSheet();
    }
  }, []);

  const showScheduleTourBottomSheet = () => {
    setShowScheduleTour(true);
  };

  const onShowMenuBottomSheet = useCallback(() => {
    Keyboard.dismiss();
    setShowMenuOptions(true);
    moreMenuSheetRef.current.snapTo(0);
  }, [showMenuOptions]);

  const hideMenuBottomSheet = () => {
    setShowMenuOptions(false);
    moreMenuSheetRef.current.snapTo(1);
  };

  const onShowComplainPress = useCallback(() => {
    setShowMenuOptions(false);
    moreMenuSheetRef.current.snapTo(1);
    setShowReportOptions(true);
    complainSheetRef.current.snapTo(0);
  }, [showReportOptions]);

  const hideComplainSheet = () => {
    setShowReportOptions(false);
    complainSheetRef.current.snapTo(1);
  };

  const handleTitlePress = () => {
    NavigationService.navigate(Routes.PropertyDetails, { propertyId: currentChat?.property?.id });
  };

  const headerPropertyInfo = (chatProperty: Property) => {
    var priceUnit = getCorrectCurrencyMeasure(chatProperty?.price);
    var currencyMeasure = CURRENCY_BUTTONS.find((s) => s.measure == priceUnit?.measure)?.symbol || '';

    return (
      <TouchableOpacity activeOpacity={1} onPress={() => handleTitlePress()} style={styles.headerPropertyInfo}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {chatProperty?.location?.address || chatProperty?.location?.city}
        </Text>
        <Text style={styles.headerInfoSize}>{`${priceFormatter(priceUnit?.value) || ' '} ${currencyMeasure}`}</Text>
      </TouchableOpacity>
    );
  };

  const handleComplainSubmit = (chatId: string | number, reason: string) => {
    dispatch(
      sendChatClaim({
        chatId,
        propertyId,
        userId,
        reason,
      }),
    );
    Alert.alert('Thanks for letting us know', 'Your feedback is important in helping us keep the Domally community safe');
    hideComplainSheet();
  };

  const onCallUser = () => {
    if (!currentChat?.opponent?.isPhoneNumberDisabled && currentChat?.opponent?.phone) {
      Linking.openURL(`tel:${currentChat.opponent.phone}`);
    }
  };

  const onPressAvatar = () => navigation.navigate(Routes.UserDetails, { userId: currentChat?.opponent.id });

  const renderComposer = (p: Composer['props']) => <Composer {...p} placeholderTextColor={Colors.darkGray} textInputStyle={[TextStyles.body2, styles.composer]} />;

  const setData = useCallback(
    (data) => {
      const times = data?.time?.split(' - ');

      const payload = {
        scheduleTourData: {
          fromDate: moment(`${data.date} ${times[0]}`).toISOString(),
          toDate: moment(`${data.date} ${times[1]}`).toISOString(),
          phone: data.phone,
          platform: data.liveChatPlatform,
          type: data.type,
          ownerId: currentChat?.property?.userId,
        },
        propertyId,
        userId,
        user: {
          _id: senderId,
        },
        text: data.type === TourType.Online ? 'User is requesting on-site tour. Review it' : 'User is requesting offline tour. Review it',
      };
      dispatch(setMessage({ ...payload, pending: true, userId }));
      Websocket.send(payload);
    },
    [dispatch, currentChat, propertyId, senderId, userId],
  );

  const onReply = useCallback(
    (data) => {
      Websocket.handleReplies({ ...data[0], propertyId, userId });
    },
    [propertyId, userId],
  );

  return (
    <Page keyboardAvoidingEnabled={false} style={styles.page}>
      {isLoading && <Preloader />}

      <Header
        title={headerPropertyInfo(currentChat?.property)}
        arrowBack
        onBack={onGoBack ? () => onGoBack() : () => navigation.goBack()}
        headerOptions={headerOptions(currentChat?.id && onShowMenuBottomSheet, !!currentChat?.opponent?.phone, onCallUser)}
        headerContainerStyles={styles.header}
        rounded
      />

      <View style={styles.chatContainer}>
        <GiftedChat
          alwaysShowSend
          showUserAvatar
          messages={messages}
          onSend={(m) => onSend(m)}
          user={{ _id: senderId }}
          renderActions={null}
          renderAccessory={null}
          keyboardShouldPersistTaps={'never'}
          renderMessage={(p) => (
            <ChatMessage
              key={'' + p.currentMessage._id}
              p={p}
              disableScheduleTour={currentChat?.property?.userId !== senderId}
              onReply={onReply}
              onPressAvatar={onPressAvatar}
              scheduleTourData={scheduleTourData}
            />
          )}
          renderSend={renderSend}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderChatEmpty={() => <ChatPlaceholder />}
          renderFooter={() => <ChatFooter disabled={currentChat?.property?.userId === senderId} onPress={showScheduleTourBottomSheet} />}
        />
      </View>

      <BottomSheet
        sheetRef={moreMenuSheetRef}
        onClose={hideMenuBottomSheet}
        isActive={showMenuOptions}
        snapPoints={snapPointsMenu}
        onOutsidePress={hideMenuBottomSheet}
        title={'Report'}
        showBg
      >
        <View style={styles.reportsSheetButtonsContainer}>
          <TouchableOpacity style={styles.reportsSheetButton} onPress={onShowComplainPress}>
            <Text style={styles.reportSheetText}>Report chat</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={hideMenuBottomSheet} style={styles.reportsCancelSheetButton}>
          <Text style={styles.reportsCancelSheetText}>Cancel</Text>
        </TouchableOpacity>
      </BottomSheet>

      <BottomSheet
        sheetRef={complainSheetRef}
        onClose={hideComplainSheet}
        isActive={showReportOptions}
        snapPoints={snapPointsReports}
        containerStyle={styles.reportsSheetContainer}
        onOutsidePress={hideComplainSheet}
        title={'Reports'}
        showBg
      >
        <View style={styles.reportsSheetButtonsContainer}>
          {reportOptions.map((o) => (
            <TouchableOpacity key={o} style={styles.reportsSheetButton} onPress={() => handleComplainSubmit(currentChat.id, o)}>
              <Text style={styles.reportSheetText}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={hideComplainSheet} style={styles.reportsCancelSheetButton}>
          <Text style={styles.reportsCancelSheetText}>Cancel</Text>
        </TouchableOpacity>
      </BottomSheet>
      <ScheduleTourBottomSheet user={userData} showScheduleTour={showScheduleTour} showScheduleTourCb={setShowScheduleTour} onSubmitCb={setData} />
    </Page>
  );
};

const styles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.defaultBg,
  },
  chatContainer: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? (notch ? 0 : 16) : 16,
  },
  header: {
    paddingBottom: 20,
  },
  headerTitle: {
    ...TextStyles.h3,
    maxWidth: Layout.getViewWidth(58),
  },
  headerInfoSize: {
    ...TextStyles.h3,
    color: Colors.primaryBlue,
    marginTop: 4,
  },

  inputToolbar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 19,
    borderWidth: 0.5,
    borderTopWidth: 0.5,
    borderTopColor: Colors.darkGray,
    borderColor: Colors.darkGray,
  },

  composer: {
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: 22,
    marginRight: 5,
    marginTop: 8,
    marginBottom: 3,
  },

  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 3,
    marginBottom: 3,
  },

  headerPropertyInfo: {
    alignItems: 'center',
  },
  options: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  phoneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    paddingHorizontal: 10,
  },
  moreButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  reportsSheetContainer: {
    height: 400,
  },
  reportsSheetHeading: {
    paddingBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    width: Layout.window.width,
    marginLeft: -24,
  },
  reportsSheetButtonsContainer: {
    alignItems: 'center',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  reportsSheetButton: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  reportsCancelSheetButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  reportsCancelSheetText: {
    ...TextStyles.h5,
    color: Colors.darkGray,
    marginBottom: 39,
  },
  reportSheetText: {
    ...TextStyles.h5,
    color: Colors.red,
  },

  scheduleTourContainer: {
    height: 'auto',
    paddingTop: 29,
    paddingHorizontal: 24,
    paddingBottom: 44,
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
  scheduleTourButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleTourBtn: {
    height: 48,
  },
  tourOptionItem: {
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
  },
  tourOptionItemTitle: {
    ...TextStyles.cardTitle2,
    marginBottom: 12,
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
});

export default Chat;
