export interface ChatMessage {
  id?: number;
  content?: string;
  sender?: "me" | "other";

  userId?: number;
  userName: string;
  userImgUrl: string;
  message: string;
  createdAt: string; // ISO DateTime

  _clientId?: string;
}
