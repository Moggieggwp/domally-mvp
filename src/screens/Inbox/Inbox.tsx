import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, AppState, AppStateStatus, Image, LayoutChangeEvent, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import BottomSheetContainer from 'reanimated-bottom-sheet';
import inboxPlaceholder from 'src/assets/img/inbox-placeholder.png';
import { BottomSheet, Button, Container, Page, Preloader, SearchInput } from 'src/components';
import Colors from 'src/constants/colors';
import Layout from 'src/constants/Layout';
import * as Routes from 'src/constants/routes';
import {
  deleteChat,
  getMyPropertyChats,
  getOtherPropertyChats,
  muteChat,
  pinChat,
  readAllMessages,
  setCurrentChat,
  unmuteChat,
  unpinChat,
} from 'src/redux/actions/inbox';
import { selectChats, selectChatsLoading } from 'src/redux/selectors/inbox';
import { isPremiumSelector, isSignedInSelector, premiumInfoSelector, profileDataSelector } from 'src/redux/selectors/profile';
import { TextStyles } from 'src/styles/BaseStyles';
import { RootStackParamsList } from 'src/types/navigation';
import * as NavigationService from 'src/services/NavigationService';
import debounce from 'lodash/debounce';
import ChatCard from './components/ChatCard';
import { useBackButtonListener } from 'src/helpers/hooks';

type Props = {
  navigation: BottomTabNavigationProp<RootStackParamsList, 'Inbox'>;
};

interface IPayload {
  id: number;
}

const ChatTypesOptions = ['My Property', 'Other Property'];

