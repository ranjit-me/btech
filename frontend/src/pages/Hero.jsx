import React from "react";
import { motion } from "framer-motion";
import aiImage from "../assets/aiwithgirl.png";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.3 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: i * 0.2,
    },
  }),
};

const imageVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-6 sm:px-10 lg:px-20 py-16 lg:py-24 overflow-hidden">
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-10 lg:gap-20">
        {/* Text Content */}
        <motion.div
          className="text-center md:text-left max-w-2xl space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-snug">
            <motion.div custom={0} variants={lineVariants}>
              Shape Your Future with
            </motion.div>
            <motion.div custom={1} variants={lineVariants}>
              <span className="text-blue-600 drop-shadow-lg">
                CareerPath Navigator
              </span>
            </motion.div>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg md:text-xl text-gray-600"
            custom={2}
            variants={lineVariants}
          >
            Register today to get personalized career counseling, expert
            guidance on what to do (and what not to do), access to curated
            courses, and progress tracking to keep you on the right path.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4"
            custom={3}
            variants={lineVariants}
          >
            <button className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all duration-300">
              Get Started
            </button>
            <button className="w-full sm:w-auto px-8 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 hover:shadow-md transition-all duration-300">
              Learn More
            </button>
          </motion.div>
        </motion.div>

        {/* Image */}
        <motion.div
          className="max-w-sm sm:max-w-md lg:max-w-lg w-full"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <img
            src={aiImage}
            alt="Career Counseling Illustration"
            className="w-full object-cover rounded-3xl shadow-xl"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
