import { useChat } from "../context/ChatContext";

export default function ProfilePanel() {
  const { selectedUser, onlineUsers } = useChat();

  if (!selectedUser) {
    return (
      <div className="w-80 bg-gradient-to-b from-cyan-100 via-blue-100 to-purple-100 border-l border-purple-300 hidden lg:flex flex-col items-center justify-center shadow-xl">
        <div className="text-6xl mb-4 animate-bounce">👤</div>
        <p className="text-purple-600 font-semibold">Select a chat to view profile</p>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="w-80 bg-gradient-to-b from-cyan-100 via-blue-100 to-purple-100 border-l border-purple-300 flex flex-col hidden lg:flex shadow-2xl">
      <div className="p-6 border-b-4 border-purple-400 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-center shadow-lg">
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-300 to-pink-400 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4 shadow-xl text-4xl border-4 border-white/40">
          {selectedUser.fullName?.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-white">{selectedUser.fullName}</h2>
        <p className="text-sm text-cyan-100 mt-1 font-medium">{selectedUser.email}</p>
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-300 animate-pulse shadow-lg' : 'bg-gray-400'}`}></div>
          <span className="text-xs text-white font-semibold">{isOnline ? '🟢 Active now' : '⚫ Offline'}</span>
        </div>
      </div>

      <div className="p-6 border-b-2 border-purple-300 space-y-3 bg-white/60">
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 rounded-xl transition font-semibold shadow-lg transform hover:scale-105 text-lg">
          💬 Chat
        </button>
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white py-3 rounded-xl transition font-semibold shadow-lg transform hover:scale-105 text-lg">
          📹 Video Call
        </button>
        <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white py-3 rounded-xl transition font-semibold shadow-lg transform hover:scale-105 text-lg">
          👥 View Friends
        </button>
      </div>

      <div className="p-6 border-b-2 border-purple-300 bg-white/40">
        <button className="flex items-center justify-between w-full text-purple-700 hover:text-purple-900 transition font-semibold group">
          <span className="flex items-center gap-3 text-lg">
            <span className="text-2xl group-hover:animate-spin">⭐</span> Add to Favorites
          </span>
          <span className="text-2xl group-hover:translate-x-1 transition">›</span>
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col bg-white/50">
        <h3 className="text-purple-700 font-bold mb-4 flex items-center gap-2 text-lg">
          <span className="text-2xl">📎</span> Attachments
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="aspect-square bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center text-3xl hover:scale-110 transition cursor-pointer shadow-lg transform hover:-translate-y-1">
            📄
          </div>
          <div className="aspect-square bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-xl flex items-center justify-center text-3xl hover:scale-110 transition cursor-pointer shadow-lg transform hover:-translate-y-1">
            🎵
          </div>
          <div className="aspect-square bg-gradient-to-br from-pink-400 to-red-500 rounded-xl flex items-center justify-center text-3xl hover:scale-110 transition cursor-pointer shadow-lg transform hover:-translate-y-1">
            🖼️
          </div>
          <div className="aspect-square bg-gradient-to-br from-orange-400 to-yellow-500 rounded-xl flex items-center justify-center text-3xl hover:scale-110 transition cursor-pointer shadow-lg transform hover:-translate-y-1">
            🎬
          </div>
          <div className="aspect-square bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-3xl hover:scale-110 transition cursor-pointer shadow-lg transform hover:-translate-y-1">
            📸
          </div>
          <div className="aspect-square bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center text-2xl hover:scale-110 transition cursor-pointer shadow-lg font-bold text-white transform hover:-translate-y-1">
            +
          </div>
        </div>
      </div>

      <div className="p-4 border-t-2 border-purple-300 text-sm text-purple-700 text-center font-semibold bg-white/70">
        ✨ Joined recently • 🟢 Active
      </div>
    </div>
  );
}
