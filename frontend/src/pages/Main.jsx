import React, { useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { bag, book, cap, globe, scale, set } from "../assets/main";

// Online illustration (Unsplash career theme)

const featuresCareer = [
  {
    title: "AI Career Counselor",
    color: "bg-gradient-to-b from-indigo-500 to-indigo-300",
    icon: cap,
  },
  {
    title: "Resume Builder",
    color: "bg-gradient-to-b from-green-500 to-green-300",
    icon: bag,
  },
  {
    title: "Job Match Finder",
    color: "bg-gradient-to-b from-pink-500 to-orange-400",
    icon: globe,
  },
  {
    title: "Skill Gap Analyzer",
    color: "bg-gradient-to-b from-yellow-400 to-yellow-200",
    icon: book,
  },
  {
    title: "Interview Preparation",
    color: "bg-gradient-to-b from-red-500 to-pink-400",
    icon: scale,
  },
  {
    title: "Career Progress Tracker",
    color: "bg-gradient-to-b from-blue-500 to-cyan-400",
    icon: set,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const iconFloat = {
  animate: {
    y: [0, -3, 0],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: "easeInOut",
    },
  },
};

const FeatureCard = memo(({ title, color, icon, custom }) => (
  <motion.div
    custom={custom}
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    className="flex flex-col items-center space-y-2 cursor-pointer"
  >
    <div
      className={`w-44 md:w-52 h-44 md:h-52 rounded-full flex items-center justify-center shadow-lg ${color}`}
    >
      <img
        src={icon}
        alt={title}
        className="w-20 md:w-28 object-contain"
        loading="lazy"
      />
    </div>
    <span className="text-lg sm:text-xl text-center text-[#0A2239] font-semibold">
      {title}
    </span>
  </motion.div>
));

const FloatingIcon = ({ src, alt, className, isVisible }) => (
  <motion.img
    src={src}
    alt={alt}
    className={className}
    variants={iconFloat}
    animate={isVisible ? "animate" : ""}
    loading="lazy"
  />
);

const Main = () => {
  const iconRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section className="relative w-full bg-white py-16">
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-8 md:px-16 lg:px-20 relative">
        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl text-center font-bold text-[#0A2239] mb-6">
          Empower Your Career with AI Tools
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Take charge of your future with AI-powered tools for career guidance,
          skill building, and job readiness.
        </p>

        {/* Tools Grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-20 justify-items-center mb-16"
        >
          {featuresCareer.map((feature, index) => (
            <FeatureCard key={index} {...feature} custom={index} />
          ))}
        </div>

        {/* Illustration */}

        {/* Floating icons */}
        <div className="absolute inset-0 hidden lg:block" ref={iconRef}>
          <FloatingIcon
            src={globe}
            alt="globe"
            className="absolute top-[5px] left-[80px] w-16"
            isVisible={isInView}
          />
          <FloatingIcon
            src={bag}
            alt="bag"
            className="absolute top-[300px] left-[-50px] w-16"
            isVisible={isInView}
          />
          <FloatingIcon
            src={cap}
            alt="cap"
            className="absolute bottom-[50px] left-[50px] w-16"
            isVisible={isInView}
          />
          <FloatingIcon
            src={scale}
            alt="scale"
            className="absolute bottom-[80px] right-[80px] w-16"
            isVisible={isInView}
          />
          <FloatingIcon
            src={book}
            alt="book"
            className="absolute top-[300px] right-[-80px] w-16"
            isVisible={isInView}
          />
          <FloatingIcon
            src={set}
            alt="set"
            className="absolute top-[5px] right-[20px] w-16"
            isVisible={isInView}
          />
        </div>
      </div>
    </section>
  );
};

export default Main;
