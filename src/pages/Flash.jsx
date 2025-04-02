import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Flash = () => {
  const navigate = useNavigate();
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Array of eye-related quotes
  const eyeQuotes = [
    "The eyes are the window to the soul.",
    "Vision is the art of seeing what is invisible to others. - Jonathan Swift",
    "The eye sees only what the mind is prepared to comprehend. - Robertson Davies",
    "Eyes are the mirror of the heart.",
    "Good vision is the key to a clear future.",
  ];

  useEffect(() => {
    // Set a random quote on mount
    setQuoteIndex(Math.floor(Math.random() * eyeQuotes.length));

    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, eyeQuotes.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d2a34] to-[#6d8c94] flex items-center justify-center p-6">
      <div className="bg-[#1a3c40]/80 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-[#b3d1d6]/20 transform transition-all hover:scale-102 duration-300">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-[#b3d1d6] tracking-tight animate-fade-in">
            Cata<span className="text-white">Scan</span>
          </h1>
          <p className="text-[#b3d1d6] mt-4 text-lg opacity-80 animate-fade-in delay-200">
            Early Detection, Modern Care
          </p>
          {/* Eye-related quote */}
          <p className="text-[#b3d1d6]/70 mt-4 text-sm italic animate-fade-in delay-400">
            "{eyeQuotes[quoteIndex]}"
          </p>
          <div className="mt-6 w-10 h-10 mx-auto border-4 border-[#b3d1d6]/50 border-t-[#b3d1d6] rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default Flash;
