// Roadmap.jsx — Uses Gemini AI directly from frontend (OpenAI key has quota issues)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRoute, FaMagic, FaRedo, FaChevronRight } from "react-icons/fa";
import { HiOutlineArrowRight } from "react-icons/hi";
import { learningAPI, getTokens } from "../../api";
import { toast } from "react-toastify";

const GEMINI_API_KEY = "AIzaSyCQPmDAiO3xma432EKTlVW6C6ElW9usVgk";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─── Gemini AI Roadmap Generator ───────────────────────────────────────────────
async function generateGeminiRoadmap({ domain, company, cgpa, skillLevel }) {
  const prompt = `Return ONLY valid JSON with no markdown, no code fences.
Create a detailed career learning roadmap for:
- Domain: ${domain || "Software Development"}
- Target Company: ${company || "Top Tech Company"}
- CGPA: ${cgpa || "Not specified"}
- Skill Level: ${skillLevel || "Beginner"}

JSON format:
{
  "title": "Roadmap title here",
  "description": "Brief description",
  "estimated_weeks": 12,
  "modules": [
    {
      "title": "Module Title",
      "description": "What this module covers",
      "order": 1,
      "lectures": [
        {
          "title": "Lecture Title",
          "description": "What this lecture teaches",
          "youtube_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
          "duration_minutes": 45,
          "order": 1
        }
      ]
    }
  ]
}

Generate 4-5 modules, 3-4 lectures each. Use real YouTube URLs if possible.`;

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  if (!res.ok) {
    const err = await res.json();
    const msg = err?.error?.message || "Gemini API error";
    if (msg.includes("quota") || msg.includes("429") || msg.includes("limit")) {
      throw new Error("QUOTA_EXCEEDED");
    }
    throw new Error(msg);
  }

  const result = await res.json();
  let content = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  // Strip markdown fences if present
  content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(content);
}

// ─── Demo roadmap (used when API quota is exceeded) ─────────────────────────
function buildDemoRoadmap(domain, company, skillLevel) {
  const domainModules = {
    "Web Development": [
      { title: "HTML & CSS Foundations", lectures: ["HTML5 Semantics", "CSS Flexbox & Grid", "Responsive Design"] },
      { title: "JavaScript Essentials", lectures: ["ES6+ Syntax", "DOM Manipulation", "Fetch API & Promises"] },
      { title: "React.js", lectures: ["Component Architecture", "Hooks & State", "React Router"] },
      { title: "Backend with Node.js", lectures: ["Express.js Basics", "REST API Design", "Database Integration"] },
    ],
    "AI / ML": [
      { title: "Python for ML", lectures: ["NumPy & Pandas", "Data Visualization", "Statistics Basics"] },
      { title: "Machine Learning", lectures: ["Supervised Learning", "Model Evaluation", "Feature Engineering"] },
      { title: "Deep Learning", lectures: ["Neural Networks", "CNNs & RNNs", "Transfer Learning"] },
      { title: "MLOps & Deployment", lectures: ["Model Serving", "Docker for ML", "Cloud Deployment"] },
    ],
  };

  const modules = (domainModules[domain] || domainModules["Web Development"]).map((mod, mIdx) => ({
    title: mod.title,
    description: `Core ${mod.title} concepts needed for ${company}.`,
    order: mIdx + 1,
    lectures: mod.lectures.map((lec, lIdx) => ({
      title: lec,
      description: `Master ${lec} to build production-ready skills.`,
      youtube_url: `https://www.youtube.com/results?search_query=${encodeURIComponent(lec + " tutorial")}`,
      duration_minutes: 45 + lIdx * 10,
      order: lIdx + 1,
    })),
  }));

  return {
    title: `${domain} Roadmap for ${company}`,
    description: `A structured ${skillLevel}-level learning path tailored to get you placed at ${company}.`,
    estimated_weeks: 12,
    modules,
  };
}

