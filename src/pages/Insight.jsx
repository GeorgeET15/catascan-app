import React from "react";
import { motion } from "framer-motion";

const Insight = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#0d2a34] text-[#b3d1d6] px-6 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-5xl font-extrabold text-center mb-12"
        >
          Insight: Eye Health & Cataracts
        </motion.h1>

        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">What Are Cataracts?</h2>
          <p className="text-[#b3d1d6]/85 text-base leading-relaxed mb-4">
            Cataracts occur when the lens of the eye becomes cloudy, leading to
            blurred vision. They’re often age-related but can also result from
            injury, genetics, or prolonged UV exposure.
          </p>
          <div className="bg-[#1a3c40]/80 backdrop-blur-lg p-6 rounded-xl border border-[#b3d1d6]/25">
            <h3 className="text-lg font-medium mb-2">Key Facts:</h3>
            <ul className="list-disc list-inside text-[#b3d1d6]/80 text-sm">
              <li>Over 50% of people over 75 have cataracts.</li>
              <li>Symptoms include blurry vision, glare, and faded colors.</li>
              <li>Early detection can improve treatment outcomes.</li>
            </ul>
          </div>
          <div className="mt-6">
            <iframe
              className="w-full h-64 rounded-lg"
              src="https://www.youtube.com/embed/_gvdXfwYfhk?si=WxoNTolq6cZSKjcr"
              title="What Are Cataracts?"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p className="text-[#b3d1d6]/70 text-sm mt-2 italic">
              Video: "What Are Cataracts?" by American Academy of Ophthalmology
            </p>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">Eye Care Essentials</h2>
          <p className="text-[#b3d1d6]/85 text-base leading-relaxed mb-4">
            Maintaining good eye health can delay or prevent conditions like
            cataracts. Here’s how:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1a3c40]/80 backdrop-blur-lg p-6 rounded-xl border border-[#b3d1d6]/25">
              <h3 className="text-lg font-medium mb-2">Daily Habits</h3>
              <ul className="list-disc list-inside text-[#b3d1d6]/80 text-sm">
                <li>Wear UV-protective sunglasses.</li>
                <li>
                  Eat foods rich in antioxidants (e.g., spinach, berries).
                </li>
                <li>Avoid smoking—it accelerates cataract formation.</li>
              </ul>
            </div>
            <div className="bg-[#1a3c40]/80 backdrop-blur-lg p-6 rounded-xl border border-[#b3d1d6]/25">
              <h3 className="text-lg font-medium mb-2">Regular Checkups</h3>
              <ul className="list-disc list-inside text-[#b3d1d6]/80 text-sm">
                <li>Get annual eye exams after age 40.</li>
                <li>Use apps like CataScan for early monitoring.</li>
                <li>Consult an eye specialist if vision changes.</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <iframe
              className="w-full h-64 rounded-lg"
              src="https://www.youtube.com/embed/hE0eZay2T0g?si=qUGO2j7np-Z5W_DP"
              title="Eye Care Tips"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p className="text-[#b3d1d6]/70 text-sm mt-2 italic">
              Video: "IMPROVE Your Eye Health - 3 Eye Care Tips" by Doctor Eye
              Health
            </p>
          </div>
        </motion.section>

        <motion.section variants={itemVariants} className="mb-16">
          <h2 className="text-2xl font-semibold mb-4">
            What to Do After a Cataract Diagnosis
          </h2>
          <p className="text-[#b3d1d6]/85 text-base leading-relaxed mb-4">
            A cataract diagnosis isn’t the end—it’s a step toward clearer
            vision. Here’s your roadmap:
          </p>
          <div className="bg-[#1a3c40]/80 backdrop-blur-lg p-6 rounded-xl border border-[#b3d1d6]/25">
            <h3 className="text-lg font-medium mb-2">Next Steps:</h3>
            <ol className="list-decimal list-inside text-[#b3d1d6]/80 text-sm space-y-2">
              <li>
                <strong>Consult an Ophthalmologist:</strong> Confirm the
                diagnosis and discuss surgery if needed.
              </li>
              <li>
                <strong>Monitor Progression:</strong> Use CataScan to track
                changes over time.
              </li>
              <li>
                <strong>Prepare for Surgery:</strong> Most cataracts are
                treatable with a quick outpatient procedure.
              </li>
              <li>
                <strong>Post-Surgery Care:</strong> Follow your doctor’s
                advice—rest, use eye drops, and avoid strain.
              </li>
            </ol>
          </div>
          <div className="mt-6">
            <iframe
              className="w-full h-64 rounded-lg"
              src="https://www.youtube.com/embed/zLdagXOdlI8?si=iWvavqXa8HGZ4FX"
              title="Cataract Surgery Explained"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p className="text-[#b3d1d6]/70 text-sm mt-2 italic">
              Video: "Cataract Surgery Explained" by Mayo Clinic
            </p>
          </div>
        </motion.section>

        <motion.p
          variants={itemVariants}
          className="text-center text-[#b3d1d6]/70 text-sm italic"
        >
          "The best way to protect your eyes is to educate yourself. Stay
          informed with CataScan."
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Insight;
