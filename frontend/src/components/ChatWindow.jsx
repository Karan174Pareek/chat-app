import { useRef, useEffect, useState } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

export default function ChatWindow() {
  const {
    selectedUser,
    messages,
    sendMessage,
    isLoadingMessages,
    isSendingMessage,
  } = useChat();
  const { authUser } = useAuth();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const success = await sendMessage({ text: messageInput });
    if (success) {
      setMessageInput("");
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-4">👋</div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to Orbit</h2>
          <p className="text-gray-400 text-lg">
            Select a conversation from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 relative">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700 p-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            {selectedUser.fullName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-xl text-white">{selectedUser.fullName}</h2>
            <p className="text-sm text-gray-400">{selectedUser.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-700 rounded-lg transition">📞</button>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition">📹</button>
          <button className="p-2 hover:bg-slate-700 rounded-lg transition">ℹ️</button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl animate-bounce mb-2">🔄</div>
              <span className="text-gray-400">Loading messages...</span>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-5xl mb-3">💭</div>
              <span className="text-gray-400">No messages yet. Start the conversation!</span>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.senderId === authUser?._id
                  ? "justify-end"
                  : "justify-start"
              } animate-fadeIn`}
            >
              <div
                className={`max-w-xs px-5 py-3 rounded-2xl shadow-xl transition ${
                  message.senderId === authUser?._id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-br-none border border-cyan-400"
                    : "bg-gradient-to-r from-purple-200 to-pink-200 text-gray-800 rounded-bl-none border border-purple-300"
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="sent"
                    className="max-w-xs rounded-lg mb-2 shadow-md"
                  />
                )}
                {message.text && <p className="text-sm leading-relaxed">{message.text}</p>}
                <p
                  className={`text-xs mt-2 opacity-70 ${
                    message.senderId === authUser?._id
                      ? "text-blue-100"
                      : "text-gray-400"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-t border-purple-300 p-4 shadow-xl">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <button
            type="button"
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg transition text-white text-xl transform hover:scale-110 shadow-lg"
          >
            📎
          </button>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-white text-gray-800 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition border border-purple-200 shadow-sm"
          />
          <button
            type="submit"
            disabled={isSendingMessage || !messageInput.trim()}
            className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-fuchsia-700 hover:to-purple-700 transition transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 font-semibold shadow-lg text-xl"
          >
            {isSendingMessage ? "📤" : "📤"}
          </button>
        </form>
      </div>
    </div>
  );
}
