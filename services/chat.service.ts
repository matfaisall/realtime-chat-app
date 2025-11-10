import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Message, Chat } from "@/types";

export const chatService = {
  // create or get chat between two users
  async createOrGetChat(userId1: string, userId2: string): Promise<string> {
    const chatRef = collection(db, "chats");
    const q = query(
      chatRef,
      where("participants", "array-contains", [userId1])
    );

    const snapshot = await getDocs(q);

    let chatId = "";

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.participants.includes(userId1)) {
        chatId = doc.id;
      }
    });

    if (!chatId) {
      const newChat = await addDoc(chatRef, {
        participants: [userId1, userId2],
        createdAt: serverTimestamp(),
        lastMessageTime: serverTimestamp(),
      });
      chatId = newChat.id;
    }

    console.log("ini chat id", chatId);

    return chatId;
  },
};
