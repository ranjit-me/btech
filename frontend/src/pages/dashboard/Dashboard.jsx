import React, { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";
import { FaUserGraduate } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaChartBar } from "react-icons/fa";
import { FaProjectDiagram } from "react-icons/fa";
import { RiUserSettingsLine } from "react-icons/ri";
import { MdEventAvailable } from "react-icons/md";
import { FiZap } from "react-icons/fi";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Profilesetup from "./Profilesetup";
import { authAPI, streakAPI, learningAPI, getTokens } from "../../api";
import { useAuth } from "../../AuthContext";

const COLORS = ["#2563EB", "#4F46E5", "#16A34A"];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [streak, setStreak] = useState(null);
  const [learningPaths, setLearningPaths] = useState([]);
  const [meData, setMeData] = useState(null);

  // Profile data from localStorage
  const localProfile = JSON.parse(localStorage.getItem("userProfileData") || "null");

  useEffect(() => {
    const data = localStorage.getItem("userProfileData");
    if (!data) {
      setShowModal(true);
    }
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const hasTokens = !!getTokens();
    if (!hasTokens) return;
    try {
      const [streakRes, pathsRes, meRes] = await Promise.allSettled([
        streakAPI.getStatus(),
        learningAPI.getPaths(),
        authAPI.me(),
      ]);

      if (streakRes.status === "fulfilled" && streakRes.value.status === "success") {
        setStreak(streakRes.value.data);
      }
      if (pathsRes.status === "fulfilled" && pathsRes.value.results) {
        setLearningPaths(pathsRes.value.results || []);
      }
      if (meRes.status === "fulfilled" && meRes.value.status === "success") {
        setMeData(meRes.value.data);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    }
  };

  // Compute chart data from profile
  const interests = localProfile?.interestedDomain || "Tech";
  const interestData = [
    { name: interests, value: 45 },
    { name: "Design", value: 20 },
    { name: "Business", value: 35 },
  ];

  const skillData = localProfile?.skills
    ? localProfile.skills
      .split(",")
      .slice(0, 5)
      .map((s, i) => ({
        skill: s.trim(),
        value: 60 + Math.floor(Math.random() * 30),
      }))
    : [
      { skill: "Problem Solving", value: 85 },
      { skill: "Communication", value: 70 },
      { skill: "Technical Skills", value: 80 },
      { skill: "Creativity", value: 65 },
      { skill: "Teamwork", value: 75 },
    ];

  // Progress
  const completed = learningPaths.filter((p) => p.status === "COMPLETED").length;
  const progressPct =
    learningPaths.length > 0
      ? Math.round((completed / learningPaths.length) * 100)
      : 45;

  const steps = [
    {
      icon: <FaChartBar size={26} className="text-[#2563EB]" />,
      title: "SQL + Power BI Case Study",
      desc: "Improve your data processing & visualization skills.",
    },
    {
      icon: <FaProjectDiagram size={26} className="text-[#2563EB]" />,
      title: "Build 2 Portfolio Projects",
      desc: "Show your skills to employers with real work.",
    },
    {
      icon: <RiUserSettingsLine size={26} className="text-[#2563EB]" />,
      title: "Interview Preparation",
      desc: "Practice HR + Technical rounds with mock interviews.",
    },
    {
      icon: <MdEventAvailable size={26} className="text-[#2563EB]" />,
      title: "Upcoming Career Workshop",
      desc: "Join expert-led session and clear your roadmap.",
    },
  ];

  const displayName =
    meData?.username || localProfile?.fullName || user?.name || "Student";

  return (
    <div className="flex flex-col gap-5 p-6 w-full h-full overflow-y-auto bg-white scrollbar-hidden">
      {showModal && <Profilesetup onClose={() => setShowModal(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-xl bg-[#2563EB] text-white shadow">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome Back, {displayName.split(" ")[0]} 👋
          </h1>
          <p className="text-sm opacity-90">
            Your career journey is progressing steadily.
          </p>
        </div>
        <button
          onClick={() => navigate("/notification")}
          className="relative p-2 hover:bg-white/20 rounded-lg transition"
        >
          <FiBell size={26} />
          {streak?.current_streak > 0 && (
            <span className="absolute -top-1 -right-1 bg-orange-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {streak.current_streak}
            </span>
          )}
        </button>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-gray-500 text-sm">Career Fit Score</h3>
          <p className="text-3xl font-bold text-[#2563EB] mt-2">
            {localProfile?.cgpa
              ? `${Math.min(100, Math.round((parseFloat(localProfile.cgpa) / 10) * 100))}%`
              : "78%"}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex items-start gap-3">
          <MdWorkOutline size={26} className="text-[#2563EB]" />
          <div>
            <h3 className="text-gray-500 text-sm">Suggested Career</h3>
            <p className="text-lg font-semibold">
              {localProfile?.interestedDomain || "Data Analyst"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex items-start gap-3">
          <FaUserGraduate size={26} className="text-[#2563EB]" />
          <div>
            <h3 className="text-gray-500 text-sm">Roadmap Progress</h3>
            <p className="text-lg font-semibold text-green-600">
              {progressPct}% Completed
            </p>
          </div>
        </div>

        {/* Streak Card */}
        <div
          className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-xl shadow flex items-start gap-3 cursor-pointer hover:shadow-md transition"
          onClick={() => navigate("/notification")}
        >
          <FiZap size={26} className="text-white" />
          <div>
            <h3 className="text-white/80 text-sm">Daily Streak</h3>
            <p className="text-lg font-bold text-white">
              {streak?.current_streak ?? "—"} days 🔥
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Skill Radar Chart */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Skill Strengths</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={skillData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" />
              <Radar
                dataKey="value"
                stroke="#2563EB"
                fill="#2563EB"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Tech Skills Bar Chart */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Technical Skill Levels</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={skillData}>
              <XAxis dataKey="skill" />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Interest Pie Chart */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-3">Career Field Interest</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={interestData} dataKey="value" outerRadius={90} label>
                {interestData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div
        onClick={() => navigate("/roadmap")}
        className="bg-white p-5 rounded-xl transition border border-transparent cursor-pointer"
      >
        <h2 className="text-lg font-semibold mb-4 text-[#2563EB]">
          Next Recommended Steps
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#2563EB]/60 transition"
            >
              <div className="mt-1">{step.icon}</div>
              <div>
                <h3 className="font-semibold text-gray-800">{step.title}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
