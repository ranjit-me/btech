import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../api";
import { toast } from "react-toastify";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("login"); // "login" | "register"

  // ── Email form state ─────────────────────────────────────────
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    password_confirm: "",
  });

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  // ── Google OAuth ─────────────────────────────────────────────
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      setLoading(true);
      setError(null);
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        sub: decoded.sub,
        authType: "google",
      };
      loginWithGoogle(userData);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Failed to process Google login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  // ── Email / Password Login ───────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.login({
        email: form.email,
        password: form.password,
      });

      if (data.access) {
        // SimpleJWT default response: { access, refresh }
        const userData = {
          email: form.email,
          name: form.email.split("@")[0],
          authType: "jwt",
        };
        login(userData, { access: data.access, refresh: data.refresh });
        toast.success("Logged in successfully!");
        navigate("/dashboard", { replace: true });
      } else {
        setError(data?.detail || "Invalid credentials.");
      }
    } catch (err) {
      setError("Login failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── Register ─────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await authAPI.register(form);

      if (data.data?.tokens) {
        const { tokens, email, username } = data.data;
        const userData = {
          email,
          name: username,
          authType: "jwt",
        };
        login(userData, tokens);
        toast.success("Account created successfully!");
        navigate("/dashboard", { replace: true });
      } else {
        // Show first error message
        const firstError =
          data?.detail ||
          Object.values(data || {})
            .flat()
            .join(" ") ||
          "Registration failed.";
        setError(firstError);
      }
    } catch (err) {
      setError("Registration failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 via-blue-50 to-white">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Career Navigator
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            AI-powered career guidance platform
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 border rounded-xl overflow-hidden">
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); }}
              className={`flex-1 py-2 text-sm font-semibold transition ${tab === t
                  ? "bg-[#2563EB] text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
            >
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* ── LOGIN FORM ─────────────────── */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] transition"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1F4FCF] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        )}

        {/* ── REGISTER FORM ──────────────── */}
        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Username"
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] transition"
            />
            <input
              type="email"
              required
              placeholder="Email address"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] transition"
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] transition"
            />
            <input
              type="password"
              required
              placeholder="Confirm password"
              value={form.password_confirm}
              onChange={(e) => update("password_confirm", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#2563EB] transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] hover:bg-[#1F4FCF] text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow border-t border-gray-200" />
          <span className="px-3 text-gray-400 text-xs">or continue with</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </div>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6 text-center">
          By signing in, you agree to our{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">Terms</span>{" "}
          &{" "}
          <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
