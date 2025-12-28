export interface ChatMessage {
  userId: number;
  userName: string;
  userImgUrl: string;
  message: string;
  createdAt: string; // ISO DateTime
}
