import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#0d2a34] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background gradient circle */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] bg-gradient-to-br from-[#6d8c94]/25 to-transparent rounded-full -translate-x-1/3 translate-y-[-60%]"></div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12"
      >
        {/* Left Section: Branding */}
        <motion.div
          variants={itemVariants}
          className="text-center md:text-left max-w-lg"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#b3d1d6] leading-tight tracking-tight">
            Cata
            <span className="text-white  px-3 py-1 rounded-lg">Scan</span>
          </h1>
          <p className="text-[#b3d1d6]/85 text-base md:text-lg mt-4 leading-relaxed">
            Empowering you with AI-driven cataract detection. Simple. Fast. From
            your phone.
          </p>
        </motion.div>

        {/* Right Section: Actions */}
        <motion.div
          variants={itemVariants}
          className="bg-[#1a3c40]/80 backdrop-blur-lg p-8 rounded-2xl border border-[#b3d1d6]/25 w-full max-w-xs shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-[#b3d1d6] mb-6 text-center">
            Take Control
          </h2>
          <div className="flex flex-col space-y-4">
            <button
              className="w-full py-3 bg-gradient-to-r from-[#b3d1d6] to-[#8bb0b8] text-[#0d2a34] rounded-lg font-semibold text-base shadow-md transition-all duration-300 hover:shadow-xl hover:scale-105 focus:ring-2 focus:ring-[#b3d1d6]/60 active:scale-98"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </button>
            <button
              className="w-full py-3 bg-transparent text-[#b3d1d6] rounded-lg font-semibold text-base border border-[#b3d1d6]/60 transition-all duration-300 hover:bg-[#b3d1d6]/15 hover:scale-105 focus:ring-2 focus:ring-[#b3d1d6]/60 active:scale-98"
              onClick={() => navigate("/signup")}
            >
              Register
            </button>
          </div>
          <p className="text-[#b3d1d6]/70 text-sm text-center mt-6 italic">
            "Vision is a gift—protect it."
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
