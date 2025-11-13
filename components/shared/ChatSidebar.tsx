/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MessageSquareText, UserPlus, Search } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types";
import { UsersList } from "./UsersList";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { chatService } from "@/services/chat.service";
import { setActiveChat } from "@/store/slices/chatSlice";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ChatSidebarProps {
  users: User[];
}

const ChatItem = React.memo(
  ({ chat, user, lastMessage, isActive, onClick }: any) => {
    if (!user) return null;

    return (
      <div
        onClick={onClick}
        className={`p-4 hover:bg-accent cursor-pointer transition-colors ${
          isActive ? "bg-accent" : ""
        }`}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.photoURL} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm truncate">{user.name}</h3>
              {lastMessage && (
                <span className="text-xs text-muted-foreground">
                  {format(lastMessage.timestamp, "HH:mm")}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {lastMessage?.text || lastMessage?.imageUrl
                ? "📷 Foto"
                : "Mulai chat..."}
            </p>
          </div>

          {chat.unreadCount && chat.unreadCount > 0 && (
            <div className="bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {chat.unreadCount}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ChatItem.displayName = "ChatItem";

export function ChatSidebar({ users }: ChatSidebarProps) {
  const dispatch = useAppDispatch();
  const { chats, currentUser, activeChat, messages } = useAppSelector(
    (state) => state.chat
  );
  const [showUsersList, setShowUsersList] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const getChatUser = React.useCallback(
    (userId: string) => {
      const chat = chats.find((chat) => chat.id === userId);
      if (!chat) return null;

      const otherUserId = chat.participants.find(
        (id) => id !== currentUser?.id
      );
      return users.find((user) => user.id === otherUserId);
    },
    [chats, currentUser, users]
  );

  const getLastMessage = React.useCallback(
    (chatId: string) => {
      const chatMessage = messages[chatId] || [];
      return chatMessage[chatMessage.length - 1];
    },
    [messages]
  );

  const filteredChat = React.useMemo(() => {
    return chats.filter((chat) => {
      const user = getChatUser(chat.id);
      return user?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [getChatUser, chats, searchQuery]);

  const handleChatClick = React.useCallback(
    (chatId: string) => {
      dispatch(setActiveChat(chatId));
    },
    [dispatch]
  );

  const handleStartChat = React.useCallback(
    async (user: User) => {
      if (!currentUser) return;

      try {
        const chatId = await chatService.createOrGetChat(
          currentUser.id,
          user.id
        );

        console.log("ini chat id", chatId);

        dispatch(setActiveChat(chatId));
        setShowUsersList(false);
      } catch (error: any) {
        console.log("error start chat", error);
        throw new Error(error.message);
      }
    },
    [currentUser, dispatch]
  );

  return (
    <div className="w-full md:w-96 border-r border-border bg-background flex flex-col h-full">
      {/* header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Chats</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowUsersList(!showUsersList)}
            className="hover:bg-green-600 hover:text-white hover:cursor-pointer"
          >
            {showUsersList ? (
              <MessageSquareText className="size-5" />
            ) : (
              <UserPlus className="size-5" />
            )}
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Search Chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* user list or chat list */}
      <ScrollArea className="flex-1">
        {showUsersList ? (
          <UsersList users={users} onStartChat={handleStartChat} />
        ) : (
          <div className="divide-y divide-border">
            {/* filtered disini */}
            {filteredChat.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p className="mb-2">Chat Empty</p>
                <p className="text-sm">Click on Button + to start chat</p>
              </div>
            ) : (
              filteredChat.map((chat) => {
                return (
                  <ChatItem
                    key={chat.id}
                    chat={chat}
                    user={getChatUser(chat.id)}
                    lastMessage={getLastMessage(chat.id)}
                    isActive={activeChat === chat.id}
                    onClick={() => handleChatClick(chat.id)}
                  />
                );
              })
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default ChatSidebar;
