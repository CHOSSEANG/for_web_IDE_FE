export interface ChatMessage {
  id: number;
  userName: string;
  userImgUrl: string;
  message: string;
  content: string;
  sender: "me" | "other";
  createdAt: string; // ISO DateTime
}
