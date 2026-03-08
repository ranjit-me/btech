import React from "react";
import { MdQuiz, MdAccessTime } from "react-icons/md";
import { FaChartLine, FaBullseye, FaBookOpen } from "react-icons/fa";
import { GiProgression } from "react-icons/gi";

export default function AnalyticsSection() {
  const subjectProgress = [
    { subject: "Math", progress: 80 },
    { subject: "Science", progress: 65 },
    { subject: "English", progress: 90 },
    { subject: "History", progress: 55 },
    { subject: "Geography", progress: 70 },
  ];

  return (
    <div className="space-y-4 h-fit overflow-y-auto scrollbar-hidden">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            title: "Mock Tests Solved",
            value: "42",
            icon: <MdQuiz />,
            color: "from-pink-500 to-rose-400",
          },
          {
            title: "Screen Time",
            value: "12h 30m",
            icon: <MdAccessTime />,
            color: "from-indigo-500 to-blue-400",
          },
          {
            title: "Avg. Score",
            value: "86%",
            icon: <FaChartLine />,
            color: "from-yellow-500 to-orange-400",
          },
          {
            title: "Course Progress",
            value: "72%",
            icon: <GiProgression />,
            color: "from-green-500 to-emerald-400",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`bg-gradient-to-r ${stat.color} text-white p-4 md:p-6 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300 flex flex-col gap-2 md:gap-3`}
          >
            <div className="text-2xl md:text-4xl opacity-90">{stat.icon}</div>
            <h4 className="text-xs md:text-sm font-medium opacity-90">
              {stat.title}
            </h4>
            <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Course Completion Progress
      <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 md:p-6 shadow-lg">
        <h3 className="text-base md:text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <FaBullseye className="text-red-500" /> Course Completion
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-4 md:h-5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 md:h-5 rounded-full"
            style={{ width: "72%" }}
          ></div>
        </div>
        <p className="text-right mt-2 text-sm text-gray-600">72% Completed</p>
      </div> */}

      {/* Subject-wise Progress as Bars */}
      <div className="bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold mb-4 md:mb-6 text-gray-800 flex items-center gap-2">
          <FaBookOpen className="text-indigo-500" /> Subject-wise Progress
        </h3>
        <div className="space-y-4 md:space-y-5">
          {subjectProgress.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>{item.subject}</span>
                <span>{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 md:h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 md:h-4 rounded-full transition-all duration-700"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
