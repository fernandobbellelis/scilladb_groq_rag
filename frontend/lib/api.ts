export enum Role {
  USER = "user",
  ASSISTANT = "assistant",
}

export interface Message {
  role: Role;
  content: string;
  timestamp?: string;
}

export interface ChatHistoryResponse {
  history: Message[];
}

export interface ChatMessageResponse {
  reply: string;
}

export interface ChatResetResponse {
  status: string;
}

export interface ChatMessage {
  role: Role;
  content: string;
  timestamp: string;
}

export async function sendChatMessage(
  message: string
): Promise<ChatMessageResponse> {
  const response = await fetch("/chat/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to send message");
  }

  return response.json();
}

export async function getChatHistory(): Promise<ChatHistoryResponse> {
  const response = await fetch("/chat/history");

  if (!response.ok) {
    throw new Error("Failed to fetch chat history");
  }

  return response.json();
}

export async function resetChatHistory(): Promise<ChatResetResponse> {
  const response = await fetch("/chat/reset", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to reset chat history");
  }

  return response.json();
}
