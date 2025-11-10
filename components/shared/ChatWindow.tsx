"use client";

import { useAppSelector } from "@/store/hooks";
import { User } from "@/types";

interface ChatWindowProps {
  users: User[];
  onSendMessage: (text: string, imageFile?: File) => void;
}

// interface ChatHeaderProps {
//   user: User | undefined;
//   onMenuClick: () => void;
// }

// const ChatHeader = React.memo(({ user, onMenuClick }: ChatHeaderProps) => {
//   if(!user) return null;

//   return (
//     <div>
//       <h1>hello wordl</h1>
//     </div>
//   );
// });

export function ChatWindow({ users, onSendMessage }: ChatWindowProps) {
  const { activeChat, currentUser, chats } = useAppSelector(
    (state) => state.chat
  );

  console.log("ini current user", currentUser);

  // const otherUser = users.find((u) => u.id ===  )

  return (
    <div className="flex flex-col flex-1 bg-yellow-50">
      {/* <ChatHeader user={} /> */}
      <h1>ChatWindow</h1>
      <p>hello chat window</p>
    </div>
  );
}

export default ChatWindow;
