"use client";
import React from "react";

import { useAppSelector } from "@/store/hooks";
import { User } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { useMessages } from "@/hooks/useMessages";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send, Image as ImageIcon, MoreVertical } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  users: User[];
  onSendMessage: (text: string, imageFile?: File) => void;
}

const EmptyChatState = React.memo(() => (
  <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
    <div className="text-center">
      <h2 className="text-2xl font-semibold text-gray-600 mb-2">
        Welcome to Chat App
      </h2>
      <p className="text-gray-500">Select a chat to start messaging</p>
    </div>
  </div>
));

EmptyChatState.displayName = "EmptyChatState";

const ChatHeader = React.memo(
  ({
    user,
    onMenuClick,
  }: {
    user: User | undefined;
    onMenuClick: () => void;
  }) => {
    if (!user) return null;

    return (
      <div className="bg-[#f0f2f5] border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL} alt={user.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{user.name}</h2>
            <p className="text-xs text-muted-foreground">
              {user.status === "online" ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
    );
  }
);

ChatHeader.displayName = "ChatHeader";

export function ChatWindow({ users, onSendMessage }: ChatWindowProps) {
  const { activeChat, currentUser, chats } = useAppSelector(
    (state) => state.chat
  );

  const [messageText, setMessageText] = React.useState("");
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const currentMessages = useMessages(activeChat);

  const currentChat = chats.find((c) => c.id === activeChat);
  const otherUserId = currentChat?.participants.find(
    (id) => id !== currentUser?.id
  );
  const otherUser = users.find((u) => u.id === otherUserId);

  // auto scroll to button on new messages

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages]);

  // function handler

  const handleImageSelect = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setSelectedImage(e.target.files[0]);
      }
    },
    []
  );

  const handleSend = React.useCallback(() => {
    if (messageText.trim() || selectedImage) {
      onSendMessage(messageText, selectedImage || undefined);
      setMessageText("");
      setSelectedImage(null);
    }
  }, [messageText, selectedImage, onSendMessage]);

  const handleOnKeyUp = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (!activeChat) return <EmptyChatState />;

  return (
    <div className="flex flex-col flex-1 bg-background">
      <ChatHeader
        user={otherUser}
        onMenuClick={() => console.log("menu clicked")}
      />

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-2">
          {currentMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === currentUser?.id}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="bg-white p-4">
        {/*  selected image : new feature */}
        {selectedImage && (
          <div className="mb-2 p-2 bg-white rounded-lg flex items-center justify-between">
            <span className="text-sm truncate">{selectedImage.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedImage(null)}
              aria-label="Remove image"
            >
              x
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
            aria-label="Upload image"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0 bg-green-500 cursor-pointer hover:bg-green-700"
            aria-label="Select image"
          >
            <ImageIcon className="size-5 text-white" />
          </Button>

          <Input
            placeholder="Type your message..."
            className="flex-1"
            aria-label="Message input"
            onChange={(e) => setMessageText(e.target.value)}
            onKeyUp={handleOnKeyUp}
            value={messageText}
          />

          <Button
            onClick={handleSend}
            disabled={!messageText.trim() && !selectedImage}
            className="shring-0 bg-green-500 hover:bg-green-700 text-white"
            aria-label="Send message"
          >
            <Send className="size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
