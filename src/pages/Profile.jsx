import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          "https://catascan-app-backend.onrender.com/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || "Failed to fetch profile");

        setProfile(data.profile);
      } catch (err) {
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/home");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0d2a34] to-[#6d8c94] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-[#b3d1d6] text-lg flex items-center gap-3"
        >
          <svg
            className="animate-spin h-6 w-6 text-[#b3d1d6]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          Loading Profile...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2a34] to-[#6d8c94] flex flex-col items-center px-6 py-12">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-[#b3d1d6] tracking-tight">
          User Profile
        </h1>
        <p className="text-[#b3d1d6]/70 mt-2">Your personal information</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#1a3c40]/90 backdrop-blur-xl p-4 w-full max-w-md rounded-xl shadow-lg border border-[#b3d1d6]/20 text-[#b3d1d6]"
      >
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-red-400 text-xs text-center mb-3 bg-red-500/10 p-2 rounded-md"
          >
            {error}
          </motion.p>
        )}
        <div className="space-y-3">
          {[
            { label: "First Name", value: profile?.first_name },
            { label: "Last Name", value: profile?.last_name },
            { label: "Gender", value: profile?.gender },
            { label: "Date of Birth", value: profile?.dob },
            { label: "Age", value: profile?.age },
            { label: "Address", value: profile?.address },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="flex justify-between items-center py-1 border-b border-[#b3d1d6]/10 text-sm"
            >
              <span className="text-[#b3d1d6]/80 font-medium">
                {item.label}
              </span>
              <span className="text-[#b3d1d6]">
                {item.value || "Not provided"}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={handleLogout}
          className="mt-4 w-full bg-[#b3d1d6] text-[#0d2a34] py-2 rounded-md font-semibold text-sm hover:bg-[#b3d1d6]/80 transition-colors duration-200"
        >
          Logout
        </motion.button>
      </motion.div>

      {/* Navbar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-6 w-full max-w-2xl"
      >
        <Navbar />
      </motion.div>
    </div>
  );
};

export default Profile;
