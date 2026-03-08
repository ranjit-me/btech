import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard, MdOutlineQuiz, MdShowChart } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FiLogOut, FiBell } from "react-icons/fi";
import { IoGitBranchOutline, IoTrophyOutline, IoBriefcaseOutline } from "react-icons/io5";
import { useAuth } from "../AuthContext";

export const Sidebar = ({ onLinkClick }) => {
  const { logout } = useAuth();

  const baseClasses =
    "p-3 flex items-center gap-3 text-[15px] rounded-md font-medium transition-all";
  const activeClass = "bg-indigo-100 text-indigo-600 shadow-sm";
  const inactiveClass = "text-slate-600 hover:bg-slate-100 hover:text-slate-800";

  const handleClick = () => onLinkClick && onLinkClick();

  const navItems = [
    { to: "/dashboard", icon: <MdOutlineDashboard size={18} />, label: "Dashboard" },
    { to: "/performance", icon: <MdShowChart size={18} />, label: "Performance" },
    { to: "/roadmap", icon: <IoGitBranchOutline size={18} />, label: "Roadmap" },
    { to: "/test", icon: <MdOutlineQuiz size={18} />, label: "Test" },
    { to: "/achievements", icon: <IoTrophyOutline size={18} />, label: "Achievements" },
    { to: "/recommendation", icon: <IoBriefcaseOutline size={18} />, label: "Internships" },
    { to: "/notification", icon: <FiBell size={18} />, label: "Daily Streak" },
    { to: "/profile", icon: <CgProfile size={18} />, label: "Profile" },
  ];

  return (
    <div className="flex flex-col h-full py-4 select-none justify-between">
      <nav className="flex flex-col space-y-1 text-[15px]">
        {navItems.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClass : inactiveClass}`
            }
            onClick={handleClick}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center gap-2 mt-2 px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-100 transition"
      >
        <FiLogOut size={18} />
        Logout
      </button>
    </div>
  );
};
