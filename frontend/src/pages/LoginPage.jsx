import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result?.success) navigate("/chat");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-600 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-5 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10 bg-white/15 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/30 transform hover:scale-102 transition">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">💬</div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-200 via-pink-200 to-purple-200 bg-clip-text text-transparent mb-2">Welcome Back</h2>
          <p className="text-lg text-white/90 font-medium">Connect with friends instantly</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition backdrop-blur font-medium"
              placeholder="john@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-white font-bold mb-2 text-sm uppercase tracking-wider">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-5 py-3 bg-white/20 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition backdrop-blur font-medium"
              placeholder="••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-500 text-white font-bold py-3 rounded-xl hover:from-cyan-500 hover:via-pink-500 hover:to-purple-600 transition transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 shadow-xl text-lg"
          >
            {isLoggingIn ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Logging in...
              </span>
            ) : (
              "🚀 Login"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white/90 text-sm">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-cyan-300 font-bold hover:text-pink-300 transition underline underline-offset-2"
            >
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
