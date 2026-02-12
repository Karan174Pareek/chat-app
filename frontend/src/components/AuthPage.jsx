import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const baseInputClass =
  "w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-slate-100 placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30";

export default function AuthPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    login,
    signup,
    isLoggingIn,
    isSigningUp,
  } = useAuth();

  const [mode, setMode] = useState(pathname === "/signup" ? "signup" : "login");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setMode(pathname === "/signup" ? "signup" : "login");
  }, [pathname]);

  const isLoading = mode === "login" ? isLoggingIn : isSigningUp;
  const actionLabel = useMemo(() => (mode === "login" ? "Login" : "Sign Up"), [mode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      const result = await signup({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (result.success) {
        navigate("/chat");
      }
      return;
    }

    const result = await login({
      email: formData.email.trim(),
      password: formData.password,
    });
    if (result.success) navigate("/chat");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0F172A] px-4 py-8">
      <div className="pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-10 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="grid w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-700 bg-[#1E293B]/70 shadow-2xl backdrop-blur md:grid-cols-2">
        <div className="bg-[#0F172A] p-6 md:p-10">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 text-center md:text-left">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#F1F5F9]">Orbit</h1>
              <p className="mt-2 text-sm text-slate-300">Keeping your friends in your orbit</p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-800 p-1">
              <Link
                to="/login"
                className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${
                  mode === "login" ? "bg-[#3B82F6] text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`rounded-lg px-3 py-2 text-center text-sm font-semibold transition ${
                  mode === "signup" ? "bg-[#3B82F6] text-white" : "text-slate-300 hover:text-white"
                }`}
              >
                Sign Up
              </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#F1F5F9]">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className={baseInputClass}
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#F1F5F9]">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  required
                  className={baseInputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#F1F5F9]">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className={baseInputClass}
                />
              </div>

              {mode === "signup" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#F1F5F9]">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className={baseInputClass}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full rounded-xl bg-[#3B82F6] px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Please wait..." : actionLabel}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-slate-300 md:text-left">
              {mode === "login" ? (
                <p>
                  User ID not created yet?{" "}
                  <Link to="/signup" className="font-semibold text-[#3B82F6] hover:text-blue-300">
                    Choose Sign Up
                  </Link>
                </p>
              ) : (
                <p>
                  Already created your ID?{" "}
                  <Link to="/login" className="font-semibold text-[#3B82F6] hover:text-blue-300">
                    Choose Login
                  </Link>
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-gradient-to-b from-[#1D4ED8] via-[#3B82F6] to-[#0EA5E9] p-10 md:flex md:flex-col md:justify-between">
          <div className="relative z-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-100/90">About Orbit</p>
            <h2 className="text-3xl font-extrabold leading-tight text-white">
              Fast, secure, and colorful conversations in one place.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-blue-100/90">
              Orbit keeps your world connected with instant messaging, clean design, and reliable real-time updates.
            </p>
          </div>

          <div className="relative z-10 mt-10">
            <div className="mx-auto flex h-72 w-72 items-center justify-center rounded-[2.5rem] border border-white/20 bg-[#0F172A]/20 shadow-2xl backdrop-blur-sm">
              <div className="flex h-44 w-44 items-center justify-center rounded-full border-8 border-blue-100/50 bg-white/20 shadow-inner">
                <div className="h-24 w-24 rounded-full bg-[#0F172A]/40 p-5">
                  <div className="h-full w-full rounded-full border-4 border-blue-100/80" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-3 gap-3 text-center text-xs font-medium text-blue-100/90">
            <div className="rounded-lg bg-white/10 px-3 py-2">Realtime</div>
            <div className="rounded-lg bg-white/10 px-3 py-2">Secure</div>
            <div className="rounded-lg bg-white/10 px-3 py-2">Simple</div>
          </div>

          <div className="pointer-events-none absolute -bottom-8 -left-10 h-48 w-48 rounded-full bg-cyan-300/20 blur-2xl" />
          <div className="pointer-events-none absolute -top-10 right-0 h-52 w-52 rounded-full bg-blue-200/20 blur-2xl" />
        </div>
      </div>
    </div>
  );
}
