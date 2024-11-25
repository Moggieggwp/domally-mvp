import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { readAllMessages, setRecivedMessage, setRecivedReplie } from 'src/redux/actions/inbox';
import { selectCurrentChat } from 'src/redux/selectors/inbox';
import { profileDataSelector } from 'src/redux/selectors/profile';
import Websocket from 'src/services/Websocket';
import Notification from 'src/services/Notification';

const WebsocketModule = () => {
  const dispatch = useDispatch();
  const currentChat = useSelector(selectCurrentChat);
  const user = useSelector(profileDataSelector);

  useEffect(() => {
    Websocket.chatUnreadedMessage = (data) => {
      const { unreaded = 0 } = data;
      Notification.setBadge(unreaded);
    };

    Websocket.recive = (data) => {
      if (user?.id !== data.senderId && currentChat && data.chat?.id === currentChat?.id) {
        dispatch(readAllMessages([data.chat?.id]));
      }
      Websocket.handleUnreadedMessage(user?.id);
      dispatch(setRecivedMessage({ ...data, currentUser: user }));
    };
    Websocket.handleUnreadedMessage(user?.id);
  }, [dispatch, currentChat, user]);

  useEffect(() => {
    Websocket.chatsReplies = (data) => {
      dispatch(setRecivedReplie({ ...data, currentUser: user }));
    };
  }, []);

  return null;
};

export default WebsocketModule;
