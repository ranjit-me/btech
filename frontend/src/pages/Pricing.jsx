import React from "react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Basic Plan",
    price: "₹199 per month",
    billed: "Billed monthly or annually. Cancel anytime.",
    features: ["Access to any 2 modules.", "AI-powered practice exercises"],
    color: "bg-purple-600",
  },
  {
    name: "Premium Plan",
    price: "₹349 a month",
    billed: "Billed annually. Cancel anytime.",
    features: ["Access to any 4 modules.", "AI-powered practice exercises"],
    color: "bg-green-600",
  },
  {
    name: "Deluxe Plan",
    price: "₹799 a month",
    billed: "Billed annually. Cancel anytime.",
    features: ["Access to all modules.", "AI-powered practice exercises"],
    color: "bg-red-600",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Pricing = () => {
  return (
    <section className="bg-white py-16 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Choose a plan for success
        </motion.h2>

        <motion.p
          className="text-gray-600 mt-4 mb-10 text-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
          Pick a plan to help you and your child to achieve faster development.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition flex flex-col h-[500px]"
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className={`h-2 w-full ${plan.color}`} />
              <div className="bg-gray-100 py-6 px-4">
                <h3 className="text-2xl font-semibold text-gray-800">{plan.name}</h3>
              </div>
              <div className="bg-white p-6 flex flex-col justify-between flex-grow">
                <div className="space-y-3">
                  <p className="text-gray-800">{plan.price}</p>
                  <p className="text-gray-500 text-sm">{plan.billed}</p>
                  <ul className="text-left list-disc pl-5 space-y-2 text-gray-700">
                    {plan.features.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
                <button className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-lg mt-6 hover:bg-yellow-500 transition flex justify-center items-center gap-2">
                  Buy Plan <span>➜</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
