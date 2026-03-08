import React, { useEffect, useState } from "react";
import { badgeAPI } from "../../api";
import { getTokens } from "../../api";

// Fallback demo data when not connected to backend
const DEMO_BADGES = [
  {
    id: "1",
    badge_name: "Web Dev Pioneer",
    badge_icon_url: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg",
    awarded_at: "2025-01-05",
  },
  {
    id: "2",
    badge_name: "React Mastery",
    badge_icon_url: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    awarded_at: "2025-02-10",
  },
  {
    id: "3",
    badge_name: "Node.js Developer",
    badge_icon_url: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg",
    awarded_at: "2025-03-12",
  },
  {
    id: "4",
    badge_name: "Frontend Specialist",
    badge_icon_url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg",
    awarded_at: "2025-04-20",
  },
  {
    id: "5",
    badge_name: "Database Pro",
    badge_icon_url: "https://upload.wikimedia.org/wikipedia/en/d/dd/MySQL_logo.svg",
    awarded_at: "2025-05-15",
  },
  {
    id: "6",
    badge_name: "Git Expert",
    badge_icon_url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg",
    awarded_at: "2025-06-01",
  },
];

function BadgeCard({ badge }) {
  const iconUrl =
    badge.badge_icon_url ||
    badge.icon_url ||
    "https://cdn-icons-png.flaticon.com/512/1087/1087840.png";
  const name = badge.badge_name || badge.name || "Badge";
  const date = badge.awarded_at
    ? new Date(badge.awarded_at).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    : "";

  return (
    <div className="flex flex-col items-center bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4">
      <img
        src={iconUrl}
        alt={name}
        className="w-16 h-16 object-contain rounded-full mb-3"
        onError={(e) => {
          e.target.src =
            "https://cdn-icons-png.flaticon.com/512/1087/1087840.png";
        }}
      />
      <p className="text-sm font-semibold text-center text-gray-800">{name}</p>
      {date && <p className="text-xs text-gray-400 mt-1">{date}</p>}
    </div>
  );
}

export default function Achievement() {
  const [myBadges, setMyBadges] = useState([]);
  const [allBadges, setAllBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    const hasTokens = !!getTokens();
    fetchBadges(hasTokens);
  }, []);

  const fetchBadges = async (hasTokens) => {
    try {
      if (hasTokens) {
        const [mineRes, allRes] = await Promise.all([
          badgeAPI.getMine(),
          badgeAPI.getAll(),
        ]);

        if (mineRes.status === "success") {
          setMyBadges(mineRes.data || []);
          setIsBackendConnected(true);
        }
        if (allRes.status === "success") {
          setAllBadges(allRes.data || []);
        }
      } else {
        // Show demo data for Google OAuth users
        setMyBadges(DEMO_BADGES.slice(0, 3));
        setAllBadges(DEMO_BADGES);
        setIsBackendConnected(false);
      }
    } catch (err) {
      console.error("Badge fetch error:", err);
      setMyBadges(DEMO_BADGES.slice(0, 3));
      setAllBadges(DEMO_BADGES);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full bg-white flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading badges…</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white px-8 py-10 overflow-y-auto">
      {/* Status banner */}
      {!isBackendConnected && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-amber-700 text-sm">
          🔔 <strong>Demo Mode:</strong> Connect with email/password to sync real badges from the backend.
        </div>
      )}

      {/* My Earned Badges */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">
          {isBackendConnected ? "My Earned Badges" : "Featured Badges"}
        </h1>
        <p className="text-gray-500 text-sm mb-5">
          {isBackendConnected
            ? "Badges you have earned by completing learning modules"
            : "Complete learning modules to earn real badges"}
        </p>

        {myBadges.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
            <p className="text-lg">🏅 No badges yet</p>
            <p className="text-sm mt-1">
              Complete your first learning module to earn a badge!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {myBadges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <hr className="my-10 border-gray-200" />

      {/* All Available Badges */}
      <div>
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-semibold">All Available Badges</h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Badges you can earn by completing courses
            </p>
          </div>
          <span className="text-sm text-blue-600 font-medium">
            {allBadges.length} total
          </span>
        </div>

        {allBadges.length === 0 ? (
          <p className="text-gray-400 text-sm">No badges available yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {allBadges.map((badge) => {
              const badgeData = badge.badge || badge;
              return (
                <BadgeCard
                  key={badge.id || badgeData.id}
                  badge={badgeData}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
