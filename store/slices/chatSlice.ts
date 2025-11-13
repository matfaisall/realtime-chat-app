import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message, User, Chat } from "@/types";

interface ChatState {
  currentUser: User | null;
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChat: string | null;
  loading: boolean;
}

const initialState: ChatState = {
  currentUser: null,
  chats: [],
  messages: {},
  activeChat: null,
  loading: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    setChat: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },

    // active chat
    setActiveChat: (state, action: PayloadAction<string | null>) => {
      state.activeChat = action.payload;
    },

    // masih bleum di pakai
    updateChat: (state, action: PayloadAction<Chat>) => {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.id
      );
      if (index !== -1) {
        state.chats[index] = action.payload;
      }
    },

    // masih belum di pakai
    addMessage: (state, action: PayloadAction<Message>) => {
      const chatId = action.payload.chatId;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      const exists = state.messages[chatId].find(
        (msg) => msg.id === action.payload.id
      );
      if (!exists) {
        state.messages[chatId].push(action.payload);
      }
    },

    setMessages: (
      state,
      action: PayloadAction<{ chatId: string; messages: Message[] }>
    ) => {
      state.messages[action.payload.chatId] = action.payload.messages;
    },
  },
});

export const { setCurrentUser, setChat, setActiveChat, setMessages } =
  chatSlice.actions;

export default chatSlice.reducer;
