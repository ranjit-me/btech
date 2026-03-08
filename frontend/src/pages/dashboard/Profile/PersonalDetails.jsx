import React, { useState } from "react";
import { profileAPI, getTokens } from "../../../api";

export default function PersonalDetails({ student = {}, onSaved }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    student_name: student.student_name || "",
    phone: student.phone || "",
    college: student.college || "",
    degree: student.degree || "",
    year: student.year || "",
    cgpa: student.cgpa || "",
    favorite_company: student.favorite_company || "",
    goal: student.goal || "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      // Always persist local fields to localStorage
      const existingLocal = JSON.parse(localStorage.getItem("userProfileData") || "{}");
      const updatedLocal = {
        ...existingLocal,
        fullName: form.student_name,
        phone: form.phone,
        college: form.college,
        stream: form.degree,
        currentYear: form.year,
        dreamCompany: form.favorite_company,
        careerGoal: form.goal,
        cgpa: form.cgpa,
      };
      localStorage.setItem("userProfileData", JSON.stringify(updatedLocal));

      // If user has backend tokens, also persist to DB
      if (getTokens()) {
        const cgpaNum = parseFloat(form.cgpa);
        const payload = {};

        if (!isNaN(cgpaNum) && cgpaNum >= 0 && cgpaNum <= 10) {
          payload.cgpa = cgpaNum;
        }
        if (form.favorite_company) {
          payload.favorite_company = form.favorite_company;
        }

        if (Object.keys(payload).length > 0) {
          const res = await profileAPI.update(payload);
          if (res.status !== "success") {
            throw new Error(res.message || "Failed to save to server");
          }
        }
      }

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      if (onSaved) onSaved(form);
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      student_name: student.student_name || "",
      phone: student.phone || "",
      college: student.college || "",
      degree: student.degree || "",
      year: student.year || "",
      cgpa: student.cgpa || "",
      favorite_company: student.favorite_company || "",
      goal: student.goal || "",
    });
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated"];

  const readOnlyFields = [
    { label: "Full Name", key: "student_name", fullWidth: false },
    { label: "Phone", key: "phone", type: "tel", fullWidth: false },
    { label: "College", key: "college", fullWidth: false },
    { label: "Degree / Stream", key: "degree", fullWidth: false },
    { label: "Current Year", key: "year", type: "select", options: yearOptions, fullWidth: false },
    { label: "CGPA", key: "cgpa", type: "number", min: 0, max: 10, step: 0.1, fullWidth: false },
    { label: "Dream Company", key: "favorite_company", fullWidth: false },
    { label: "Career Goal", key: "goal", fullWidth: true },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Personal Details</h3>
        {!isEditing ? (
          <button
            onClick={() => { setIsEditing(true); setSuccess(""); setError(""); }}
            className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487A2.1 2.1 0 1 1 19.514 7.14L8.5 18.155l-3.536.884.884-3.536L16.862 4.487z" />
            </svg>
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-1.5 text-sm font-semibold border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Feedback Messages */}
      {success && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {readOnlyFields.map(({ label, key, type, options, fullWidth, min, max, step }) => (
          <div key={key} className={fullWidth ? "col-span-1 md:col-span-2" : ""}>
            <label className="block text-xs text-gray-500 mb-1 font-medium">
              {label}
            </label>
            {!isEditing ? (
              <div className={`w-full border border-gray-200 rounded-xl p-2.5 text-sm min-h-[38px] transition-colors ${isEditing ? "bg-white" : "bg-gray-50 text-gray-800"
                }`}>
                {form[key] && form[key] !== "—" ? form[key] : (
                  <span className="text-gray-400 italic">Not provided</span>
                )}
              </div>
            ) : type === "select" ? (
              <select
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              >
                <option value="">Select year</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={type || "text"}
                name={key}
                value={form[key]}
                onChange={handleChange}
                min={min}
                max={max}
                step={step}
                placeholder={`Enter your ${label.toLowerCase()}`}
                className="w-full border border-gray-300 rounded-xl p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" />
          </svg>
          Changes are saved locally and synced to your account if you're logged in.
        </p>
      )}
    </div>
  );
}
