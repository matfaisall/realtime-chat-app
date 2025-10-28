/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import { LogOut } from "lucide-react";
import { authService } from "@/services/auth.service";

import { User } from "@/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ChatTopBarProps {
  currentUser: User;
  onLogout: () => void;
}

const ChatSidebar = dynamic(
  () =>
    import("@/components/shared/ChatSidebar").then((mod) => ({
      default: mod.ChatSidebar,
    })),
  {
    loading: () => (
      <div className="w-96 bg-background animate-pulse">Loading...</div>
    ),
    ssr: false,
  }
);

// top bar compnents
function ChatTopBar({ currentUser, onLogout }: ChatTopBarProps) {
  console.log("ini current user", currentUser);
  return (
    <div className="bg-green-500 text-white p-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="size-10 bg-white rounded-full flex items-center justify-center text-green-500 font-bold">
          {currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-semibold">{currentUser.name}</h2>
          <p className="text-xs text-green-100">{currentUser.email}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-green-600"
        onClick={onLogout}
      >
        <LogOut className="size-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}

const ChatPage = () => {
  const router = useRouter();
  const [users, setUsers] = React.useState<User[]>([]);

  const { user: authUser, loading: authLoading } = useAuth(true);

  console.log(authUser);

  const handleLogout = React.useCallback(async () => {
    try {
      await authService.logout();
      router.push("/auth");
    } catch (error: any) {
      console.log("Error logging out", error);
      throw new Error(error.message);
    }
  }, [router]);

  if (!authUser) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <ChatTopBar currentUser={authUser} onLogout={handleLogout} />

      <div className="flex-1 flex overflow-hidden">
        <Suspense
          fallback={<div className="w-96 bg-background animate-pulse" />}
        >
          <ChatSidebar users={users} />
        </Suspense>
      </div>
    </div>
  );
};

export default ChatPage;
