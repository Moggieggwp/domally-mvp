import { createSelector } from 'reselect';
import { IRootState } from '../store';

export const selectChats = (state: IRootState) => state.inbox.chats;
export const selectCurrentChat = (state: IRootState) => state.inbox.currentChat;
export const selectChatMessage = (state: IRootState) => state.inbox.messages;
export const selectPendingChatMessage = (state: IRootState) => state.inbox.pendingMessages;
export const selectChatsLoading = (state: IRootState) => state.inbox.loading;
export const selectChatMessageLoading = (state: IRootState) => state.inbox.loadingMessages;
export const selectOpponentProfile = (state: IRootState) => state.inbox.currentChat.opponent;

export const getChatMessage = createSelector(
  selectChatMessage,
  (state: IRootState) => {
    return { user: state.profile?.data, opponent: state.inbox?.currentChat?.opponent };
  },
  (messages, profiles) => {
    return messages.map((m) => {
      const user = profiles.user.id === m.user._id ? profiles.user : profiles.opponent;
      return {
        ...m,
        user: {
          ...m.user,
          avatar: user?.avatar,
          name: user?.firstName,
        },
      };
    });
  },
);
