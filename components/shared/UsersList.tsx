import { User } from "@/types/chat";
import React from "react";

interface UsersListProps {
  users: User[];
  onStartChat: (user: User) => void;
}

const UsersList = ({ users, onStartChat }: UsersListProps) => {
  return (
    <div>
      <p>UsersList</p>
    </div>
  );
};

export default UsersList;
