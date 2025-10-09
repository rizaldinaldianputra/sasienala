// src/pages/Home.jsx
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import { useChat } from '../hook/useChat';

const Chat = () => {
  const { messages, loading, error, sendMessage } = useChat();

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      {/* Header */}
      <Header />

      {/* Banner */}
      <div className="relative w-full max-w-3xl mx-auto my-6">
        <img src="/home.png" alt="October Collection" className="w-full rounded-lg object-cover" />
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-semibold">October Collection</h2>
        </div>
      </div>

      {/* Welcome Text */}
      <div className="px-4 text-center mb-6">
        <p className="text-gray-600">
          HAI RINA 💕, WELCOME TO SASIENALA!
          <br />
          Lagi Cari Kemeja Basic atau Apa Nih ?<br />
          Boleh Minsie Bantuin yaa.... 🌷
        </p>
      </div>

      {/* Chat Input */}
      <div className="px-4 mb-20">
        <div className="flex flex-wrap gap-2 mb-3">
          <button className="px-3 py-1 border rounded-full text-sm text-gray-700 bg-gray-100">
            BB 40-50 ukuran apa yang cocok?
          </button>
          <button className="px-3 py-1 border rounded-full text-sm text-gray-700 bg-gray-100">
            kemeja putih M ada?
          </button>
          <button className="px-3 py-1 border rounded-full text-sm text-gray-700 bg-gray-100">
            point saya brp?
          </button>
        </div>
        <div
          data-style="Border"
          className="w-80 h-9 px-2.5 py-2 rounded-[20px] outline outline-1 outline-neutral-200 inline-flex justify-start items-center gap-1.5"
        >
          <input
            type="text"
            placeholder="Tulis pesan kamu.."
            className="flex-1 px-4 py-2 focus:outline-none"
          />
          <button className="px-4 text-white bg-gray-800 hover:bg-gray-700"></button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Chat;
