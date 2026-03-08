// Resources.jsx — Displays Gemini AI roadmap modules and lectures
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, ChevronDown, ChevronUp, PlayCircle, Clock, BookOpen, ArrowLeft } from "lucide-react";

export default function Resources() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roadmap, setRoadmap] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Try to find in Gemini roadmaps (stored as array in localStorage)
    const geminiRoadmaps = JSON.parse(localStorage.getItem("geminiRoadmaps") || "[]");
    const found = geminiRoadmaps.find((r) => String(r.id) === String(id));

    if (found) {
      setRoadmap(found);
      // Expand first module by default
      if (found.modules?.length > 0) {
        setExpandedModules({ 0: true });
      }
    }

    // Load completed lectures
    const saved = JSON.parse(localStorage.getItem(`completed-${id}`) || "[]");
    setCompletedLectures(saved);
  }, [id]);

  const toggleModule = (idx) => {
    setExpandedModules((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleLecture = (lectureKey) => {
    let updated;
    if (completedLectures.includes(lectureKey)) {
      updated = completedLectures.filter((k) => k !== lectureKey);
    } else {
      updated = [...completedLectures, lectureKey];
    }
    setCompletedLectures(updated);
    localStorage.setItem(`completed-${id}`, JSON.stringify(updated));

    // Check if all lectures are done
    const totalLectures = roadmap?.modules?.reduce((sum, m) => sum + (m.lectures?.length || 0), 0) || 0;
    if (updated.length === totalLectures && totalLectures > 0) {
      setShowSuccess(true);
    }
  };

  const getYoutubeSearchUrl = (lectureTitle) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(lectureTitle + " tutorial")}`;
  };

  const totalLectures = roadmap?.modules?.reduce((sum, m) => sum + (m.lectures?.length || 0), 0) || 0;
  const progress = totalLectures > 0 ? Math.round((completedLectures.length / totalLectures) * 100) : 0;

  if (!roadmap) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-300">
          <BookOpen size={32} />
        </div>
        <p className="text-gray-600 font-semibold">Roadmap not found</p>
        <p className="text-gray-400 text-sm">This path may have been deleted or expired.</p>
        <button
          onClick={() => navigate("/roadmap")}
          className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
        >
          ← Back to Roadmap
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#f7f9fc] overflow-y-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white px-8 py-10">
        <button
          onClick={() => navigate("/roadmap")}
          className="flex items-center gap-2 text-blue-100 hover:text-white text-sm mb-6 transition"
        >
          <ArrowLeft size={16} /> Back to Roadmap
        </button>

        <div className="max-w-4xl">
          <span className="text-xs uppercase font-bold tracking-widest bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">
            ✨ Gemini AI Generated
          </span>
          <h1 className="text-3xl font-extrabold leading-snug mt-2">{roadmap.title}</h1>
          {roadmap.description && (
            <p className="text-blue-100 mt-3 text-sm max-w-2xl">{roadmap.description}</p>
          )}

          <div className="flex items-center gap-6 mt-5 text-sm text-blue-100">
            <span className="flex items-center gap-1.5"><BookOpen size={14} /> {roadmap.modules?.length || 0} Modules</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {roadmap.estimated_weeks || "?"} Weeks</span>
            <span className="flex items-center gap-1.5"><PlayCircle size={14} /> {totalLectures} Lectures</span>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md">
            <div className="flex justify-between text-xs text-blue-100 mb-1.5">
              <span>Your Progress</span>
              <span>{completedLectures.length}/{totalLectures} completed · {progress}%</span>
            </div>
            <div className="w-full bg-blue-800/50 rounded-full h-2.5">
              <div
                className="bg-white h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-4">
        {roadmap.modules?.map((module, mIdx) => (
          <div key={mIdx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Module Header */}
            <button
              onClick={() => toggleModule(mIdx)}
              className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {mIdx + 1}
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{module.title}</h2>
                  {module.description && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{module.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-medium">
                  {module.lectures?.length || 0} lectures
                </span>
                {expandedModules[mIdx] ? (
                  <ChevronUp size={18} className="text-gray-400" />
                ) : (
                  <ChevronDown size={18} className="text-gray-400" />
                )}
              </div>
            </button>

            {/* Lectures List */}
            {expandedModules[mIdx] && (
              <div className="border-t border-gray-50 divide-y divide-gray-50">
                {(module.lectures || []).map((lecture, lIdx) => {
                  const key = `${mIdx}-${lIdx}`;
                  const isDone = completedLectures.includes(key);
                  const ytSearchUrl = getYoutubeSearchUrl(lecture.title);

                  return (
                    <div key={lIdx} className={`p-5 transition-colors ${isDone ? "bg-green-50/40" : ""}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400">#{lIdx + 1}</span>
                            <h3 className={`font-semibold text-sm ${isDone ? "text-green-700 line-through" : "text-gray-800"}`}>
                              {lecture.title}
                            </h3>
                          </div>
                          {lecture.description && (
                            <p className="text-xs text-gray-400 mt-1 ml-5">{lecture.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 ml-5">
                            {lecture.duration_minutes && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock size={11} /> {lecture.duration_minutes} min
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mark Complete Button */}
                        <button
                          onClick={() => toggleLecture(key)}
                          className={`flex-shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ${isDone
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-200 hover:border-green-400"
                            }`}
                        >
                          {isDone && <Check size={14} />}
                        </button>
                      </div>

                      {/* YouTube Search Card — always works, no broken embeds */}
                      <a
                        href={ytSearchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center gap-3 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl p-3 transition group"
                      >
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-red-700 group-hover:text-red-800 truncate">
                            {lecture.title} — Tutorial
                          </p>
                          <p className="text-xs text-red-400 mt-0.5">Search & watch on YouTube →</p>
                        </div>
                        <PlayCircle size={18} className="text-red-400 group-hover:text-red-600 flex-shrink-0" />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Completion Modal */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 text-center w-80 shadow-2xl">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-500" size={32} />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900">🎉 Completed!</h2>
            <p className="text-gray-500 text-sm mt-2">
              You finished <strong>{roadmap.title}</strong>. Great work!
            </p>
            <button
              onClick={() => { setShowSuccess(false); navigate("/roadmap"); }}
              className="mt-5 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 w-full font-semibold transition"
            >
              Back to Roadmaps
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
