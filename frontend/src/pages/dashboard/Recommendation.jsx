import React, { useEffect, useState } from "react";
import { internshipAPI, getTokens } from "../../api";
import { FiMapPin, FiExternalLink, FiClock, FiDollarSign, FiWifi } from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";

const DEMO_INTERNSHIPS = [
  {
    id: "1",
    company_name: "Google",
    role_title: "Software Engineering Intern",
    description: "Work on cutting-edge products used by billions of users worldwide.",
    location: "Bangalore",
    is_remote: false,
    stipend: 80000,
    deadline: "2025-04-30",
    required_skills: ["Python", "Data Structures", "Algorithms"],
    application_url: "https://careers.google.com",
  },
  {
    id: "2",
    company_name: "Microsoft",
    role_title: "Cloud Engineering Intern",
    description: "Build cloud-native applications on Azure infrastructure.",
    location: "Hyderabad",
    is_remote: true,
    stipend: 70000,
    deadline: "2025-05-15",
    required_skills: ["Azure", "Python", "JavaScript"],
    application_url: "https://careers.microsoft.com",
  },
  {
    id: "3",
    company_name: "Flipkart",
    role_title: "Data Science Intern",
    description: "Apply ML models to real e-commerce problems at scale.",
    location: "Bangalore",
    is_remote: false,
    stipend: 60000,
    deadline: "2025-03-31",
    required_skills: ["Python", "Machine Learning", "SQL"],
    application_url: "https://careers.flipkart.com",
  },
  {
    id: "4",
    company_name: "Razorpay",
    role_title: "Backend Engineering Intern",
    description: "Build and maintain robust payment processing services.",
    location: "Bangalore",
    is_remote: true,
    stipend: 65000,
    deadline: "2025-04-20",
    required_skills: ["Node.js", "PostgreSQL", "REST APIs"],
    application_url: "https://razorpay.com/careers",
  },
  {
    id: "5",
    company_name: "Swiggy",
    role_title: "Frontend Engineering Intern",
    description: "Create delightful UX for millions of food delivery customers.",
    location: "Bangalore",
    is_remote: false,
    stipend: 55000,
    deadline: "2025-05-01",
    required_skills: ["React", "JavaScript", "CSS"],
    application_url: "https://bytes.swiggy.com/careers",
  },
  {
    id: "6",
    company_name: "CRED",
    role_title: "Product Engineering Intern",
    description: "Design and ship product features for the premium fintech app.",
    location: "Remote",
    is_remote: true,
    stipend: 50000,
    deadline: "2025-06-01",
    required_skills: ["React Native", "TypeScript", "APIs"],
    application_url: "https://cred.club/careers",
  },
];

function InternshipCard({ internship }) {
  const isExpired = internship.deadline && new Date(internship.deadline) < new Date();

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-gray-800 text-base leading-tight">
            {internship.role_title}
          </h3>
          <p className="text-sm text-[#2563EB] font-semibold mt-0.5">
            {internship.company_name}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {internship.is_remote && (
            <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full border border-green-200 font-medium">
              <FiWifi size={10} /> Remote
            </span>
          )}
          {isExpired && (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              Expired
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
        {internship.description}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        {internship.location && (
          <span className="flex items-center gap-1">
            <FiMapPin size={12} /> {internship.location}
          </span>
        )}
        {internship.stipend && (
          <span className="flex items-center gap-1">
            <FiDollarSign size={12} /> ₹{internship.stipend.toLocaleString()}/mo
          </span>
        )}
        {internship.deadline && (
          <span className="flex items-center gap-1">
            <FiClock size={12} /> Apply by{" "}
            {new Date(internship.deadline).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      {/* Skills */}
      {internship.required_skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {internship.required_skills.map((skill, i) => (
            <span
              key={i}
              className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Apply button */}
      <a
        href={internship.application_url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 mt-auto py-2 rounded-xl text-sm font-semibold transition ${isExpired
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-[#2563EB] hover:bg-[#1F4FCF] text-white"
          }`}
        onClick={(e) => isExpired && e.preventDefault()}
      >
        {isExpired ? "Deadline Passed" : (
          <>
            Apply Now <FiExternalLink size={14} />
          </>
        )}
      </a>
    </div>
  );
}

export default function Recommendation() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all" | "remote" | "onsite"
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    const hasTokens = !!getTokens();
    try {
      if (hasTokens) {
        const res = await internshipAPI.getRecommended();
        if (res.status === "success" && Array.isArray(res.data) && res.data.length > 0) {
          setInternships(res.data);
          setIsBackendConnected(true);
        } else {
          // Try all internships
          const allRes = await internshipAPI.getAll();
          const data = allRes.results || allRes.data || [];
          if (data.length > 0) {
            setInternships(data);
            setIsBackendConnected(true);
          } else {
            setInternships(DEMO_INTERNSHIPS);
          }
        }
      } else {
        setInternships(DEMO_INTERNSHIPS);
      }
    } catch (err) {
      console.error("Internship fetch error:", err);
      setInternships(DEMO_INTERNSHIPS);
    } finally {
      setLoading(false);
    }
  };

  const filtered = internships.filter((i) => {
    if (filter === "remote") return i.is_remote;
    if (filter === "onsite") return !i.is_remote;
    return true;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-gray-400 text-sm animate-pulse">Loading internships…</div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full h-full overflow-y-auto bg-white flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MdWorkOutline size={26} className="text-[#2563EB]" />
          Internship Recommendations
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isBackendConnected
            ? "Personalized internships based on your profile"
            : "Featured internship opportunities (demo data)"}
        </p>
      </div>

      {/* Backend banner */}
      {!isBackendConnected && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-sm">
          🔔 <strong>Demo Mode:</strong> Sign in with email/password and complete your profile to see personalized recommendations.
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "remote", "onsite"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${filter === f
                ? "bg-[#2563EB] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {f === "all" ? "All" : f === "remote" ? "🌐 Remote" : "🏢 On-site"}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400 self-center">
          {filtered.length} opportunities
        </span>
      </div>

      {/* Internship Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((internship) => (
          <InternshipCard key={internship.id} internship={internship} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No internships match your filter.
        </div>
      )}
    </div>
  );
}
