import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import ChatInterface from "./components/ChatInterface";

function App() {
  const { authUser, isCheckingAuth, logout } = useAuth();

  if (isCheckingAuth) {
    return (
      <div className="relative flex h-screen items-center justify-center overflow-hidden bg-[#0F172A]">
        <div className="pointer-events-none absolute -left-16 -top-14 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-14 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 w-[92%] max-w-md rounded-2xl border border-slate-700 bg-[#1E293B]/85 p-8 text-center shadow-2xl backdrop-blur">
          <div className="mx-auto mb-5 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-[#3B82F6]/20 text-lg font-bold text-[#F1F5F9]">
            Chat
          </div>
          <h2 className="text-2xl font-bold text-[#F1F5F9]">Orbit</h2>
          <p className="mt-2 text-sm text-slate-300">Keeping your friends in your orbit</p>

          <div className="mx-auto mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-700">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#3B82F6]" />
          </div>
          <p className="mt-3 text-sm text-slate-300">Loading your chats...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!authUser ? <AuthPage /> : <Navigate to="/chat" />} />
        <Route path="/signup" element={!authUser ? <AuthPage /> : <Navigate to="/chat" />} />
        <Route
          path="/chat"
          element={authUser ? <ChatInterface onLogout={logout} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={authUser ? "/chat" : "/login"} />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
