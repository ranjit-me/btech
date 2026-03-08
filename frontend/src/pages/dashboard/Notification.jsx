import React, { useEffect, useState } from "react";
import { streakAPI, getTokens } from "../../api";
import { toast } from "react-toastify";
import { FiZap, FiCheckCircle, FiCalendar, FiAward } from "react-icons/fi";

const DEMO_PROBLEM = {
  title: "Two Sum",
  problem_statement:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
  difficulty: "EASY",
  tags: ["Array", "Hash Table"],
  date: new Date().toISOString().slice(0, 10),
};

const DEMO_STREAK = {
  current_streak: 3,
  longest_streak: 7,
  last_solved_date: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
};

export default function Notification() {
  const [todayProblem, setTodayProblem] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solved, setSolved] = useState(false);
  const [marking, setMarking] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const hasTokens = !!getTokens();
    try {
      if (hasTokens) {
        const [problemRes, statusRes] = await Promise.all([
          streakAPI.getToday(),
          streakAPI.getStatus(),
        ]);

        if (problemRes.status === "success" && problemRes.data) {
          setTodayProblem(problemRes.data);
          setIsBackendConnected(true);

          // Check if already solved today
          const today = new Date().toISOString().slice(0, 10);
          const status = statusRes?.data;
          setStreak(status);
          if (status?.last_solved_date === today) {
            setSolved(true);
          }
        } else {
          setTodayProblem(DEMO_PROBLEM);
          setStreak(DEMO_STREAK);
        }
      } else {
        setTodayProblem(DEMO_PROBLEM);
        setStreak(DEMO_STREAK);
      }
    } catch (err) {
      console.error("Streak fetch error:", err);
      setTodayProblem(DEMO_PROBLEM);
      setStreak(DEMO_STREAK);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSolved = async () => {
    if (!isBackendConnected) {
      toast.info("Connect with email/password to track your real streak!");
      setSolved(true);
      return;
    }
    setMarking(true);
    try {
      const res = await streakAPI.markSolved();
      if (res.status === "success") {
        setSolved(true);
        setStreak(res.data);
        toast.success("🎉 Problem marked as solved! Streak updated!");
      } else {
        toast.error(res.message || "Failed to mark as solved.");
      }
    } catch (err) {
      toast.error("Error marking problem as solved.");
    } finally {
      setMarking(false);
    }
  };

  const difficultyColor = {
    EASY: "bg-green-100 text-green-700 border border-green-200",
    MEDIUM: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    HARD: "bg-red-100 text-red-700 border border-red-200",
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-gray-400 text-sm animate-pulse">Loading…</div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full h-full overflow-y-auto bg-white flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Daily Streak & DSA Challenge</h1>
        <p className="text-gray-500 text-sm mt-1">
          Solve one problem each day to maintain your streak
        </p>
      </div>

      {/* Backend status banner */}
      {!isBackendConnected && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-sm">
          🔔 <strong>Demo Mode:</strong> Sign in with email/password to track your real streak.
        </div>
      )}

      {/* Streak Stats */}
      {streak && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 text-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FiZap size={20} />
              <span className="text-sm font-medium opacity-90">Current Streak</span>
            </div>
            <p className="text-3xl font-bold">
              {streak.current_streak} <span className="text-lg">days</span>
            </p>
          </div>
          <div className="bg-gradient-to-br from-violet-500 to-purple-600 text-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <FiAward size={20} />
              <span className="text-sm font-medium opacity-90">Longest Streak</span>
            </div>
            <p className="text-3xl font-bold">
              {streak.longest_streak} <span className="text-lg">days</span>
            </p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-5 rounded-xl shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <FiCalendar size={20} />
              <span className="text-sm font-medium opacity-90">Last Solved</span>
            </div>
            <p className="text-lg font-semibold">
              {streak.last_solved_date
                ? new Date(streak.last_solved_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
                : "—"}
            </p>
          </div>
        </div>
      )}

      {/* Today's Problem */}
      {todayProblem && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1">📅 Today's Problem</p>
              <h2 className="text-xl font-bold text-gray-800">{todayProblem.title}</h2>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyColor[todayProblem.difficulty] || difficultyColor.EASY
                }`}
            >
              {todayProblem.difficulty}
            </span>
          </div>

          {/* Tags */}
          {todayProblem.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {todayProblem.tags.map((tag, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Problem Statement */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed mb-5">
            {todayProblem.problem_statement}
          </div>

          {/* Solve / Solved Button */}
          {solved ? (
            <div className="flex items-center gap-3 text-green-600 font-semibold">
              <FiCheckCircle size={22} />
              <span>Problem solved today! Keep it up 🔥</span>
            </div>
          ) : (
            <button
              onClick={handleMarkSolved}
              disabled={marking}
              className="bg-[#2563EB] hover:bg-[#1F4FCF] text-white px-6 py-2.5 rounded-xl font-semibold transition shadow-sm disabled:opacity-60"
            >
              {marking ? "Marking…" : "✅ Mark as Solved"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
