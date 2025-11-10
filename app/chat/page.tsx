/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { authService } from "@/services/auth.service";

import { User } from "@/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

const ChatWindow = dynamic(
  () =>
    import("@/components/shared/ChatWindow").then((mod) => ({
      default: mod.ChatWindow,
    })),
  {
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    ),
    ssr: false,
  }
);

// top bar compnents
function ChatTopBar({ currentUser, onLogout }: ChatTopBarProps) {
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

  // subscribe to users
  React.useEffect(() => {
    if (!authUser) return;

    const userRef = collection(db, "users");
    const q = query(userRef, where("id", "!=", authUser.id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allUsers: User[] = [];
      snapshot.forEach((doc) => {
        allUsers.push(doc.data() as User);
      });

      setUsers(allUsers);
    });

    return () => unsubscribe();
  }, [authUser]);

  const handleLogout = React.useCallback(async () => {
    try {
      await authService.logout();
      router.push("/auth");
    } catch (error: any) {
      throw new Error(error.message);
    }
  }, [router]);

  const handleSendMessage = () => {};

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
        {/* main window */}
        <Suspense
          fallback={
            <div className="flex flex-1 justify-center items-center">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          }
        >
          <ChatWindow users={users} onSendMessage={handleSendMessage} />
        </Suspense>
      </div>
    </div>
  );
};

export default ChatPage;
