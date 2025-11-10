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
  },
});

export const { setCurrentUser, setChat, setActiveChat } = chatSlice.actions;

export default chatSlice.reducer;