const Inbox = (props: Props) => {
  const dispatch = useDispatch();
  const { navigation } = props;

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [activeIndicatorWrapWidth, setActiveIndicatorWrapWidth] = useState(0);
  const [indicatorPosition] = useState(new Animated.Value(0));
  const editChatsRef = useRef<BottomSheetContainer>(null);
  const [showEditChats, setShowEditChats] = useState(false);
  const [showDeleteChatsConfirm, setShowDeleteChatsConfirm] = useState(false);
  const [showBottomSheetBg, setShowBottomSheetBg] = useState(false);
  const [selectedChats, setSelectedChats] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>(null);

  const isLoading = useSelector(selectChatsLoading);
  const isSignedIn = useSelector(isSignedInSelector);
  const isPremium = useSelector(isPremiumSelector);

  const isFocused = useIsFocused();
  const backListener = useBackButtonListener();

  const chats = useSelector(selectChats);

  const snapPointsEditChats = [213, 90, 0];
  const isFirstTabActive = activeTabIndex === 0;

  if (!isSignedIn) {
    navigation.navigate(Routes.SignIn, {});
  }

  if (!isPremium) {
    navigation.navigate(Routes.Subscription);
  }

  useEffect(() => {
    if ((isFocused || !isLoading) && isSignedIn) {
      dispatch(getOtherPropertyChats());
      dispatch(getMyPropertyChats());
    }
    AppState.addEventListener('change', onUpdateChatList);
    return () => AppState.removeEventListener('change', onUpdateChatList);
  }, [isFocused]);

  const onUpdateChatList = (appState: AppStateStatus) => {
    if (appState === 'active') {
      dispatch(getOtherPropertyChats());
      dispatch(getMyPropertyChats());
    }
  };

  useEffect(() => {
    const offset = activeIndicatorWrapWidth / 2;
    const duration = 300;
    const v = isFirstTabActive ? 0 : offset;

    Animated.timing(indicatorPosition, {
      toValue: v,
      duration: duration,
      useNativeDriver: false,
    }).start();
  }, [activeIndicatorWrapWidth, indicatorPosition, isFirstTabActive]);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setActiveIndicatorWrapWidth(width);
  };

  const onEditChatsClose = useCallback(() => {
    if (isSignedIn) {
      setShowEditChats(false);
      setShowBottomSheetBg(false);
      setShowDeleteChatsConfirm(false);
      setSelectedChats([]);
      dispatch(getOtherPropertyChats());
      dispatch(getMyPropertyChats());
    }
  }, []);

  const showEditChatsBottomSheet = () => {
    setShowEditChats(true);
    editChatsRef.current.snapTo(1);
  };

  const hideEditChatsBottomSheet = useCallback(() => {
    onEditChatsClose();
    editChatsRef.current?.snapTo(2);
  }, [onEditChatsClose]);

  useFocusEffect(
    useCallback(() => {
      return () => hideEditChatsBottomSheet();
    }, [hideEditChatsBottomSheet]),
  );

  const onDeleteSelectedChats = () => {
    setShowBottomSheetBg(true);
    setShowDeleteChatsConfirm(true);
    editChatsRef.current.snapTo(0);
  };

  const onDeleteSelectedChatsConfirm = () => {
    // add delete selected chats action
    const chats = selectedChats.map((c) => parseInt(c, 10));

    dispatch(deleteChat(chats));
    hideEditChatsBottomSheet();
  };

  const onReadAllSelectedChats = () => {
    // add read selected chats action
    const chats = selectedChats.map((c) => parseInt(c, 10));
    dispatch(readAllMessages(chats));
    hideEditChatsBottomSheet();
  };

  const changeActiveTabIndex = (index: number) => {
    setActiveTabIndex(index);
    hideEditChatsBottomSheet();
  };

  const chatContainer = [chats.my, chats.other];
  const displayDivider = showDeleteChatsConfirm ? 'flex' : 'none';
  const noSelectedChats = selectedChats.length === 0;
  const buttonOpacity = noSelectedChats ? 0.5 : 1;

  const updateSelectedChats = useCallback(
    (chatId: string) => {
      const chatIdIndex = selectedChats.indexOf(chatId);
      if (chatIdIndex === -1) {
        const updatedSelectedChats = [...selectedChats, chatId];
        setSelectedChats(updatedSelectedChats);
      } else {
        const updatedSelectedChats = selectedChats.filter((c) => c !== chatId);
        setSelectedChats(updatedSelectedChats);
      }
    },
    [selectedChats],
  );

  const handleSearch = debounce(async (value: string) => {
    if (isSignedIn) {
      await dispatch(getOtherPropertyChats(value));
      await dispatch(getMyPropertyChats(value));
      setSearchValue(value);
    }
  }, 100);

  const handleDelete = (input: number) => {
    dispatch(deleteChat([input]));
  };

  const handlePin = (input: IPayload) => {
    dispatch(pinChat(input));
  };
  const handleUnpin = (input: IPayload) => {
    dispatch(unpinChat(input));
  };

  const handleMute = (input: IPayload) => {
    dispatch(muteChat(input));
  };
  const handleUnMute = (input: IPayload) => {
    dispatch(unmuteChat(input));
  };

  const renderPlaceholder = useCallback(() => {
    const isSearchMode = searchValue?.trim().length > 0;
    return (
      <View style={styles.placeholder}>
        <Image source={inboxPlaceholder} style={styles.placeholderImage} />
        <Text style={[TextStyles.h2, styles.placeholderTitle]}>
          {isSearchMode ? `We couldn\'t find a match for "${searchValue}"` : 'You don’t have any messages yet!'}
        </Text>
        {!isSearchMode ? (
          <Text style={TextStyles.body1}>
            <Text onPress={() => NavigationService.navigate(Routes.Search, { screen: Routes.Search })} style={styles.link}>
              Start browsing
            </Text>{' '}
            or{' '}
            <Text onPress={() => NavigationService.navigate(Routes.Publish, { screen: Routes.CreatePropertyGoal })} style={styles.link}>
              Post new ad
            </Text>
          </Text>
        ) : (
          <Text style={TextStyles.body1}>Please try another search</Text>
        )}
      </View>
    );
  }, [searchValue]);

  return (
    <Page keyboardAvoidingEnabled={false} style={styles.container}>
      {/* {isLoading && <Preloader />} // TODO: check if need loader on this page */}
      <Container style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={TextStyles.h3}>Chats</Text>
          {chatContainer[activeTabIndex]?.length > 0 && (
            <TouchableOpacity style={styles.editBtn} onPress={showEditChats ? hideEditChatsBottomSheet : showEditChatsBottomSheet}>
              <Text style={[TextStyles.textBtn, styles.editBtnTitle]}>Select</Text>
            </TouchableOpacity>
          )}
        </View>
        <SearchInput styleWrap={styles.searchWrap} onChange={handleSearch} placeholder='Search' />
        <View style={styles.propertyTypeTabContainer}>
          {ChatTypesOptions.map((item) => {
            const activeTab = item === ChatTypesOptions[activeTabIndex];
            return (
              <TouchableOpacity key={item} onPress={() => changeActiveTabIndex(ChatTypesOptions.findIndex((x) => x === item))} style={styles.propertyTypeTabItem}>
                <Text style={[activeTab ? styles.activePropertyTypeTabText : styles.inactivePropertyTypeTabText]}>{item}</Text>
                <View style={activeTab ? styles.activePropertyTypeTabLine : styles.inactivePropertyTypeTabLine} />
              </TouchableOpacity>
            );
          })}
        </View>
        {/* <View style={styles.tabsLinks}>
          <Button onPress={() => changeActiveTabIndex(0)} style={styles.tabsLink} isGhost>
            <Text style={[TextStyles.thinBody, isFirstTabActive ? { color: Colors.primaryBlack } : null]}>My Property</Text>
          </Button>
          <Button onPress={() => changeActiveTabIndex(1)} style={styles.tabsLink} isGhost>
            <Text style={[TextStyles.thinBody, !isFirstTabActive ? { color: Colors.primaryBlack } : null]}>Other Property</Text>
          </Button>
        </View>
        <View style={styles.activeIndicatorWrap} onLayout={onLayout}>
          <Animated.View style={[styles.activeIndicator, { transform: [{ translateX: indicatorPosition }] }]} />
        </View> */}
      </Container>
      <View style={styles.tabsItems}>
        {chatContainer[activeTabIndex]?.length > 0 ? (
          <ScrollView style={styles.tab}>
            {chatContainer[activeTabIndex].map((c) => {
              const onPress = () => navigation.navigate(Routes.Chat, { propertyId: c.propertyId, userId: c.userId });

              return (
                <ChatCard
                  showCheckbox={showEditChats}
                  key={`${c.propertyId}-${c.userId}`}
                  id={`${c.id}`}
                  name={`${c.opponent?.firstName || ''} ${c.opponent?.lastName || ''}`}
                  propertyLocation={c.property?.address}
                  avatarUrl={c.opponent?.avatar}
                  onPress={onPress}
                  pinned={c.configuration?.pinned}
                  muted={c.configuration?.muted}
                  onCheckboxChangeCb={updateSelectedChats}
                  handleDelete={() => handleDelete(c.id)}
                  handlePin={() => handlePin({ id: c.id })}
                  handleUnpin={() => handleUnpin({ id: c.id })}
                  handleMute={() => handleMute({ id: c.id })}
                  handleUnMute={() => handleUnMute({ id: c.id })}
                  lastMessageTime={c.lastMessageTime}
                  unreaded={c.unreaded}
                />
              );
            })}
          </ScrollView>
        ) : (
          renderPlaceholder()
        )}
      </View>

      <BottomSheet
        initialSnap={2}
        sheetRef={editChatsRef}
        onClose={onEditChatsClose}
        isActive={showEditChats}
        snapPoints={snapPointsEditChats}
        containerStyle={styles.editChatsSheetContainer}
        childrenContainerStyle={styles.editChatsSheetChildrenContainer}
        onOutsidePress={hideEditChatsBottomSheet}
        dividerStyle={{ display: displayDivider }}
        showBg={showBottomSheetBg}
      >
        {!showDeleteChatsConfirm ? (
          <View style={styles.editChatsButtons}>
            <TouchableOpacity onPress={onReadAllSelectedChats} disabled={noSelectedChats} style={{ opacity: buttonOpacity }}>
              <Text style={[styles.chatsSheetButtonText, { color: Colors.primaryBlue }]}>Read All</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDeleteSelectedChats} disabled={noSelectedChats} style={{ opacity: buttonOpacity }}>
              <Text style={[styles.chatsSheetButtonText, { color: Colors.red }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.deleteChatConfirmHeading}>
              <Text style={TextStyles.h5}>{`Do you want to delete chat with ${selectedChats.length > 1 ? `${selectedChats.length} people` : 'this person'}?`}</Text>
            </View>
            <View style={styles.deleteChatConfirmButtonsContainer}>
              <TouchableOpacity onPress={onDeleteSelectedChatsConfirm}>
                <Text style={{ ...TextStyles.btnTitle, color: Colors.red }}>Delete</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={hideEditChatsBottomSheet} style={styles.deleteChatCancelButton}>
              <Text style={{ ...TextStyles.btnTitle, color: Colors.darkGray }}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </BottomSheet>
    </Page>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 54 : 16,
    paddingBottom: 16,
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 14,
  },
  editBtn: {
    position: 'absolute',
    width: 'auto',
    height: 'auto',
    right: 0,
    padding: 0,
    flexDirection: 'column',
  },
  editBtnTitle: {
    color: Colors.primaryBlue,
  },
  searchWrap: {
    marginBottom: 16,
  },
  tabs: {
    width: '100%',
    flex: 1,
  },
  tabsLinks: {
    width: '100%',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabsLink: {
    flexBasis: '50%',
    flexShrink: 0,
    flexGrow: 1,
    height: 'auto',
    width: 'auto',
    borderWidth: 1,
  },
  activeIndicatorWrap: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 8,
    backgroundColor: Colors.primaryBlack01,
    borderRadius: 8,
  },
  activeIndicator: {
    position: 'absolute',
    width: '50%',
    height: 8,
    borderRadius: 8,
    backgroundColor: Colors.primaryBlack,
  },
  tabsItems: {
    marginTop: 22,
    width: '100%',
    flex: 1,
  },
  tab: {
    width: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 48,
  },
  placeholderImage: {
    width: Layout.getViewWidth(49.6),
    height: Layout.getViewWidth(45),
    marginBottom: 20,
  },
  placeholderTitle: {
    marginBottom: 12,
    textAlign: 'center',
    maxWidth: 320,
  },

  editChatsSheetContainer: {
    height: 'auto',
    // marginTop: 0,
    paddingTop: 25,
    paddingBottom: 44,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  editChatsSheetChildrenContainer: {
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  editChatsButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatsSheetButtonText: {
    ...TextStyles.textBtn,
    lineHeight: 21,
  },
  deleteChatConfirmHeading: {
    paddingBottom: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
    width: Layout.window.width,
    marginLeft: -24,
  },
  deleteChatConfirmButtonsContainer: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  deleteChatCancelButton: {
    marginTop: 24,
    alignSelf: 'center',
  },
  link: {
    textDecorationLine: 'underline',
  },

  propertyTypeTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  propertyTypeTabItem: {
    width: '50%',
    alignItems: 'center',
  },
  activePropertyTypeTabText: {
    ...TextStyles.h6,
    fontWeight: '400',
    color: Colors.primaryBlack,
  },
  activePropertyTypeTabLine: {
    marginTop: 8,
    height: 6,
    width: '100%',
    backgroundColor: Colors.primaryBlack,
  },
  inactivePropertyTypeTabText: {
    ...TextStyles.h6,
    fontWeight: '400',
    fontFamily: 'Gilroy-Regular',
    color: Colors.defaultText,
  },
  inactivePropertyTypeTabLine: {
    marginTop: 8,
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(27, 30, 37, 0.1)',
  },
});

export default Inbox;
