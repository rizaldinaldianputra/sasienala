import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavSearch from '../components/BottomNavWithSearch';
import Header from '../components/Header';
import { COLORS } from '../constants/colors';
import { useCart } from '../hook/useCart';
import { useChatBot } from '../hook/useChat';
import { getToken, getUserId } from '../session/session';

const Chat = ({ userId }) => {
  const navigate = useNavigate();
  const { chats, sendMessage, setChats } = useChatBot(userId);
  const { addCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(true);
  const chatContainerRef = useRef(null);

  const handleSend = async (message) => {
    if (!message.trim()) return;

    const tempMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
    };

    setChats((prev) => [...prev, tempMessage]);
    await sendMessage(message);
  };

  const handleAddToCart = async (productId, sizeId) => {
    const token = getToken();
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    if (!productId || !sizeId) return;

    const uid = getUserId();
    if (!uid) return;

    const result = await addCartItem(uid, productId, sizeId, 1);
    alert(result.message);
  };

  // scroll otomatis ke bawah saat ada chat baru
  useEffect(() => {
    if (chatContainerRef.current && chats.length > 0) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  return (
    <div className="flex flex-col min-h-screen bg-white font-['Tenor_Sans']">
      <Header />

      <div className="flex flex-col px-4">
        {isOpen && (
          <div className="relative mb-4">
            <img
              src="/home.png"
              alt="October Collection"
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-2xl font-semibold">October Collection</h2>
            </div>
            <div
              className="flex flex-col items-center gap-1 cursor-pointer mt-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
            </div>
          </div>
        )}

        <p className="text-gray-600 text-[13px] text-center">
          HAI SASSYFRIEND 💕, WELCOME TO SASIENALA!
        </p>
        <p className="text-gray-400 text-[13px] text-center mb-4">
          Lagi Cari Kemeja Basic atau Apa Nih ?<br />
          Boleh Minsie Bantuin yaa.... 🌷
        </p>

        {/* Chat area */}
        {chats.length > 0 ? (
          <div
            ref={chatContainerRef}
            className="flex flex-col gap-4 overflow-y-auto"
            style={{ maxHeight: '60vh' }}
          >
            {chats.map((chat) => (
              <div key={chat.id}>
                <div className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                      chat.role === 'user' ? 'text-black' : 'bg-gray-100 text-gray-900'
                    }`}
                    style={chat.role === 'user' ? { backgroundColor: COLORS.secondary } : {}}
                  >
                    {chat.content}
                  </div>
                </div>

                {chat.role === 'assistant' &&
                  chat.payload?.rag_context
                    ?.filter((r) => r.document_type === 'product')
                    .map((r) => (
                      <div
                        key={r.id}
                        className="border p-4 rounded-lg shadow-sm bg-white flex gap-4 items-start mt-2"
                      >
                        {r.payload.image_url && (
                          <img
                            src={r.payload.image_url}
                            alt={r.payload.product_name}
                            className="w-24 h-24 object-cover rounded-lg"
                            onError={(e) => (e.currentTarget.src = '/broken-image.png')}
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold">{r.payload.product_name}</p>
                          <p className="text-orange-500 font-bold">
                            Rp {r.payload.price?.toLocaleString('id-ID')}
                          </p>
                          <button
                            onClick={() => handleAddToCart(r.payload.item_id, r.payload.model_id)}
                            className="bg-orange-500 text-white w-full py-2 rounded mt-2 hover:bg-orange-600"
                          >
                            + Tambah ke Keranjang
                          </button>
                        </div>
                      </div>
                    ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">{/* Kosong, tidak scroll */}</div>
        )}
      </div>

      <BottomNavSearch onSubmit={handleSend} />
    </div>
  );
};

export default Chat;
