import React from "react";
import { motion } from "framer-motion";
import about from "../assets/about/about.png";

const About = () => {
  const iconClass =
    "absolute text-black opacity-60 text-2xl transition-transform duration-300 hover:scale-125";

  return (
    <div className="bg-white min-h-screen flex flex-col md:flex-row items-center justify-center md:gap-60 sm:gap-20 px-6 md:px-6 py-16 relative overflow-hidden">
      {/* Left Side Content */}
      <motion.div
        className="max-w-xl text-left space-y-6 z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl md:text-4xl font-semibold text-black leading-snug">
          CareerPath Navigator <br /> Guiding You Toward Success
        </h1>
        <p className="text-black text-base leading-relaxed">
          At CareerPath Navigator, we believe every learner deserves clear
          guidance, the right resources, and a structured path to success. Our
          platform provides personalized career counseling, curated courses
          designed for future skills, and progress tracking tools to help you
          stay on the right track. Whether you are a student exploring options
          or a professional looking to upskill, CareerPath Navigator is here to
          guide you.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition"
        >
          Learn More About Us
        </motion.button>
      </motion.div>

      {/* Right Side Image */}
      <motion.div
        className="mt-10 md:mt-0 w-full md:w-[30%] z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img
          src={about}
          alt="Career Guidance Illustration"
          className="w-full h-auto object-contain"
        />
      </motion.div>

      {/* Background Icons (Decorative) */}
      <motion.div
        className={`${iconClass} top-4 left-4`}
        whileHover={{ rotate: 10 }}
      >
        🌐
      </motion.div>
      <motion.div
        className={`${iconClass} bottom-6 left-6`}
        whileHover={{ rotate: -10 }}
      >
        ✏️
      </motion.div>
      <motion.div
        className={`${iconClass} top-20 left-8`}
        whileHover={{ rotate: 10 }}
      >
        ⏱️
      </motion.div>
      <motion.div
        className={`${iconClass} top-4 right-10`}
        whileHover={{ rotate: -8 }}
      >
        🎓
      </motion.div>
      <motion.div
        className={`${iconClass} bottom-6 right-6`}
        whileHover={{ rotate: 8 }}
      >
        🧬
      </motion.div>
      <motion.div
        className={`${iconClass} bottom-20 right-10`}
        whileHover={{ rotate: -12 }}
      >
        🔍
      </motion.div>
      <motion.div
        className={`${iconClass} top-10 right-[45%]`}
        whileHover={{ rotate: 10 }}
      >
        💻
      </motion.div>
    </div>
  );
};

export default About;
