// src/pages/Chat.jsx
import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { COLORS } from '../constants/colors'; // pastikan path sesuai
import { useChatBot } from '../hook/useChat';

const Chat = ({ userId }) => {
  const { chats, sendMessage, loading } = useChatBot(userId);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <Header />

      <div className="px-4 text-center my-6">
        <p className="text-gray-600">
          HAI RINA 💕, WELCOME TO SASIENALA!
          <br />
          Lagi Cari Kemeja Basic atau Apa Nih ?<br />
          Boleh Minsie Bantuin yaa.... 🌷
        </p>
      </div>

      <div className="px-4 space-y-4">
        {chats.map((chat) => (
          <div key={chat.id}>
            {/* Chat bubble */}
            <div className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                  chat.role === 'user' ? 'text-white' : 'bg-gray-100 text-gray-900'
                }`}
                style={chat.role === 'user' ? { backgroundColor: COLORS.primary } : {}}
              >
                {chat.content}
              </div>
            </div>

            {/* Render produk di dalam chat assistant */}
            {chat.role === 'assistant' &&
              chat.payload?.rag_context
                ?.filter((r) => r.document_type === 'product')
                .map((r) => (
                  <div
                    key={r.id}
                    className="border p-4 rounded-lg shadow-sm bg-white flex gap-4 items-start mt-2"
                  >
                    {/* Image di kiri */}
                    {r.payload.image_url && (
                      <img
                        src={r.payload.image_url}
                        alt={r.payload.product_name}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = '/broken-image.png';
                        }}
                      />
                    )}

                    {/* Info produk di kanan */}
                    <div className="flex-1">
                      <p className="font-semibold">{r.payload.product_name}</p>
                      <p className="text-orange-500 font-bold">
                        Rp {r.payload.price?.toLocaleString('id-ID')}
                      </p>

                      {/* Warna */}
                      {r.payload.color && (
                        <div className="flex gap-1 my-2 items-center">
                          <span className="text-sm">Warna:</span>
                          <div
                            className={`w-5 h-5 rounded border`}
                            style={{ backgroundColor: r.payload.color }}
                          ></div>
                        </div>
                      )}

                      {/* Ukuran */}
                      {r.payload.size && (
                        <div className="my-2">
                          <label className="text-sm mr-2">Ukuran:</label>
                          <select className="border px-2 py-1 rounded">
                            <option value={r.payload.size}>{r.payload.size}</option>
                          </select>
                        </div>
                      )}

                      {/* Quantity */}
                      <div className="flex items-center gap-2 my-2">
                        <button className="px-2 py-1 border rounded">-</button>
                        <span>1</span>
                        <button className="px-2 py-1 border rounded">+</button>
                        <span className="text-sm text-gray-500 ml-2">sisa {r.payload.stock}</span>
                      </div>

                      <button className="bg-orange-500 text-white w-full py-2 rounded mt-2 hover:bg-orange-600">
                        + Tambah ke Keranjang
                      </button>
                    </div>
                  </div>
                ))}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="fixed bottom-20 w-full px-4 flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          placeholder="Tulis pesan kamu.."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700"
          onClick={handleSend}
        >
          Kirim
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Chat;
