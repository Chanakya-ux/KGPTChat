export interface Message {
  id: string;
  sender: "user" | "kgpt" | "system"; // Added system for date separators or other info
  text: string;
  timestamp: number; // Use number for easier sorting/comparison
  avatar?: string; // URL or initials
  suggestions?: string[];
  isLoading?: boolean; // For AI typing indicator
  isError?: boolean; // To flag error messages for styling
}
