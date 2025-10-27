export interface User {
  id: string;
  fullname: string;
  email: string;
  photoURL?: string;
  status?: "online" | "ofline";
  lastSeen?: number;
}
