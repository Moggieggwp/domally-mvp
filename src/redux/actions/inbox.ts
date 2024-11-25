import { Dispatch } from 'redux';
import { apiRequest } from 'src/services/api';
import Websocket from 'src/services/Websocket';
import * as ACTION from './../actionTypes';

export const sendChatClaim =
  (data) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: ACTION.SEND_CHAT_CLAIM });

      await apiRequest({
        method: 'post',
        url: '/chats/add-claim',
        data,
      });

      dispatch({
        type: ACTION.SEND_CHAT_CLAIM_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: ACTION.SEND_CHAT_CLAIM_ERROR,
        payload: error,
      });
    }
  };

export const getOtherPropertyChats =
  (query: string = '') =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: ACTION.GET_OTHER_CHATS });

      const res = await apiRequest({
        method: 'get',
        url: `/chats/other?query=${query}`,
      });

      dispatch({
        type: ACTION.GET_OTHER_CHATS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: ACTION.GET_OTHER_CHATS_ERROR,
        payload: error,
      });
    }
  };

export const getMyPropertyChats =
  (query: string = '') =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: ACTION.GET_MY_CHATS });

      const res = await apiRequest({
        method: 'get',
        url: `/chats/my?query=${query}`,
      });

      dispatch({
        type: ACTION.GET_MY_CHATS_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: ACTION.GET_MY_CHATS_ERROR,
        payload: error,
      });
    }
  };

export const setRecivedMessage = (payload) => {
  return { type: ACTION.SET_RECIVED_MESSAGE, payload };
};

export const setRecivedReplie = (payload) => {
  return { type: ACTION.SET_RECIVED_REPLIE, payload };
};

export const setMessage = (payload) => {
  return { type: ACTION.SET_PENDING_MESSAGE, payload };
};

export const getChatMessages =
  ({ propertyId, userId }) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: ACTION.GET_CHATS_MESSAGES });

      const res = await apiRequest({
        method: 'get',
        url: `/chats/${propertyId}/${userId}/messages/`,
      });

      dispatch({
        type: ACTION.GET_CHATS_MESSAGES_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

export const reloadChatMessagesOnForeground =
  ({ propertyId, userId }) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      dispatch({ type: ACTION.GET_CHATS_MESSAGES });

      const res = await apiRequest({
        method: 'get',
        url: `/chats/${propertyId}/${userId}/messages/`,
      });

      dispatch(clearChatMessages());
      dispatch({
        type: ACTION.GET_CHATS_MESSAGES_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

export const clearChatMessages = () => {
  return {
    type: ACTION.CLEAR_CHAT_MESSAGES,
  };
};
export const clearCurrentChat = () => {
  return {
    type: ACTION.CLEAR_CURRENT_CHAT,
  };
};

export const getChat =
  ({ propertyId, userId }) =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      const res = await apiRequest({
        method: 'get',
        url: `/chats/${propertyId}/${userId}`,
      });

      dispatch({
        type: ACTION.GET_CHATS,
        payload: res.data,
      });
    } catch (error) {
      console.log(error);
    }
  };

export const deleteChat =
  (data: number[]) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      dispatch({ type: ACTION.DELETE_CHATS });

      await apiRequest({
        method: 'delete',
        url: '/chats',
        data,
      });

      dispatch({
        type: ACTION.DELETE_CHATS_SUCCESS,
      });
      dispatch(getOtherPropertyChats());
      dispatch(getMyPropertyChats());
    } catch (error) {
      dispatch({
        type: ACTION.DELETE_CHATS_ERROR,
        payload: error,
      });
    }
  };

export const pinChat =
  (data) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      dispatch({ type: ACTION.PIN_CHATS });

      const res = await apiRequest({
        method: 'post',
        url: '/chats/pin',
        data,
      });

      dispatch({
        type: ACTION.PIN_CHATS_SUCCESS,
        payload: res.data,
      });

      dispatch(getOtherPropertyChats());
      dispatch(getMyPropertyChats());
    } catch (error) {
      dispatch({
        type: ACTION.PIN_CHATS_ERROR,
        payload: error,
      });
    }
  };

export const unpinChat =
  (data) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      dispatch({ type: ACTION.UNPIN_CHATS });

      await apiRequest({
        method: 'post',
        url: '/chats/unpin',
        data,
      });

      dispatch({
        type: ACTION.UNPIN_CHATS_SUCCESS,
      });
      dispatch(getOtherPropertyChats());
      dispatch(getMyPropertyChats());
    } catch (error) {
      dispatch({
        type: ACTION.UNPIN_CHATS_ERROR,
        payload: error,
      });
    }
  };

export const muteChat =
  (data) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      dispatch({ type: ACTION.MUTE_CHATS });

      const res = await apiRequest({
        method: 'post',
        url: '/chats/mute',
        data,
      });

      dispatch({
        type: ACTION.MUTE_CHATS_SUCCESS,
        payload: res.data,
      });

      dispatch(getOtherPropertyChats());
      dispatch(getMyPropertyChats());
    } catch (error) {
      dispatch({
        type: ACTION.MUTE_CHATS_ERROR,
        payload: error,
      });
    }
  };

export const unmuteChat =
  (data) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      dispatch({ type: ACTION.UNMUTE_CHATS });

      await apiRequest({
        method: 'post',
        url: '/chats/unmute',
        data,
      });

      dispatch({
        type: ACTION.UNMUTE_CHATS_SUCCESS,
      });
      dispatch(getOtherPropertyChats());
      dispatch(getMyPropertyChats());
    } catch (error) {
      dispatch({
        type: ACTION.UNMUTE_CHATS_ERROR,
        payload: error,
      });
    }
  };

export const readAllMessages =
  (data: number[], senderId?: number) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      dispatch({ type: ACTION.READ_ALL_MSG });

      await apiRequest({
        method: 'post',
        url: '/chats/messages/read-all',
        data: { chatIds: data },
      });

      dispatch({
        type: ACTION.READ_ALL_MSG_SUCCESS,
      });
      dispatch(getOtherPropertyChats());
      dispatch(getMyPropertyChats());
      Websocket.handleUnreadedMessage(senderId);
    } catch (error) {
      dispatch({
        type: ACTION.READ_ALL_MSG_ERROR,
        payload: error,
      });
    }
  };
export const setCurrentChat = (chat) => {
  return {
    type: ACTION.SET_CURRENT_CHAT,
    payload: chat,
  };
};
