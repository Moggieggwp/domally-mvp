export const chatMessageMapper = (messages: any) => {
  const mappedMessages = messages.map((m) => {
    if (m.scheduleTourData) {
      return {
        ...m,
        _id: m.id.toString(),
        user: {
          _id: m.senderId,
        },
        text: m.message,
        quickReplies: {
          type: 'radio',
          keepIt: true,
          values: [
            {
              _id: m.id.toString(),
              title: 'Yes',
              value: true,
            },
            {
              _id: m.id.toString(),
              title: 'No',
              value: false,
            },
          ],
        },
      };
    }
    return {
      ...m,
      _id: m.id.toString(),
      user: {
        _id: m.senderId,
      },
      text: m.message,
    };
  });
  return mappedMessages.reverse();
};
