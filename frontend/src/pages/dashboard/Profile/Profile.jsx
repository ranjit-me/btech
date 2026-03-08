import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { authAPI, profileAPI, learningAPI, getTokens } from "../../../api";
import { useAuth } from "../../../AuthContext";
import PersonalDetails from "./PersonalDetails";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Personal Details");
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [learningStats, setLearningStats] = useState({ inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const hasTokens = !!getTokens();

      if (hasTokens) {
        const [meRes, profileRes, pathsRes] = await Promise.allSettled([
          authAPI.me(),
          profileAPI.get(),
          learningAPI.getPaths(),
        ]);

        if (meRes.status === "fulfilled" && meRes.value.status === "success") {
          setUserData(meRes.value.data);
        }
        if (profileRes.status === "fulfilled" && profileRes.value.status === "success") {
          setProfileData(profileRes.value.data);
        }
        if (pathsRes.status === "fulfilled" && pathsRes.value.results) {
          const paths = pathsRes.value.results || [];
          const completed = paths.filter((p) => p.status === "COMPLETED").length;
          setLearningStats({ inProgress: paths.length - completed, completed });
        }
      } else {
        // Google OAuth user – use local data
        const localProfile = JSON.parse(localStorage.getItem("userProfileData") || "null");
        if (localProfile) {
          setProfileData({
            cgpa: localProfile.cgpa || "N/A",
            interests: [localProfile.interestedDomain || "General"],
            favorite_company: localProfile.dreamCompany || "N/A",
            skill_level: "BEGINNER",
          });
          setUserData({
            email: localProfile.email || user?.email,
            username: localProfile.fullName || user?.name,
            date_joined: null,
          });
        }
      }
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [{ id: "Personal Details", label: "Personal Details", icon: <FaUser /> }];

  // Merged display data
  const localProfile = JSON.parse(localStorage.getItem("userProfileData") || "null");
  const displayName = userData?.username || localProfile?.fullName || user?.name || "Student";
  const displayEmail = userData?.email || localProfile?.email || user?.email || "";
  const displayPicture = user?.picture || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const combinedData = {
    student_name: displayName,
    email: displayEmail,
    phone: localProfile?.phone || "—",
    college: localProfile?.college || "—",
    degree: localProfile?.stream || "—",
    year: localProfile?.currentYear || "—",
    goal: localProfile?.careerGoal || "—",
    cgpa: profileData?.cgpa ?? localProfile?.cgpa ?? "—",
    interests: profileData?.interests || (localProfile?.interestedDomain ? [localProfile.interestedDomain] : []),
    favorite_company: profileData?.favorite_company || localProfile?.dreamCompany || "—",
    skill_level: profileData?.skill_level || "—",
    courses_in_progress: learningStats.inProgress,
    courses_completed: learningStats.completed,
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-gray-400 text-sm animate-pulse">Loading profile…</div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop View */}
      <div className="hidden lg:block h-full overflow-y-auto scrollbar-hidden">
        <div className="flex flex-col lg:flex-row gap-4 h-full p-4 bg-white rounded-2xl">
          {/* LEFT CARD */}
          <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow flex flex-col items-center">
            <img
              src={displayPicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-gray-200"
            />
            <h2 className="text-xl font-semibold text-black text-center">
              {combinedData.student_name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">{combinedData.email}</p>

            {/* Skill Level Badge */}
            {combinedData.skill_level !== "—" && (
              <span className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${combinedData.skill_level === "ADVANCED"
                ? "bg-green-100 text-green-700"
                : combinedData.skill_level === "INTERMEDIATE"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
                }`}>
                {combinedData.skill_level}
              </span>
            )}

            {/* Course Stats */}
            <div className="flex gap-6 mt-6 mb-6">
              <div className="text-center">
                <div className="text-lg font-bold text-black">
                  {combinedData.courses_in_progress}
                </div>
                <div className="text-sm text-gray-700">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-black">
                  {combinedData.courses_completed}
                </div>
                <div className="text-sm text-gray-700">Completed</div>
              </div>
            </div>

            {/* Interests */}
            {combinedData.interests.length > 0 && (
              <div className="w-full mt-2">
                <p className="text-xs text-gray-500 font-medium mb-2">Interests</p>
                <div className="flex flex-wrap gap-2">
                  {combinedData.interests.map((interest, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT CARD */}
          <div className="flex-1 bg-white p-6 rounded-xl shadow overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-black">Profile Setting</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-4 text-sm font-medium focus:outline-none whitespace-nowrap ${activeTab === tab.id
                    ? "border-b-2 border-black text-black"
                    : "text-gray-600"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "Personal Details" && (
              <PersonalDetails student={combinedData} onSaved={() => loadProfile()} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col h-screen bg-white">
        <div className="bg-white rounded-xl shadow p-4 m-2">
          <div className="flex items-center gap-3">
            <img
              src={displayPicture}
              alt="Profile"
              className="w-16 h-16 rounded-full border-2 border-gray-200"
            />
            <div>
              <h2 className="text-lg font-semibold text-black">{combinedData.student_name}</h2>
              <p className="text-xs text-gray-500">{combinedData.email}</p>
            </div>
          </div>
          <div className="flex gap-6 mt-4 justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-black">{combinedData.courses_in_progress}</div>
              <div className="text-sm text-gray-700">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-black">{combinedData.courses_completed}</div>
              <div className="text-sm text-gray-700">Completed</div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "Personal Details" && (
            <PersonalDetails student={combinedData} onSaved={() => loadProfile()} />
          )}
        </div>

        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow">
          <div className="flex justify-around py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 ${activeTab === tab.id ? "text-black font-semibold" : "text-gray-500"
                  }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-xs">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
