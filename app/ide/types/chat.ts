export interface ChatMessage {
  id: number;
  content: string;
  sender: "me" | "other";
}
