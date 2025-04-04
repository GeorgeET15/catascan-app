import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PreviousScans = () => {
  const navigate = useNavigate();
  const [latestScan, setLatestScan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const response = await fetch(
          "https://catascan-app-backend.onrender.com/scans",
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
          throw new Error(data.error || "Failed to fetch scans");
        }

        // Sort scans by created_at in descending order and take the latest
        const sortedScans = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setLatestScan(sortedScans[0] || null); // Set the latest scan or null if empty
      } catch (err) {
        toast.error(err.message || "Failed to load previous scans.");
      } finally {
        setLoading(false);
      }
    };

    fetchScans();
  }, []);

  return (
    <div className="mt-8 w-full max-w-md">
      <h2 className="text-2xl font-semibold text-[#b3d1d6] mb-4 tracking-tight">
        Latest Scan
      </h2>
      {loading ? (
        <div className="text-[#b3d1d6] text-center">Loading scan...</div>
      ) : !latestScan ? (
        <div className="text-[#b3d1d6] text-center">
          No previous scans found.
        </div>
      ) : (
        <div
          className="w-full bg-[#1a3c40]/80 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-[#b3d1d6]/20 hover:bg-[#1a3c40]/90 transition-all duration-200 cursor-pointer"
          onClick={() =>
            navigate("/scan-results", {
              state: {
                result: {
                  scan_id: latestScan.scan_id,
                  prediction:
                    latestScan.severity_level !== "None"
                      ? "Cataract"
                      : "No Cataract",
                  confidence: latestScan.confidence, // Placeholder confidence
                  severity: latestScan.severity_level,
                  feedback: latestScan.feedback || "No feedback available.",
                  recommendation:
                    latestScan.recommendation || "No recommendation available.",
                  created_at: latestScan.created_at, // Ensures timestamp is passed
                },
              },
            })
          }
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[#b3d1d6] text-xl">📄</span>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Scan {latestScan.scan_id.slice(0, 8)}
              </h3>
              <p className="text-sm text-[#b3d1d6]/80">
                {latestScan.created_at}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium text-white">Classification</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                latestScan.severity_level === "normal"
                  ? "bg-green-500/20 text-green-300"
                  : latestScan.severity_level === "immature"
                  ? "bg-yellow-500/20 text-yellow-300"
                  : latestScan.severity_level === "mature"
                  ? "bg-orange-500/20 text-orange-300"
                  : "bg-gray-500/20 text-gray-300" // Fallback for unexpected values
              }`}
            >
              {latestScan.severity_level}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviousScans;
