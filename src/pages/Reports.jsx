import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
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
          throw new Error(data.error || "Failed to fetch reports");
        }

        setReports(data);
      } catch (err) {
        toast.error(err.message || "Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d2a34] flex items-center justify-center">
        <div className="text-[#b3d1d6] text-xl font-medium animate-pulse">
          Loading Reports...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d2a34] flex flex-col">
      <header className="fixed top-0 left-0 right-0 bg-[#1a3c40]/80 backdrop-blur-xl h-15 sm:h-32 flex items-center justify-center shadow-lg border-b border-[#b3d1d6]/20 z-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#b3d1d6] tracking-tight">
          Reports
        </h2>
      </header>

      <main className="flex-grow pt-20 sm:pt-36 pb-25 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {reports.length === 0 ? (
            <div className="bg-[#1a3c40]/50 rounded-lg p-6 text-center">
              <p className="text-[#b3d1d6] text-lg font-medium">
                No reports available.
              </p>
              <button
                onClick={() => navigate("/upload-image")}
                className="mt-4 inline-block bg-[#b3d1d6] text-[#0d2a34] px-4 py-2 rounded-full font-semibold hover:bg-[#a1c3c8] transition-colors"
              >
                Upload Now
              </button>
            </div>
          ) : (
            reports.map((report) => (
              <div
                key={report.scan_id}
                className="bg-[#1a3c40]/70 hover:bg-[#1a3c40]/90 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 shadow-md transition-colors duration-200 cursor-pointer border border-[#b3d1d6]/10"
                onClick={() =>
                  navigate("/scan-results", {
                    state: {
                      result: {
                        scan_id: report.scan_id,
                        prediction:
                          report.severity_level !== "None"
                            ? "Cataract"
                            : "No Cataract",
                        confidence: report.confidence, // Placeholder; ideally fetch from analysis
                        severity: report.severity_level,
                        feedback: report.feedback,
                        recommendation: report.recommendation || "N/A",
                      },
                    },
                  })
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-[#b3d1d6] text-lg sm:text-xl">
                      📄
                    </span>
                    <div>
                      <h2 className="text-base sm:text-lg font-semibold text-white">
                        Scan {report.scan_id.slice(0, 8)}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#b3d1d6]/70">
                        {new Date(report.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="text-[#b3d1d6] text-lg sm:text-xl">⋮</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Navbar />
    </div>
  );
};

export default Reports;
