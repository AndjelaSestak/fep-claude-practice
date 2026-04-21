import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/InputField";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">SecureBank</h1>
        <p className="text-gray-500 text-sm mt-1">Secure, modern banking platform</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
        <p className="text-gray-500 text-sm mt-1 mb-6">
          Enter your email and password to access your account
        </p>
        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>

        {/* Error poruka */}
        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        {/* Email */}
        <div className="mb-4">
          <Input
            label="Email"
            type="email"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <a href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
        </div>

        {/* Sign in dugme */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-primary font-medium hover:underline">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
