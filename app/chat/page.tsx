"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { LogOut } from "lucide-react";

import ChatSidebar from "@/components/shared/ChatSidebar";
import { User } from "@/types/chat";

const Chat = () => {
  const [users, setUsers] = React.useState<User[]>([]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="bg-green-500 text-white p-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-white rounded-full flex items-center justify-center text-green-500 font-bold">
            F
          </div>
          <div>
            <h2 className="font-semibold">Muhammad Faisal</h2>
            <p className="text-xs text-green-100">muh.faisal@gmail.com</p>
          </div>
        </div>
        <Button variant="ghost" className="text-white hover:bg-green-600">
          <LogOut className="size-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* main page */}
      <div className="flex-1 flex overflow-hidden">
        {/* sidebar */}
        <ChatSidebar users={users} />
        {/* chat window */}
      </div>
    </div>
  );
};

export default Chat;
