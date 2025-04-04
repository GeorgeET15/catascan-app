import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react"; // Import Lucide icons

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address (e.g., user@domain.com)");
      return;
    }

    // Password validation
    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://catascan-app-backend.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign-up failed");
      }

      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("access_token", data.access_token);
      toast.success("Sign-up successful!");
      navigate("/onboarding");
    } catch (err) {
      setError(err.message || "An error occurred during sign-up.");
      toast.error(err.message || "Sign-up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2a34] to-[#6d8c94] flex items-center justify-center p-6">
      <div className="bg-[#1a3c40]/80 backdrop-blur-xl p-8 rounded-2xl w-full max-w-sm shadow-lg border border-[#b3d1d6]/20">
        <h1 className="text-2xl font-bold text-[#b3d1d6] mb-6 text-center tracking-tight">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-3 bg-[#6d8c94]/20 text-white placeholder-[#b3d1d6]/50 rounded-xl border border-[#b3d1d6]/20 focus:outline-none focus:ring-2 focus:ring-[#b3d1d6] transition-all"
              required
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"} // Toggle between text and password
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 bg-[#6d8c94]/20 text-white placeholder-[#b3d1d6]/50 rounded-xl border border-[#b3d1d6]/20 focus:outline-none focus:ring-2 focus:ring-[#b3d1d6] transition-all"
              required
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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-[#b3d1d6] text-sm text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/signin")}
              className="underline cursor-pointer hover:text-white transition-colors"
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
