import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Import Lucide icons

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    // Email validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address (e.g., user@domain.com)");
      return;
    }

    // Password validation
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://catascan-app-backend.onrender.com/signin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign-in failed");
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user_id);
      navigate("/signinsuccess");
    } catch (err) {
      setError(err.message || "An error occurred during sign-in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2a34] to-[#6d8c94] flex items-center justify-center p-6">
      <div className="bg-[#1a3c40]/80 backdrop-blur-xl p-8 rounded-2xl w-full max-w-sm shadow-lg border border-[#b3d1d6]/20">
        <h1 className="text-2xl font-bold text-[#b3d1d6] mb-6 text-center tracking-tight">
          Sign In
        </h1>

        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full p-3 bg-[#6d8c94]/20 text-white placeholder-[#b3d1d6]/50 rounded-xl border border-[#b3d1d6]/20 focus:outline-none focus:ring-2 focus:ring-[#b3d1d6] transition-all"
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 bg-[#6d8c94]/20 text-white placeholder-[#b3d1d6]/50 rounded-xl border border-[#b3d1d6]/20 focus:outline-none focus:ring-2 focus:ring-[#b3d1d6] transition-all"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#b3d1d6] cursor-pointer hover:text-white transition-colors"
            >
              {showPassword ? (
                <Eye size={20} /> // Icon when password is visible
              ) : (
                <EyeOff size={20} /> // Icon when password is hidden
              )}
            </span>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-[#b3d1d6] text-[#0d2a34] rounded-xl font-semibold hover:bg-[#a1c3c8] transition-all duration-200 shadow-md"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-[#b3d1d6] text-sm text-center">
            New here?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="underline cursor-pointer hover:text-white transition-colors"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
