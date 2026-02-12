import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import ProfilePanel from "../components/ProfilePanel";

export default function ChatPage() {
  const { authUser } = useAuth();
  const { getUsers } = useChat();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-pink-50">
      <Sidebar />
      <ChatWindow />
      <ProfilePanel />
    </div>
  );
}
