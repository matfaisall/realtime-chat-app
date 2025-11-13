"use client";
import React from "react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setMessages } from "@/store/slices/chatSlice";
import { chatService } from "@/services/chat.service";
import { Message } from "@/types"; // pastikan type Message ada

export const useMessages = (chatId: string | null): Message[] => {
  const dispatch = useAppDispatch();
  const { messages, currentUser } = useAppSelector((state) => state.chat);

  const currentMessages = chatId ? messages[chatId] || [] : [];
  console.log("current messages", currentMessages);

  React.useEffect(() => {
    if (!chatId) return;

    const unsubscribe = chatService.subscribeToMessages(
      chatId,
      (newMessages) => {
        dispatch(setMessages({ chatId, messages: newMessages }));
      }
    );

    // mark messages as read
    if (currentUser) {
      chatService.markMessagesAsRead(chatId, currentUser.id);
    }

    return () => unsubscribe();
  }, [chatId, currentUser, dispatch]);

  // ← TAMBAHKAN INI: return array messages
  return currentMessages;
};
