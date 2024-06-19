import Message from '../../models/postModel.js';

export const newChatMessages = async (message: any) => {
  try {
    // @ts-ignore
    const chat = {
      room: 'chat',
      content: message,
    };

    const newMessage = await Message.create(chat);
    if (!newMessage) {
      return false;
    }
    return newMessage;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const pastMessages = async () => {
  try {
    const currentMessages = await Message.findAll();
    if (!currentMessages) {
      return false;
    }
    return currentMessages;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
