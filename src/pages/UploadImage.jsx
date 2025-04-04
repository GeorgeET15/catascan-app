import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaUpload, FaTimes } from "react-icons/fa";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Navbar from "../components/Navbar";

const UploadImage = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null); // Final cropped image
  const [imageSrc, setImageSrc] = useState(null); // Original image for cropping
  const [crop, setCrop] = useState({ unit: "%", width: 50, aspect: 1 }); // Initial crop
  const [completedCrop, setCompletedCrop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [zoom, setZoom] = useState(1); // Default zoom
  const [dialog, setDialog] = useState({ isOpen: false, message: "" }); // Dialog state
  const imgRef = useRef(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setDialog({
        isOpen: true,
        message: "No user ID found. Please sign in or sign up.",
      });
      navigate("/signin");
    }
  }, [navigate]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setDialog({ isOpen: true, message: "Please select an image file" });
      return;
    }
    setImageSrc(URL.createObjectURL(file));
    setShowCropper(true);
    setZoom(1); // Reset zoom when new image is loaded
  };

  const handleCameraCapture = (event) => {
    const file = event.target.files[0];
    if (file && !file.type.startsWith("image/")) {
      setDialog({ isOpen: true, message: "Please capture an image" });
      return;
    }
    setImageSrc(URL.createObjectURL(file));
    setShowCropper(true);
    setZoom(1); // Reset zoom when new image is loaded
  };

  const getCroppedImg = async (image, crop, zoomLevel) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const adjustedCropX = (crop.x * scaleX) / zoomLevel;
    const adjustedCropY = (crop.y * scaleY) / zoomLevel;
    const adjustedCropWidth = (crop.width * scaleX) / zoomLevel;
    const adjustedCropHeight = (crop.height * scaleY) / zoomLevel;

    canvas.width = adjustedCropWidth;
    canvas.height = adjustedCropHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      adjustedCropX,
      adjustedCropY,
      adjustedCropWidth,
      adjustedCropHeight,
      0,
      0,
      adjustedCropWidth,
      adjustedCropHeight
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], "cropped.jpg", { type: "image/jpeg" }));
      }, "image/jpeg");
    });
  };

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      const croppedImage = await getCroppedImg(
        imgRef.current,
        completedCrop,
        zoom
      );
      setSelectedImage(croppedImage);
      setShowCropper(false);
      setZoom(1); // Reset zoom after cropping
    }
  };

  const handleScan = async () => {
    if (!selectedImage) {
      setDialog({
        isOpen: true,
        message: "Please upload or capture and crop an image first!",
      });
      return;
    }
    if (!userId) {
      setDialog({
        isOpen: true,
        message: "User ID is missing. Please sign in again.",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("user_id", userId);

      console.log("Uploading cropped image to /upload-image...");
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
      setDialog({
        isOpen: true,
        message: error.message || "An error occurred while scanning the image.",
      });
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => {
    setDialog({ isOpen: false, message: "" });
    // Reset the preview
    setSelectedImage(null);
    setImageSrc(null);
    setShowCropper(false);
    setZoom(1);
    setCompletedCrop(null);
  };

  return (
    <div className="min-h-screen bg-[#0d2a34] flex flex-col items-center justify-center px-4 py-6">
      <h1 className="text-2xl sm:text-2xl font-semibold text-[#b3d1d6] mb-6 sm:mb-8 tracking-wide text-center">
        Upload Your Eye Image
      </h1>

      <div className="bg-[#1a3c40]/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md shadow-lg border border-[#b3d1d6]/20">
        {/* Image Container */}
        <div className="w-full h-52 sm:h-64 md:h-72 bg-[#6d8c94]/20 rounded-xl flex items-center justify-center overflow-hidden relative">
          {showCropper && imageSrc ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                className="flex items-center justify-center"
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Crop me"
                  style={{
                    transform: `scale(${zoom})`,
                    maxWidth: "100%",
                    maxHeight: "100%",
                  }}
                  className="object-contain"
                  onLoad={(e) => (imgRef.current = e.target)}
                />
              </ReactCrop>
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: 0.5 }}
              >
                <svg width="50%" height="50%" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#b3d1d6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          ) : selectedImage ? (
            <>
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Cropped"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  setSelectedImage(null);
                  setImageSrc(null);
                }}
                className="absolute top-2 right-2 bg-[#b3d1d6] text-[#0d2a34] p-2 rounded-full hover:bg-[#a1c3c8] transition-colors"
              >
                <FaTimes size={16} color="#0d2a34" />
              </button>
            </>
          ) : (
            <div className="text-[#b3d1d6] flex flex-col items-center gap-2">
              <FaCamera size={28} color="#b3d1d6" />
              <span className="text-sm">No Image Selected</span>
            </div>
          )}
        </div>

        {showCropper && (
          <div className="mt-4">
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full"
            />
            <button
              onClick={handleCropComplete}
              className="mt-2 w-full bg-[#b3d1d6] text-[#0d2a34] py-2 rounded-xl font-semibold hover:bg-[#a1c3c8] transition-colors"
            >
              Apply Crop
            </button>
          </div>
        )}

        {!showCropper && !selectedImage && (
          <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:gap-4">
            <label className="flex-1 bg-[#b3d1d6] text-[#0d2a34] py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-[#a1c3c8] transition-colors cursor-pointer">
              <FaUpload size={18} color="#0d2a34" />
              <span>Upload Image</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <label className="flex-1 bg-[#b3d1d6] text-[#0d2a34] py-3 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-[#a1c3c8] transition-colors cursor-pointer">
              <FaCamera size={18} color="#0d2a34" />
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
        )}

        {!showCropper && selectedImage && (
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
        )}
      </div>

      {/* Smaller Dialog Box */}
      {dialog.isOpen && (
        <div className="fixed inset-0 bg-[#1a3c40]/80 backdrop-blur-xl p-8 w-full max-w-sm shadow-lg border border-[#b3d1d6]/20 flex items-center justify-center z-50">
          <div className="bg-[#1a3c40] p-4 rounded-xl shadow-lg border border-[#b3d1d6]/20 w-full max-w-xs">
            <h2 className="text-md font-semibold text-[#b3d1d6] mb-2">Error</h2>
            <p className="text-[#b3d1d6] text-sm mb-4">{dialog.message}</p>
            <button
              onClick={closeDialog}
              className="w-full bg-[#b3d1d6] text-[#0d2a34] py-1.5 rounded-xl font-semibold hover:bg-[#a1c3c8] transition-colors text-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <Navbar />
    </div>
  );
};

export default UploadImage;
