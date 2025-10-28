export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  status?: "online" | "offline";
  lastSeen?: number;
}
