export interface Message {
  id: string;
  sender: "user" | "kgpt";
  text: string;
  timestamp?: string; // Optional: for displaying time
}
