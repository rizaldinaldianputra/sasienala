import { ChatBot, ChatBotAskResponse } from '../interface/chat';
import { apiCore } from './main_service';

export const chatbotService = {
  // Ambil riwayat chat
  getHistory: (user_id: number) => apiCore.post<ChatBot[]>(`/chatbot/history`, { user_id }),

  // Kirim pertanyaan ke chatbot
  ask: (user_id: number, query: string) =>
    apiCore.post<ChatBotAskResponse>(`/chatbot/ask`, { user_id, query }),
};
