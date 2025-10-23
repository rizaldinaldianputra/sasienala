import { useEffect, useState } from 'react';
import { ChatBot, ChatBotAskResponse } from '../interface/chat';
import { chatbotService } from '../service/chatbot_service';
import { getUserId } from '../session/session';

export const useChatBot = (userId: number) => {
  const [chats, setChats] = useState<ChatBot[]>([]);
  const [loading, setLoading] = useState(false);

  // Ambil riwayat chat
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const uid = getUserId();
      const res = await chatbotService.getHistory(uid || 0);
      setChats(res.data);
    } catch (err) {
      console.error('Error fetch chat history', err);
    } finally {
      setLoading(false);
    }
  };

  // Kirim pertanyaan dan tambahkan assistant message saja
  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await chatbotService.ask(userId, query);
      const response: ChatBotAskResponse = res.data;

      // Tambahkan assistant message ke chat list
      const assistantMessage: ChatBot = {
        id: response.assistant_message_id || Date.now(),
        user_id: userId,
        role: 'assistant',
        content: response.answer,
        payload: null,
        source_type: null,
        created_at: new Date().toISOString(),
      };
      setChats((prev) => [...prev, assistantMessage]);

      return response;
    } catch (err) {
      console.error('Error send message', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return { chats, loading, fetchHistory, sendMessage, setChats };
};
