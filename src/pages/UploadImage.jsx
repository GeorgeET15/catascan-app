import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaUpload, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const UploadImage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Retrieve user_id from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error("No user ID found. Please sign in or sign up.");
      navigate("/signin");
    }
  }, [navigate]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setSelectedImage(file);
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      toast.error("Please capture an image");
      return;
    }
    setSelectedImage(file);
  };

  const handleScan = async () => {
    if (!selectedImage) {
      toast.error("Please upload or capture an image first!");
      return;
    }
    if (!userId) {
      toast.error("User ID is missing. Please sign in again.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("user_id", userId);

      console.log("Uploading image to /upload-image...");
      const uploadResponse = await fetch(
        "https://catascan-app-backend.onrender.com/upload-image",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || "Failed to upload image");
      }

      const { image_url, scan_id } = uploadData;
      console.log("Image uploaded successfully:", { image_url, scan_id });

      console.log("Sending request to /predict with image URL:", image_url);
      const predictResponse = await fetch(
        "https://catascan-app-backend.onrender.com/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image_url, scan_id, user_id: userId }),
        }
      );

      const predictData = await predictResponse.json();
      if (!predictResponse.ok) {
        throw new Error(predictData.error || "Failed to process image");
      }

      console.log("Prediction result:", predictData);
      navigate("/scan-results", { state: { result: predictData } });
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.message || "An error occurred while scanning the image."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d2a34] flex flex-col items-center justify-center px-4 py-6">
      <h1 className="text-2xl sm:text-2xl font-semibold text-[#b3d1d6] mb-6 sm:mb-8 tracking-wide text-center">
        Upload Your Eye Image
      </h1>

      <div className="bg-[#1a3c40]/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md shadow-lg border border-[#b3d1d6]/20">
        {/* Image Container */}
        <div className="w-full h-52 sm:h-64 md:h-72 bg-[#6d8c94]/20 rounded-xl flex items-center justify-center overflow-hidden relative">
          {selectedImage ? (
            <>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Uploaded or Captured"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-[#b3d1d6] text-[#0d2a34] p-2 rounded-full hover:bg-[#a1c3c8] transition-colors"
              >
                <FaTimes size={16} />
              </button>
            </>
          ) : (
            <div className="text-[#b3d1d6] flex flex-col items-center gap-2">
              <FaCamera size={28} />
              <span className="text-sm">No Image Selected</span>
            </div>
          )}
        </div>

        {/* Upload & Camera Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
          <label className="flex-1 bg-[#b3d1d6] text-[#0d2a34] py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-[#a1c3c8] transition-colors cursor-pointer">
            <FaUpload size={18} />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <label className="flex-1 bg-[#b3d1d6] text-[#0d2a34] py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-[#a1c3c8] transition-colors cursor-pointer">
            <FaCamera size={18} />
            <span>Take Photo</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleCameraCapture}
            />
          </label>
        </div>

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={loading || !userId}
          className={`mt-4 w-full py-3 rounded-xl font-semibold text-white ${
            loading || !userId
              ? "bg-[#6d8c94]/50 cursor-not-allowed"
              : "bg-[#1a3c40] hover:bg-[#145c5a] transition-colors"
          }`}
        >
          {loading ? "Scanning..." : "Scan Now"}
        </button>
      </div>

      <Navbar />
    </div>
  );
};

export default UploadImage;
