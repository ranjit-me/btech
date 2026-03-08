import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { profileAPI, getTokens } from "../../api";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContext";

export default function Profilesetup({ onClose }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  const [form, setForm] = useState({
    // Step 1
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    gender: "",
    city: "",
    dob: "",

    // Step 2
    college: "",
    stream: "",
    currentYear: "",
    graduationYear: "",
    cgpa: "",
    skills: "",

    // Step 3
    dreamCompany: "",
    interestedDomain: "",
    workType: "",
    expectedSalary: "",
    careerGoal: "",
    portfolioLink: "",
  });

  const navigate = useNavigate();

  const update = (field, value) => setForm({ ...form, [field]: value });

  const validateStep = () => {
    if (step === 1) {
      return form.fullName && form.email && form.phone && form.gender && form.city && form.dob;
    }
    if (step === 2) {
      return form.college && form.stream && form.currentYear && form.graduationYear && form.cgpa && form.skills;
    }
    if (step === 3) {
      return form.dreamCompany && form.interestedDomain && form.workType && form.careerGoal;
    }
    return false;
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // Save to localStorage (keeps Gemini roadmap working)
      localStorage.setItem("userProfileData", JSON.stringify(form));

      // Try saving core profile fields to backend (if JWT user)
      const tokens = getTokens();
      if (tokens?.access) {
        const profileData = {
          cgpa: parseFloat(form.cgpa) || 0,
          interests: form.interestedDomain
            ? [form.interestedDomain]
            : ["General"],
          favorite_company: form.dreamCompany || null,
          skill_level: (() => {
            const cgpa = parseFloat(form.cgpa) || 0;
            if (cgpa >= 8) return "ADVANCED";
            if (cgpa >= 6) return "INTERMEDIATE";
            return "BEGINNER";
          })(),
        };

        // Try create first, then update if 400
        const res = await profileAPI.create(profileData);
        if (res.status !== "success") {
          await profileAPI.update(profileData);
        }
      }

      toast.success("Profile saved successfully!");
      navigate("/roadmap");
      onClose();
    } catch (err) {
      console.error("Profile save error:", err);
      // Still navigate even if backend fails - localStorage is available
      toast.warning("Profile saved locally. Backend sync failed.");
      navigate("/roadmap");
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const progressPercent = (step / 3) * 100;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-2xl animate-fadeIn relative">
        {/* PROGRESS BAR */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 font-medium mb-1">
            <span>Personal</span>
            <span>Academic</span>
            <span>Career</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="h-full bg-[#2563EB] transition-all"
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center text-[#2563EB] mb-6">
          {step === 1 && "Personal Information"}
          {step === 2 && "Academic Background"}
          {step === 3 && "Career Goals"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <input
                className="input"
                placeholder="Full Name"
                defaultValue={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
              />
              <input
                className="input"
                placeholder="Email Address"
                defaultValue={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
              <input
                className="input"
                placeholder="Phone Number"
                onChange={(e) => update("phone", e.target.value)}
              />

              <select
                className="input"
                onChange={(e) => update("gender", e.target.value)}
              >
                <option hidden>Gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <input
                className="input"
                placeholder="City"
                onChange={(e) => update("city", e.target.value)}
              />
              <input
                className="input"
                type="date"
                onChange={(e) => update("dob", e.target.value)}
              />
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <input
                className="input"
                placeholder="College / Institute"
                onChange={(e) => update("college", e.target.value)}
              />
              <input
                className="input"
                placeholder="Degree & Stream (e.g., B.Sc CS)"
                onChange={(e) => update("stream", e.target.value)}
              />

              <select
                className="input"
                onChange={(e) => update("currentYear", e.target.value)}
              >
                <option hidden>Current Academic Year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>

              <input
                className="input"
                placeholder="Graduation Year"
                onChange={(e) => update("graduationYear", e.target.value)}
              />
              <input
                className="input"
                placeholder="CGPA / Percentage (e.g. 8.5)"
                onChange={(e) => update("cgpa", e.target.value)}
              />

              <textarea
                className="input col-span-2 h-20"
                placeholder="List your technical & soft skills..."
                onChange={(e) => update("skills", e.target.value)}
              />
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <select
                className="input"
                onChange={(e) => update("dreamCompany", e.target.value)}
              >
                <option hidden>Dream Company</option>
                <option>Google</option>
                <option>Microsoft</option>
                <option>Amazon</option>
                <option>Infosys</option>
                <option>TCS</option>
                <option>Accenture</option>
                <option>Open to Any</option>
              </select>

              <select
                className="input"
                onChange={(e) => update("interestedDomain", e.target.value)}
              >
                <option hidden>Interested Domain</option>
                <option>Data Science</option>
                <option>AI / ML</option>
                <option>Web Development</option>
                <option>Cybersecurity</option>
                <option>Cloud / DevOps</option>
                <option>Mobile Development</option>
              </select>

              <select
                className="input"
                onChange={(e) => update("workType", e.target.value)}
              >
                <option hidden>Preferred Work Type</option>
                <option>Remote</option>
                <option>On-Site</option>
                <option>Hybrid</option>
              </select>

              <input
                className="input"
                placeholder="Expected Salary (e.g., 6 LPA)"
                onChange={(e) => update("expectedSalary", e.target.value)}
              />

              <textarea
                className="input col-span-2 h-20"
                placeholder="Describe your long-term career goal..."
                onChange={(e) => update("careerGoal", e.target.value)}
              />

              <input
                className="input col-span-2"
                placeholder="LinkedIn / Portfolio / GitHub URL"
                onChange={(e) => update("portfolioLink", e.target.value)}
              />
            </>
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button className="btn-secondary" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : (
            <span></span>
          )}

          {step < 3 ? (
            <button
              className="btn-primary"
              onClick={() => {
                if (!validateStep()) {
                  alert("Please fill all fields before continuing.");
                  return;
                }
                setStep(step + 1);
              }}
            >
              Next
            </button>
          ) : (
            <button
              className="btn-success"
              disabled={saving}
              onClick={() => {
                if (!validateStep()) {
                  alert("Please fill all fields before submitting.");
                  return;
                }
                handleSubmit();
              }}
            >
              {saving ? "Saving…" : "Submit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
