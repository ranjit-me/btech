import React from "react";
import { motion } from "framer-motion";
import contactImage from "../assets/contact.png";

const leftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const rightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Contact = () => {
  return (
    <section className="min-h-screen bg-white px-4 sm:px-6 py-16 flex items-center justify-center overflow-x-hidden">
      <div className="max-w-7xl w-full flex flex-col md:flex-row gap-12 items-start">
        {/* Left Side - Text and Image */}
        <motion.div
          className="w-full md:w-1/2 space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={leftVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Happy to help you!
          </h2>
          <p className="text-gray-600 text-lg">
            Need more details? Our expert academic counsellors will be happy to
            patiently explain everything that you want to know.
          </p>
          <div className="w-full flex justify-center md:justify-start">
            <img
              src={contactImage}
              alt="Contact"
              className="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-xl"
            />
          </div>
        </motion.div>

        {/* Right Side - Contact Form */}
        <motion.div
          className="w-full md:w-1/2 bg-gray-50 p-6 sm:p-8 rounded-xl shadow-lg"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={rightVariants}
        >
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Phone Number
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Message
              </label>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your message..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="cursor-pointer w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
