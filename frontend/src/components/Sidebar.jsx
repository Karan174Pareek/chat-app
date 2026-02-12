import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import { useState } from "react";

export default function Sidebar() {
  const { authUser, logout } = useAuth();
  const { users, selectedUser, selectUser, onlineUsers, isLoadingUsers } =
    useChat();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-gradient-to-b from-indigo-900 via-purple-900 to-violet-900 border-r border-purple-700 flex flex-col h-full shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-purple-700 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-xl">
              💬
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Orbit</h1>
              <p className="text-xs text-pink-100">Messages</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-red-500/90 text-white p-2 rounded-lg hover:bg-red-600 transition transform hover:scale-110 shadow-lg"
            title="Logout"
          >
            🚪
          </button>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center gap-3 bg-white/15 p-3 rounded-xl backdrop-blur border border-white/20">
          <div className="w-11 h-11 bg-gradient-to-br from-pink-400 via-fuchsia-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-md text-sm">
            {authUser?.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {authUser?.fullName}
            </p>
            <p className="text-xs text-pink-100">🟢 Online</p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="p-4 border-b border-purple-700/50">
        <div className="relative">
          <input
            type="text"
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/15 text-white rounded-xl placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400 transition backdrop-blur border border-white/20"
          />
          <span className="absolute right-3 top-2.5 text-white/60">🔍</span>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingUsers ? (
          <div className="p-6 text-center text-purple-200 flex flex-col items-center gap-2">
            <span className="text-2xl animate-bounce">⏳</span>
            <span>Loading chats...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-6 text-center text-purple-200 flex flex-col items-center gap-2">
            <span className="text-3xl">😴</span>
            <span>{searchQuery ? "No users found" : "No users available"}</span>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => selectUser(user)}
                className={`p-4 cursor-pointer rounded-xl transition transform ${
                  selectedUser?._id === user._id
                    ? "bg-gradient-to-r from-fuchsia-500/70 to-purple-500/70 shadow-xl border border-pink-400/50 scale-98"
                    : "bg-white/10 hover:bg-white/20 border border-white/10 hover:scale-102"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg text-lg ${
                    selectedUser?._id === user._id
                      ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                      : "bg-gradient-to-br from-pink-400 via-fuchsia-400 to-purple-400"
                  }`}>
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold truncate text-white">
                        {user.fullName}
                      </h3>
                      <span className="text-xs text-purple-200">10:30 AM</span>
                    </div>
                    <p className={`text-sm truncate ${
                      selectedUser?._id === user._id ? "text-cyan-100" : "text-purple-200"
                    }`}>
                      👤 Active now
                    </p>
                  </div>
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${
                      onlineUsers.includes(user._id)
                        ? "bg-green-400 animate-pulse shadow-lg"
                        : "bg-gray-500"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
