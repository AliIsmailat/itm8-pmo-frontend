import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import axios from "axios";
import { saveToken } from "../../utils/auth";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(
        "https://itm8-pmo-system-api-dtb5fxa6cxbmagez.swedencentral-01.azurewebsites.net/api/Auth/login",
        {
          email,
          password,
        },
      );
      saveToken(res.data.token, rememberMe);
      navigate("/");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError("Felaktig e-post eller lösenord.");
      } else {
        setError("Något gick fel. Försök igen.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-gray-900">Logga in</h2>
        <p className="text-sm text-gray-500">
          Välkommen tillbaka. Ange dina uppgifter nedan.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">E-post</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="namn@itm8.com"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Lösenord</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
          />
          <label
            htmlFor="remember"
            className="text-sm text-gray-600 cursor-pointer select-none"
          >
            Kom ihåg mig
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition shadow-sm disabled:opacity-60 bg-purple-600"
        >
          {loading ? "Loggar in..." : "Logga in"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
