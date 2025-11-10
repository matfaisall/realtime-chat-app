"use client";

import { MessageSquareText, UserPlus, Search } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "@/types";
import UsersList from "./UsersList";

interface ChatSidebarProps {
  users: User[];
}

export function ChatSidebar({ users }: ChatSidebarProps) {
  const [showUsersList, setShowUsersList] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleStartChat = () => {};

  return (
    <div className="w-full md:w-96 border-r border-border bg-background flex flex-col h-full">
      {/* header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1>Chats</h1>
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
            <div className="p-8 text-center text-muted-foreground">
              <p className="mb-2">Chat Empty</p>
              <p className="text-sm">Click on Button + to start chat</p>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default ChatSidebar;
