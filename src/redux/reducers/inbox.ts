import * as ACTION from 'src/redux/actionTypes';
import { IAction, IInboxState } from 'src/types';
import { chatMessageMapper } from 'src/utils/messages';
import { sortChat } from 'src/utils/sortChat';

const initialState: IInboxState = {
  loading: false,
  loadingMessages: false,
  error: undefined,
  chats: {
    my: [],
    other: [],
  },
  messages: [],
  pendingMessages: [],
  currentChat: null,
};

const inbox = (state = initialState, action: IAction<any>): IInboxState => {
  const { payload } = action;

  switch (action.type) {
    case ACTION.SEND_CHAT_CLAIM:
      return {
        ...state,
        loading: true,
      };
    case ACTION.SEND_CHAT_CLAIM_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case ACTION.SEND_CHAT_CLAIM_ERROR:
      return {
        ...state,
        loading: false,
      };
    case ACTION.GET_MY_CHATS:
      return {
        ...state,
        loading: true,
      };
    case ACTION.GET_MY_CHATS_SUCCESS:
      return {
        ...state,
        chats: {
          ...state.chats,
          my: payload,
        },
        loading: false,
      };
    case ACTION.GET_MY_CHATS_ERROR:
      return {
        ...state,
        loading: false,
      };

    case ACTION.GET_OTHER_CHATS:
      return {
        ...state,
      };
    case ACTION.GET_OTHER_CHATS_SUCCESS:
      return {
        ...state,
        chats: {
          ...state.chats,
          other: payload,
        },
        loading: false,
      };
    case ACTION.GET_OTHER_CHATS_ERROR:
      return {
        ...state,
        // loading: false,
      };
    case ACTION.SET_PENDING_MESSAGE: {
      let pendingMessages = [];
      pendingMessages = [payload, ...state.pendingMessages];
      return {
        ...state,
        pendingMessages,
      };
    }
    case ACTION.GET_CHATS_MESSAGES: {
      return {
        ...state,
        loadingMessages: true,
      };
    }
    case ACTION.GET_CHATS_MESSAGES_SUCCESS: {
      const mappedMessages = chatMessageMapper(payload);
      return {
        ...state,
        messages: mappedMessages,
        loadingMessages: false,
      };
    }

    case ACTION.SET_RECIVED_MESSAGE: {
      const chats = state.chats;
      const pendingMessages = state.pendingMessages.filter((m) => {
        m._id !== payload._id;
      });

      const messages =
        state.currentChat?.propertyId === payload.chat.propertyId && state.currentChat?.userId === payload.chat.userId
          ? [...chatMessageMapper([payload]), ...state.messages]
          : state.messages;

      const chatKey = payload.userId !== payload.currentUser.id ? 'my' : 'other';
      const chat = chats[chatKey].find((c) => c.id === payload.chat.id);
      const isAdditionalMessage = payload.chat.id !== state?.currentChat?.id || payload.senderId !== payload.currentUser.id;

      if (chat) {
        Object.assign(chat, payload.chat);
        chat.unreaded += isAdditionalMessage;
      } else {
        chats[chatKey].push({ ...payload.chat, unreaded: +isAdditionalMessage });
      }
      chats[chatKey] = sortChat(chats[chatKey]);

      return {
        ...state,
        messages,
        pendingMessages,
        chats: Object.assign({}, chats),
      };
    }

    case ACTION.SET_RECIVED_REPLIE: {
      const index = state.messages.findIndex((m) => {
        return m.id === payload.id;
      });

      state.messages[index] = chatMessageMapper([payload])[0];

      return {
        ...state,
        messages: [...state.messages],
      };
    }

    case ACTION.CLEAR_CHAT_MESSAGES: {
      return {
        ...state,
        messages: [],
        pendingMessages: [],
      };
    }
    case ACTION.CLEAR_CURRENT_CHAT: {
      return {
        ...state,
        currentChat: null,
      };
    }

    case ACTION.GET_CHATS: {
      return {
        ...state,
        currentChat: payload,
      };
    }
    case ACTION.DELETE_CHATS: {
      return {
        ...state,
        loading: true,
      };
    }
    case ACTION.DELETE_CHATS_SUCCESS: {
      return {
        ...state,
        loading: false,
      };
    }
    case ACTION.DELETE_CHATS_ERROR: {
      return {
        ...state,
        loading: false,
      };
    }
    case ACTION.PIN_CHATS_SUCCESS: {
      return {
        ...state,
      };
    }
    case ACTION.SET_CURRENT_CHAT: {
      return {
        ...state,
        currentChat: payload,
      };
    }

    default:
      return state;
  }
};

export default inbox;
