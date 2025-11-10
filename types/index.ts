export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  status?: "online" | "offline";
  lastSeen?: number;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage?: string[];
  lastMessageTime?: number;
  unreadCount?: number;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  timestamp: number;
  read: boolean;
}