export default function Roadmap() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [backendPaths, setBackendPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [localPaths, setLocalPaths] = useState([]); // Gemini-generated, stored locally

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    setLoading(true);

    // Load profile from localStorage
    const storedProfile = JSON.parse(localStorage.getItem("userProfileData") || "null");
    setProfile(storedProfile);

    // Load any locally-generated Gemini paths
    const saved = JSON.parse(localStorage.getItem("geminiRoadmaps") || "[]");
    setLocalPaths(saved);

    // Also try fetching backend paths (if they exist)
    const hasTokens = !!getTokens();
    if (hasTokens) {
      try {
        const res = await learningAPI.getPaths();
        const items = res.data?.results || res.results || (Array.isArray(res.data) ? res.data : []);
        setBackendPaths(items);
      } catch (err) {
        console.warn("Backend paths unavailable:", err);
      }
    }

    setLoading(false);
  };

  const handleGenerate = async () => {
    if (!profile) {
      toast.error("Please complete your profile first!");
      return;
    }
    setGenerating(true);

    const domain = profile.interestedDomain || profile.interested_domain || "Software Development";
    const company = profile.favoriteCompany || profile.favorite_company || "Top Tech Company";
    const skillLevel = profile.skillLevel || profile.skill_level || "Beginner";

    try {
      const data = await generateGeminiRoadmap({ domain, company, cgpa: profile.cgpa, skillLevel });
      const updated = [{ ...data, id: Date.now(), source: "gemini" }, ...localPaths];
      localStorage.setItem("geminiRoadmaps", JSON.stringify(updated));
      setLocalPaths(updated);
      toast.success(`✅ "${data.title}" generated!`);
    } catch (err) {
      console.error(err);
      if (err.message === "QUOTA_EXCEEDED") {
        // Fallback: generate a realistic demo roadmap locally
        toast.info("🔄 API limit reached — generating a smart demo roadmap for you!", { autoClose: 4000 });
        const demoRoadmap = buildDemoRoadmap(domain, company, skillLevel);
        const updated = [{ ...demoRoadmap, id: Date.now(), source: "gemini" }, ...localPaths];
        localStorage.setItem("geminiRoadmaps", JSON.stringify(updated));
        setLocalPaths(updated);
        toast.success(`✅ "${demoRoadmap.title}" ready! (Add your Gemini API key to generate custom paths)`);
      } else {
        toast.error("Generation failed: " + err.message);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteLocal = (id) => {
    const updated = localPaths.filter((p) => p.id !== id);
    localStorage.setItem("geminiRoadmaps", JSON.stringify(updated));
    setLocalPaths(updated);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading roadmap…</p>
        </div>
      </div>
    );
  }

  const allPaths = [...(backendPaths || []).map(p => ({ ...p, source: "backend" })), ...localPaths];
  const domain = profile?.interestedDomain || profile?.interested_domain || "";
  const company = profile?.favoriteCompany || profile?.favorite_company || "";

  return (
    <div className="p-6 w-full h-full overflow-y-auto flex flex-col gap-6 bg-[#f7f9fc]">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Your Personalized <span className="text-blue-600">Career Path</span>
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {domain ? (
            <>
              Domain: <span className="font-semibold text-blue-700">{domain}</span>
              {company && (
                <> · Target: <span className="font-semibold text-green-700">{company}</span></>
              )}
            </>
          ) : (
            "Complete your profile setup to enable AI roadmap generation."
          )}
        </p>
      </div>

      {/* Generator Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-600 to-blue-500 p-5 rounded-2xl text-white shadow-lg shadow-blue-200">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaMagic /> AI Roadmap Generator
          </h2>
          <p className="text-blue-100 text-sm mt-0.5">
            Powered by Google Gemini · Personalized for your profile &amp; goals
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating || !profile}
          className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-xl font-bold transition flex items-center gap-2 disabled:opacity-60 whitespace-nowrap shadow"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              Crafting your path…
            </>
          ) : (
            <>
              <FaMagic size={14} />
              Generate New AI Path
            </>
          )}
        </button>
      </div>

      {/* No profile warning */}
      {!profile && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
          <p className="text-amber-800 font-semibold">⚠️ Complete your profile first</p>
          <p className="text-amber-600 text-sm mt-1">Go to Profile and fill in your CGPA, domain, and target company to enable AI generation.</p>
        </div>
      )}

      {/* Paths grid */}
      {allPaths.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-200 mb-5">
            <FaRoute size={44} />
          </div>
          <p className="text-xl font-bold text-gray-800">No roadmaps generated yet</p>
          <p className="text-gray-400 max-w-xs mt-2 text-sm">
            Click "Generate New AI Path" above to create a structured learning roadmap tailored to your career goals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {allPaths.map((path, idx) => {
            const isGemini = path.source === "gemini";
            const modulesCount = path.modules?.length || 0;
            const weeks = path.estimated_weeks || "?";
            const pathId = path.id || idx;

            return (
              <div
                key={pathId}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Badge row */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg tracking-wide ${isGemini
                      ? "bg-purple-50 text-purple-600"
                      : "bg-blue-50 text-blue-600"
                      }`}>
                      {isGemini ? "✨ Gemini AI" : "🤖 AI Path"}
                    </span>
                    {!isGemini && (
                      <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-lg ${path.status === "COMPLETED"
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                        }`}>
                        {path.status}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {path.title}
                  </h3>
                  {path.description && (
                    <p className="text-xs text-gray-400 mt-2 line-clamp-2">{path.description}</p>
                  )}

                  {/* Stats */}
                  <div className="flex gap-3 mt-4">
                    <span className="text-xs bg-gray-50 px-2.5 py-1 rounded-lg text-gray-500 font-medium">
                      📚 {modulesCount} modules
                    </span>
                    <span className="text-xs bg-gray-50 px-2.5 py-1 rounded-lg text-gray-500 font-medium">
                      🕐 {weeks} weeks
                    </span>
                  </div>
                </div>

                {/* Action footer */}
                <div className="border-t border-gray-50 px-6 py-3 flex items-center justify-between bg-gray-50/50">
                  {isGemini ? (
                    <>
                      <button
                        onClick={() => handleDeleteLocal(pathId)}
                        className="text-xs text-red-400 hover:text-red-600 font-medium transition"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          localStorage.setItem("viewingRoadmap", JSON.stringify(path));
                          navigate(`/resources/${pathId}`);
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        View Path <FaChevronRight size={10} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-xs text-gray-400">
                        {path.target_company ? `🎯 ${path.target_company}` : "AI Generated"}
                      </span>
                      <button
                        onClick={() => navigate(`/resources/backend-${path.id}`)}
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        View Path <FaChevronRight size={10} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
