import { User } from "@/types";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface UsersListProps {
  users: User[];
  onStartChat: (user: User) => void;
}

interface UserItemProps {
  user: User;
  onStartChat: (user: User) => void;
}

const UserItem = React.memo(({ user, onStartChat }: UserItemProps) => {
  const handleClick = React.useCallback(() => {
    onStartChat(user);
  }, [onStartChat, user]);
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.photoURL} alt={user.name} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-medium">{user.name}</h4>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Button
        size="sm"
        onClick={handleClick}
        className="bg-green-500 hover:bg-green-700 hover:cursor-pointer"
      >
        <MessageCircle className="w-4 h-4 mr-1" />
        Chat
      </Button>
    </div>
  );
});

UserItem.displayName = "UserItem";

export const UsersList = React.memo(
  ({ users, onStartChat }: UsersListProps) => {
    console.log("ini list users", users);
    return (
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
          Pengguna Terdaftar
        </h3>
        <div className="space-y-2">
          {users.map((user) => (
            <UserItem key={user.id} user={user} onStartChat={onStartChat} />
          ))}
        </div>
      </div>
    );
  }
);

UsersList.displayName = "UsersList";

// export default UsersList;
