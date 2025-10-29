import { useEffect, useState } from 'react';
import { ChatBot, ChatBotAskResponse } from '../interface/chat';
import { chatbotService } from '../service/chatbot_service';
import { getUserId } from '../session/session';

export const useChatBot = (userId: number) => {
  const [chats, setChats] = useState<ChatBot[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Ambil riwayat chat
  const fetchHistory = async () => {
    try {
      const uid = getUserId();
      const res = await chatbotService.getHistory(uid || 0);
      setChats(res.data);
    } catch (err) {
      console.error('Error fetch chat history', err);
    }
  };

  // Kirim pertanyaan dan tambahkan assistant message
  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    setIsTyping(true);

    // Tambahkan dummy message untuk indikator mengetik
    const typingMessage: ChatBot = {
      id: Date.now(),
      user_id: userId,
      role: 'assistant',
      content: 'Minsie sedang mengetik...',
      payload: null,
      source_type: null,
      created_at: new Date().toISOString(),
    };
    setChats((prev) => [...prev, typingMessage]);

    try {
      const res = await chatbotService.ask(userId, query);
      const response: ChatBotAskResponse = res.data;

      const assistantMessage: ChatBot = {
        id: response.assistant_message_id || Date.now(),
        user_id: userId,
        role: 'assistant',
        content: response.answer,
        payload: null,
        source_type: null,
        created_at: new Date().toISOString(),
      };

      // Ganti dummy message dengan jawaban asli
      setChats((prev) => prev.map((m) => (m.id === typingMessage.id ? assistantMessage : m)));

      return response;
    } catch (err) {
      console.error('Error send message', err);
      // Hapus dummy jika gagal
      setChats((prev) => prev.filter((m) => m.id !== typingMessage.id));
      return null;
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return { chats, setChats, sendMessage, isTyping };
};
