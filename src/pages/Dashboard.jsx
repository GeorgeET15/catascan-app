// src/components/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ScanEye, Lightbulb } from "lucide-react";
import Navbar from "../components/Navbar";
import PreviousScans from "../components/PreviousScans";
import NearbyEyeCareFacilities from "../components/NearbyEyeCareFacilities";

const Dashboard = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("User");
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("No access token found. Please sign in.");
          navigate("/signin");
          return;
        }

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
        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch profile");
        }

        if (data.profile && data.profile.first_name) {
          setFirstName(data.profile.first_name);
        }
      } catch (err) {
        console.error("Error fetching profile:", err.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2a34] to-[#6d8c94] p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-10 tracking-tight drop-shadow-lg">
        Welcome,{" "}
        <span className="text-[#b3d1d6]">
          {loadingProfile ? "Loading..." : firstName}
        </span>
      </h1>

      <div className="bg-[#1a3c40]/80 backdrop-blur-xl p-8 rounded-2xl w-full max-w-md shadow-xl border border-[#b3d1d6]/20 transform hover:scale-102 transition-transform duration-200">
        <div className="space-y-6">
          <button
            className="w-full bg-[#b3d1d6] text-[#0d2a34] p-6 rounded-xl flex items-center justify-between shadow-md hover:bg-[#a1c3c8] transition-all duration-200"
            onClick={() => navigate("/upload-image")}
          >
            <div className="flex items-center gap-3">
              <ScanEye size={28} />
              <span className="text-lg font-semibold">Scan</span>
            </div>
            <span className="text-sm opacity-75">Analyze Image</span>
          </button>
          <button
            className="w-full bg-[#b3d1d6] text-[#0d2a34] p-6 rounded-xl flex items-center justify-between shadow-md hover:bg-[#a1c3c8] transition-all duration-200"
            onClick={() => navigate("/insight")}
          >
            <div className="flex items-center gap-3">
              <Lightbulb size={28} />
              <span className="text-lg font-semibold">Insight</span>
            </div>
            <span className="text-sm opacity-75">Learn More</span>
          </button>
        </div>
      </div>

      <PreviousScans />

      <NearbyEyeCareFacilities />

      <Navbar />
    </div>
  );
};

export default Dashboard;
