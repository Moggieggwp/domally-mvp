import { io, Socket } from 'socket.io-client';
import { getLocalAccessToken } from 'src/utils/storage';
import { WS_URL } from '@env';

class Websocket {
  socket: Socket;
  isConnected = false;
  handler: {
    recive?: (data) => void;
    chatsReplies?: (data) => void;
    chatUnreadedMessage?: (data) => void;
    disconnect?: (data?) => void;
    connected?: (data?) => void;
  };

  constructor() {
    this.handler = {};
    getLocalAccessToken().then((token: string) => {
      this.socket = io(WS_URL, {
        autoConnect: true,
        reconnectionDelayMax: 10000,
        auth: { token },
      });
      this.initHandlers();
    });
  }

  async initHandlers() {
    this.socket.on('connect', () => {
      console.log('Connected');
    });

    this.socket.on('chats', (data) => {
      this.handler.recive(data);
    });

    this.socket.on('chats:replies', (data) => {
      this.handler.chatsReplies(data);
    });

    this.socket.on('chats:unreaded', (data) => {
      console.log(data);
      this.handler.chatUnreadedMessage(data);
    });

    this.socket.on('exception', (data) => {
      console.log('event', data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    this.socket.on('connect_error', (err) => {
      console.log('socket connected error ', err);
    });
  }

  async connect() {
    const token = await getLocalAccessToken();
    this.socket.auth = { token };
    this.socket.disconnect().connect();
  }

  send(message: any) {
    this.socket.emit('chats', message);
  }

  handleReplies(message: any) {
    this.socket.emit('chats:replies', message);
  }

  handleUnreadedMessage(payload: any) {
    if (payload) {
      this.socket?.emit('chats:unreaded', payload);
    }
  }

  disconnect() {
    this.socket.disconnect();
  }

  set recive(handler) {
    this.handler.recive = handler;
  }

  set chatsReplies(handler) {
    this.handler.chatsReplies = handler;
  }

  set chatUnreadedMessage(handler) {
    this.handler.chatUnreadedMessage = handler;
  }
}

export default new Websocket();
