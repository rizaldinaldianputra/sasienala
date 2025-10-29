import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavSearch from '../components/BottomNavWithSearch';
import Header from '../components/Header';
import { useCart } from '../hook/useCart';
import { useChatBot } from '../hook/useChat';
import { useProducts } from '../hook/useProduct';
import { getToken, getUserId } from '../session/session';

const Chat = ({ userId }) => {
  const navigate = useNavigate();
  const { chats, sendMessage, setChats, isTyping } = useChatBot(userId);
  const { addCartItem } = useCart();
  const { fetchProductById } = useProducts();
  const [productMap, setProductMap] = useState({});
  const [colorMap, setColorMap] = useState({});
  const [sizeMap, setSizeMap] = useState({});
  const [quantityMap, setQuantityMap] = useState({});
  const [isOpen, setIsOpen] = useState(true);
  const chatContainerRef = useRef(null);

  // scroll otomatis ke bawah
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, isTyping]);

  // fetch product detail
  useEffect(() => {
    const fetchProducts = async () => {
      if (!chats) return;
      const productDocs = chats
        .flatMap((c) => c.payload?.rag_context || [])
        .filter((r) => r.document_type === 'product' && r.payload?.item_id);

      for (const doc of productDocs) {
        const id = doc.payload.item_id;
        if (!id || productMap[id]) continue;

        try {
          const res = await fetchProductById(id);
          setProductMap((prev) => ({ ...prev, [id]: res }));
        } catch (err) {
          console.error('Gagal fetch product', err);
        }
      }
    };
    fetchProducts();
  }, [chats]);

  const handleSend = async (message) => {
    if (!message.trim()) return;

    const tempMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
    };

    setChats((prev) => [...(prev || []), tempMessage]);
    await sendMessage(message);
  };

  const handleAddToCart = async (productId, modelId, quantity = 1) => {
    const token = getToken();
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }
    if (!productId || !modelId) return;
    const uid = getUserId();
    if (!uid) return;

    const result = await addCartItem(uid, productId, modelId, quantity);
    alert(result.message);
  };

  const handleColorChange = (productId, colorIndex) => {
    setColorMap((prev) => ({ ...prev, [productId]: colorIndex }));
    const product = productMap[productId];
    const selectedModel = product?.model_list?.[colorIndex];
    setSizeMap((prev) => ({
      ...prev,
      [productId]: selectedModel?.size_list?.[0]?.model_id || null,
    }));
    setQuantityMap((prev) => ({ ...prev, [productId]: 1 }));
  };

  const handleSizeChange = (productId, sizeId) => {
    setSizeMap((prev) => ({ ...prev, [productId]: sizeId }));
  };

  const handleQuantityChange = (productId, delta) => {
    setQuantityMap((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-['Work_Sans']">
      <Header />

      <div className="flex flex-col px-4">
        {isOpen ? (
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
              onClick={() => setIsOpen(false)}
            >
              <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
              <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center gap-1 cursor-pointer m-4"
            onClick={() => setIsOpen(true)}
          >
            <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
            <div className="w-6 h-0.5 bg-gray-400 rounded"></div>
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
        <div
          ref={chatContainerRef}
          className="flex flex-col gap-4 overflow-y-auto mb-9"
          style={{ maxHeight: '60vh' }}
        >
          {(chats || []).map((chat) => {
            const isUser = chat.role === 'user';
            return (
              <div key={chat.id}>
                <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className="px-4 py-2 rounded-lg max-w-xs break-words shadow-sm"
                    style={{
                      backgroundColor: isUser ? 'rgba(251,242,231,0.7)' : '#FFFFFF',
                      color: '#333333',
                      border: '1px solid #E5E5E5',
                    }}
                  >
                    {chat.content}
                  </div>
                </div>

                {/* Product Cards */}
                {chat.role === 'assistant' &&
                  (chat.payload?.rag_context || [])
                    .filter((r) => r.document_type === 'product')
                    .map((r) => {
                      const product = productMap[r.payload?.item_id] || r.payload || {};
                      const colors = product.model_list?.map((m) => m.color) || [];
                      const colorCodes =
                        product.model_list?.map((m) => m.color_code || m.color || '#ccc') || [];
                      const selectedColorIndex = colorMap[product.item_id] || 0;
                      const selectedModel = product.model_list?.[selectedColorIndex] || {};
                      const selectedModelList = selectedModel.size_list || [];
                      const selectedSizeId =
                        sizeMap[product.item_id] || selectedModelList[0]?.model_id || null;
                      const quantity = quantityMap[product.item_id] || 1;

                      return (
                        <div
                          key={r.id}
                          className="border p-4 rounded-lg shadow-sm bg-white flex flex-col gap-3 mt-2"
                        >
                          <img
                            src={
                              selectedModel?.image || product.image_list?.[0] || '/broken-image.png'
                            }
                            alt={product.item_name || ''}
                            className="w-40 h-40 object-cover rounded-lg self-center"
                          />
                          <div>
                            <p className="font-semibold">{product.item_name || '-'}</p>
                            <p className="text-orange-500 font-semibold">
                              Rp{' '}
                              {selectedModelList
                                .find((m) => m.model_id === selectedSizeId)
                                ?.price?.toLocaleString('id-ID') || 0}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Color:</span>
                            <div className="flex gap-1">
                              {colors.map((color, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleColorChange(product.item_id, idx)}
                                  className={`w-6 h-6 rounded-full border-2 ${
                                    selectedColorIndex === idx
                                      ? 'border-gray-800'
                                      : 'border-gray-200'
                                  }`}
                                  style={{ backgroundColor: colorCodes[idx] }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Size:</span>
                            <select
                              className="border rounded px-2 py-1"
                              value={selectedSizeId || ''}
                              onChange={(e) =>
                                handleSizeChange(product.item_id, parseInt(e.target.value))
                              }
                            >
                              {selectedModelList.map((m) => (
                                <option key={m.model_id} value={m.model_id}>
                                  {m.size} - sisa {m.stock || 0}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Qty:</span>
                            <div className="flex items-center border rounded">
                              <button
                                onClick={() => handleQuantityChange(product.item_id, -1)}
                                className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                              >
                                -
                              </button>
                              <span className="px-4">{quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(product.item_id, 1)}
                                className="px-2 py-1 bg-gray-200 hover:bg-gray-300"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleAddToCart(product.item_id, selectedSizeId, quantity)
                            }
                            className="bg-orange-500 text-white w-full py-2 rounded hover:bg-orange-600"
                            disabled={!selectedSizeId}
                          >
                            + Tambah ke Keranjang
                          </button>
                        </div>
                      );
                    })}
              </div>
            );
          })}

          {/* Typing Indicator */}
        </div>
      </div>

      <BottomNavSearch onSubmit={handleSend} />
    </div>
  );
};

export default Chat;
