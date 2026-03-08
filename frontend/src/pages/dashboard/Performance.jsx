import React, { useEffect, useState } from "react";
import { performanceAPI, getTokens } from "../../api";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  YAxis
} from "recharts";

export default function Performance() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await performanceAPI.getStats();
      if (res.status === "success") {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Error fetching performance stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <p className="text-gray-400 animate-pulse text-sm">Loading performance metrics...</p>
      </div>
    );
  }

  // Fallback data if API returns empty
  const subjectScores = stats?.subject_scores?.length > 0 ? stats.subject_scores : [
    { subject: "Data Analysis", score: 0 },
    { subject: "SQL", score: 0 },
  ];

  const predictedGrowth = stats?.predicted_growth || [
    { month: "Jan", score: 50 },
    { month: "Feb", score: 50 },
  ];

  const skillRadar = stats?.skill_radar || [
    { skill: "Problem Solving", level: 85 },
  ];

  return (
    <div className="p-6 flex flex-col gap-6 w-full overflow-y-auto bg-white min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Performance Portal</h1>
        <button onClick={fetchStats} className="text-xs text-blue-600 hover:underline">Refresh</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject-wise Performance */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-4 text-[#2563EB]">
            Subject-wise Roadmap Progress
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={subjectScores}>
              <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="score" fill="#2563EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-3 italic">
            Based on completed modules in your active roadmap.
          </p>
        </div>

        {/* Strength / Weakness Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-4 text-[#2563EB]">
            Skill Mastery Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={skillRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10 }} />
              <Radar
                dataKey="level"
                stroke="#2563EB"
                fill="#2563EB"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Learning Growth */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition col-span-1 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4 text-[#2563EB]">
            Learning Growth Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={predictedGrowth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ r: 4, fill: "#2563EB" }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-3">
            Your learning curve shows progress based on recent lecture completions. Maintain consistency to unlock higher achievements!
          </p>
        </div>
      </div>
    </div>
  );
}
