export const sortChat = (chats) => {
  if (!chats.length) {
    return [];
  }
  return chats.sort((a, b) => {
    return b.configuration?.pinned - a.configuration?.pinned || new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
  });
};
