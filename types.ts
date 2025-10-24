export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  prompt?: string;
  imageUrl?: string; // Can be a data URL or blob URL
  mimeType?: string;
  contextImageUrl?: string; // URL for a context image provided by the user
}
