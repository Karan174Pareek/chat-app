import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, BellOff, Compass, LogOut, MessageCircle, PlusCircle, Search, SendHorizontal, Trash2, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

const toId = (value) => {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.$oid) return String(value.$oid);
  if (typeof value === "object" && value._id) return String(value._id);
  if (typeof value?.toString === "function") return String(value.toString());
  return String(value);
};

export default function ChatInterface({ onLogout }) {
  const { authUser } = useAuth();
  const {
    users,
    selectedUser,
    messages,
    onlineUsers,
    isLoadingUsers,
    isLoadingMessages,
    isSendingMessage,
    getUsers,
    selectUser,
    sendMessage,
    notificationsEnabled,
    notificationPermission,
    setNotificationPreference,
    deleteCurrentConversation,
    isDeletingConversation,
  } = useChat();

  const [query, setQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [dismissedUserIds, setDismissedUserIds] = useState([]);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return users.filter((user) => !dismissedUserIds.includes(toId(user._id)));
    }

    return users.filter((user) => user.fullName?.toLowerCase().includes(needle));
  }, [query, users, dismissedUserIds]);

  const handleDismissUser = (event, userId) => {
    event.stopPropagation();
    const id = toId(userId);
    setDismissedUserIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleSelectUser = (user) => {
    const id = toId(user._id);
    setDismissedUserIds((prev) => prev.filter((dismissedId) => dismissedId !== id));
    selectUser(user);
  };

  const currentUserId = toId(authUser?._id);
  const getMessageMeta = (message) => {
    const senderId = toId(message.senderId);
    const receiverId = toId(message.receiverId);
    const sentByMeToSelected = senderId === currentUserId && receiverId === toId(selectedUser?._id);
    const sentBySelectedToMe = senderId === toId(selectedUser?._id) && receiverId === currentUserId;
    const isMine = sentByMeToSelected || (!sentBySelectedToMe && senderId === currentUserId);

    if (isMine) {
      return { isMine: true, label: "Me" };
    }

    const senderFromList = users.find((user) => toId(user._id) === senderId);
    const label = senderFromList?.fullName || selectedUser?.fullName || "User";
    return { isMine: false, label };
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const text = messageInput.trim();
    if (!text || !selectedUser || isSendingMessage) return;

    const sent = await sendMessage({ text });
    if (sent) setMessageInput("");
  };

  return (
    <div className="relative flex h-dvh w-full items-stretch justify-stretch overflow-hidden bg-[#0F172A] p-2 md:p-4">
      <div className="pointer-events-none absolute -top-20 left-8 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative flex h-full w-full max-w-[1600px] overflow-hidden rounded-2xl border border-slate-700/80 shadow-2xl">
        <aside className="flex h-full w-80 flex-col border-r border-slate-700 bg-[#1E293B] md:w-96">
          <div className="border-b border-slate-700 p-5">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-[#3B82F6]/20 p-2 text-[#3B82F6]">
                  <MessageCircle size={22} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-[#F1F5F9]">Orbit</h1>
                  <p className="text-xs text-slate-400">{authUser?.fullName || "Keeping your friends in your orbit"}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>

            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search chats..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#0F172A] py-2.5 pl-9 pr-3 text-sm text-[#F1F5F9] placeholder-slate-400 outline-none transition focus:border-[#3B82F6]"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {isLoadingUsers ? (
              <p className="p-3 text-sm text-slate-300">Loading users...</p>
            ) : filteredUsers.length === 0 ? (
              <p className="p-3 text-sm text-slate-300">
                No users available. Create another account in a different browser/device to start chatting.
              </p>
            ) : (
              filteredUsers.map((user) => {
                const isSelected = toId(selectedUser?._id) === toId(user._id);
                const isOnline = onlineUsers.some((id) => toId(id) === toId(user._id));
                const isDismissed = dismissedUserIds.includes(toId(user._id));

                return (
                  <div
                    key={user._id}
                    onClick={() => handleSelectUser(user)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? "border-[#3B82F6]/60 bg-[#3B82F6]/20"
                        : "border-transparent bg-[#0F172A]/60 hover:border-slate-700 hover:bg-slate-800/80"
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="truncate font-semibold text-[#F1F5F9]">{user.fullName}</p>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-green-400" : "bg-slate-500"}`} />
                        <button
                          type="button"
                          onClick={(event) => handleDismissUser(event, user._id)}
                          className="rounded-md p-1 text-slate-400 transition hover:bg-slate-700 hover:text-white"
                          title="Remove user from list"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="truncate text-sm text-slate-300">
                      {isDismissed && query.trim() ? "Found via search" : isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-slate-700 p-4">
            <button
              type="button"
              onClick={getUsers}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3B82F6] py-2.5 font-semibold text-white transition hover:bg-blue-500"
            >
              <PlusCircle size={18} />
              Refresh Users
            </button>
          </div>
        </aside>

        <main className="flex flex-1 flex-col bg-[#0F172A]">
          {selectedUser ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-700 bg-[#1E293B] px-6 py-4">
                <div>
                  <h2 className="text-lg font-semibold text-[#F1F5F9]">{selectedUser.fullName}</h2>
                  <p className="text-sm text-slate-400">
                    {onlineUsers.some((id) => toId(id) === toId(selectedUser._id)) ? "Online" : "Offline"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNotificationPreference(!notificationsEnabled)}
                    className="rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
                    title={
                      notificationsEnabled
                        ? "Disable notifications"
                        : notificationPermission === "denied"
                          ? "Enable notifications (permission needed)"
                          : "Enable notifications"
                    }
                  >
                    {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
                  </button>
                  <button className="rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700">
                    <Compass size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const ok = window.confirm("Delete this chat for you only?");
                      if (!ok) return;
                      await deleteCurrentConversation();
                    }}
                    disabled={isDeletingConversation}
                    className="rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    title="Delete chat"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div
                ref={messagesContainerRef}
                className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_45%)] px-6 py-5"
              >
                {isLoadingMessages && messages.length === 0 ? (
                  <p className="text-sm text-slate-300">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-slate-300">No messages yet. Start the conversation.</p>
                ) : (
                  messages.map((message) => {
                    const { isMine, label } = getMessageMeta(message);

                    return (
                      <div key={message._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-xl rounded-2xl px-4 py-3 text-sm shadow-lg ${
                            isMine
                              ? "rounded-br-md bg-slate-100 text-slate-900"
                              : "rounded-bl-md bg-white text-slate-900"
                          }`}
                        >
                          <p className="mb-1 text-base font-semibold">{label}</p>
                          {message.image && (
                            <img src={message.image} alt="message" className="mb-2 max-h-64 rounded-lg object-cover" />
                          )}
                          {message.text && <p>{message.text}</p>}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="border-t border-slate-700 bg-[#1E293B] p-4">
                <form onSubmit={handleSend} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    className="flex-1 rounded-xl border border-slate-700 bg-[#0F172A] px-4 py-3 text-[#F1F5F9] placeholder-slate-400 outline-none focus:border-[#3B82F6]"
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() || isSendingMessage}
                    className="rounded-xl bg-[#3B82F6] p-3 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    title="Send"
                  >
                    <SendHorizontal size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center px-8 text-center">
              <div>
                <h2 className="text-2xl font-bold text-[#F1F5F9]">Select a user to start chatting</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Login from another account in a second browser tab or another device, then select that user here.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
