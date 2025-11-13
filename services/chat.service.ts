import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Message } from "@/types";

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

  async sandMessage(
    chatId: string,
    senderId: string,
    text?: string,
    imageFile?: File
  ): Promise<void> {
    let imageUrl = "";

    if (imageFile) {
      // upload image to claudinary
      // tambahkan nanti
      imageUrl = "";
    }

    const messageRef = collection(db, "chat", chatId, "messages");
    await addDoc(messageRef, {
      senderId,
      text: text || "",
      imageUrl: imageUrl || "",
      timestamp: serverTimestamp(),
      read: false,
    });

    // update chat las message info
    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      lastMessage: text || "Foto",
      lastMessageTime: serverTimestamp(),
    });
  },

  subscribeToMessages: (
    chatId: string,
    callback: (messages: Message[]) => void
  ) => {
    const messageRef = collection(db, "chat", chatId, "messages");
    const q = query(messageRef, orderBy("timestamp", "asc"));

    return onSnapshot(q, (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          chatId,
          senderId: data.senderId,
          text: data.text,
          imageUrl: data.imageUrl,
          timestamp: data.timestamp?.toMillis() || Date.now(),
          read: data.read,
        });
      });
      callback(messages);
    });
  },

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    const messagesRef = collection(db, "chat", chatId, "messages");
    const q = query(messagesRef, where("senderId", "==", userId));

    const snapshot = await getDocs(q);

    const updatePromises = snapshot.docs.map((document) => {
      return updateDoc(doc(db, "chats", chatId, "messages", document.id), {
        read: true,
      });
    });

    await Promise.all(updatePromises);
  },
};
