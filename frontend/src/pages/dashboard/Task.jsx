import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { assignmentAPI, getTokens } from "../../api";
import { toast } from "react-toastify";
import { FiCode, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const DEMO_ASSIGNMENT = {
  id: "demo",
  problem_statement:
    "Develop a fully functional E-Commerce Web Application with the following features:\n\n- Home Page with Product Listing\n- Product Detail Page\n- Add to Cart Functionality\n- User Signup / Login\n- Checkout Page\n\nYou may use any stack like: MERN, Django + React, Node + EJS, etc.",
  requirements: [
    "Home page with product listing",
    "Product detail page",
    "Add to cart functionality",
    "User authentication (signup/login)",
    "Checkout page",
  ],
  bonus_challenge: "Add payment gateway integration (Razorpay/Stripe sandbox).",
  difficulty: "MEDIUM",
  estimated_time_minutes: 180,
  sample_input: "User clicks 'Add to Cart' on a product",
  sample_output: "Product appears in cart, cart count increases by 1",
};

const LANGUAGES = ["javascript", "python", "java", "cpp"];

export default function Task() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get("id");

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // Submission state
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [solutionCode, setSolutionCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [mode, setMode] = useState("url"); // "url" | "code"

  const isBackendConnected = !!getTokens() && assignmentId && assignmentId !== "demo";

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  const fetchAssignment = async () => {
    setLoading(true);
    try {
      if (isBackendConnected) {
        const res = await assignmentAPI.getDetail(assignmentId);
        if (res.status === "success") {
          setAssignment(res.data);
        } else {
          setAssignment(DEMO_ASSIGNMENT);
        }
      } else if (getTokens()) {
        // JWT user but no specific assignment – fetch list
        const listRes = await assignmentAPI.getList();
        const items = listRes.results || listRes.data || [];
        if (items.length > 0) {
          setAssignment(items[0]);
        } else {
          setAssignment(DEMO_ASSIGNMENT);
        }
      } else {
        setAssignment(DEMO_ASSIGNMENT);
      }
    } catch (err) {
      console.error("Assignment fetch error:", err);
      setAssignment(DEMO_ASSIGNMENT);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (mode === "url" && !submissionUrl.trim()) {
      alert("Please provide your GitHub or live project link.");
      return;
    }
    if (mode === "code" && !solutionCode.trim()) {
      alert("Please enter your solution code.");
      return;
    }

    setSubmitting(true);
    try {
      const code = mode === "code" ? solutionCode : `// Project URL: ${submissionUrl}`;

      if (isBackendConnected && assignment?.id !== "demo") {
        const res = await assignmentAPI.submit(assignment.id, {
          solution_code: code,
          language,
        });
        if (res.status === "success") {
          setResult(res.data);
          setSubmitted(true);
          toast.success("Assignment submitted and evaluated!");
        } else {
          toast.error(res.message || "Submission failed.");
        }
      } else {
        // Demo mode
        localStorage.setItem("taskSubmission", submissionUrl || solutionCode);
        setSubmitted(true);
        setResult({
          score: Math.floor(Math.random() * 20) + 80,
          verdict: "PASS",
          feedback: "Great work! Your solution meets all requirements.",
          strengths: ["Clean code structure", "Good use of components"],
          improvements: ["Could improve error handling", "Add more test cases"],
        });
        toast.success("Submission received!");
      }
    } catch (err) {
      toast.error("Submission error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-gray-400 text-sm animate-pulse">Loading assignment…</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No assignment available at the moment.</p>
        <button onClick={() => navigate("/roadmap")} className="mt-4 text-blue-600 hover:underline">
          Go to Roadmap
        </button>
      </div>
    );
  }

  const difficultyColor = {
    EASY: "bg-green-100 text-green-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    HARD: "bg-red-100 text-red-700",
  };

  return (
    <div className="p-6 w-full h-full bg-[#F7F9FC] flex justify-center overflow-y-auto">
      <div className="max-w-3xl w-full flex flex-col gap-5">
        {/* Assignment Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
            <div>
              <h1 className="text-2xl font-bold text-[#2563EB]">
                {assignment.id === "demo"
                  ? "Task: E-Commerce Website"
                  : `Assignment ${assignment.difficulty ? `— ${assignment.difficulty}` : ""}`}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Complete this assignment to unlock your next learning level.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${difficultyColor[assignment.difficulty] || difficultyColor.MEDIUM}`}>
                {assignment.difficulty}
              </span>
              {assignment.estimated_time_minutes && (
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  ~{assignment.estimated_time_minutes} min
                </span>
              )}
            </div>
          </div>

          {/* Problem Statement */}
          <div className="mt-2 p-5 border rounded-xl bg-gray-50">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <FiCode className="text-[#2563EB]" /> Problem Statement
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
              {assignment.problem_statement}
            </p>
          </div>

          {/* Requirements */}
          {(assignment.requirements || []).length > 0 && (
            <div className="mt-4 p-5 border rounded-xl bg-blue-50">
              <h2 className="text-base font-semibold mb-2">Requirements</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                {assignment.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Bonus */}
          {assignment.bonus_challenge && (
            <div className="mt-4 p-4 border border-purple-200 bg-purple-50 rounded-xl">
              <p className="text-sm font-semibold text-purple-700">🚀 Bonus Challenge</p>
              <p className="text-sm text-purple-600 mt-1">{assignment.bonus_challenge}</p>
            </div>
          )}

          {/* Sample I/O */}
          {assignment.sample_input && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 border rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Sample Input</p>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{assignment.sample_input}</pre>
              </div>
              <div className="bg-gray-50 border rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Sample Output</p>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">{assignment.sample_output}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Submission Card */}
        {!submitted ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
            <h2 className="text-lg font-semibold mb-4">Submit Your Solution</h2>

            {/* Mode toggle */}
            <div className="flex gap-2 mb-4">
              {["url", "code"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${mode === m
                      ? "bg-[#2563EB] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  {m === "url" ? "🔗 Project URL" : "💻 Submit Code"}
                </button>
              ))}
            </div>

            {mode === "url" ? (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  GitHub / Live Link
                </label>
                <input
                  type="url"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2563EB] text-sm"
                  placeholder="https://github.com/yourproject OR https://yourapp.vercel.app"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Solution Code</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-2 py-1"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <textarea
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#2563EB] text-sm font-mono h-48 resize-none"
                  placeholder={`Write your ${language} solution here…`}
                  value={solutionCode}
                  onChange={(e) => setSolutionCode(e.target.value)}
                />
              </div>
            )}

            <div className="mt-5 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-[#2563EB] hover:bg-[#1F4FCF] text-white px-8 py-2.5 rounded-xl font-semibold transition shadow-sm disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit Assignment"}
              </button>
            </div>
          </div>
        ) : (
          /* Result Card */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-7">
            <div className="flex items-center gap-3 mb-5">
              {result?.verdict === "PASS" ? (
                <FiCheckCircle size={28} className="text-green-600" />
              ) : (
                <FiAlertCircle size={28} className="text-red-500" />
              )}
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  {result?.verdict === "PASS" ? "Submission Passed! 🎉" : "Submission Needs Work"}
                </h2>
                {result?.score !== undefined && (
                  <p className="text-gray-500 text-sm">Score: <strong>{result.score}/100</strong></p>
                )}
              </div>
            </div>

            {result?.feedback && (
              <p className="text-sm text-gray-700 leading-relaxed mb-4">{result.feedback}</p>
            )}

            {result?.strengths?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-semibold text-green-700 mb-1">✅ Strengths</p>
                <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                  {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            {result?.improvements?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-orange-600 mb-1">💡 Improvements</p>
                <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                  {result.improvements.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
            )}

            <button
              onClick={() => navigate("/achievements")}
              className="bg-[#2563EB] hover:bg-[#1F4FCF] text-white px-6 py-2 rounded-xl text-sm font-semibold transition"
            >
              View My Achievements
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
