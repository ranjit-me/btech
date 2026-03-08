import React, { useEffect, useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Sidebar } from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Roadmap from "./pages/Dashboard/Roadmap.jsx";
import Profile from "./pages/Dashboard/Profile/Profile.jsx";
import Recommendation from "./pages/Dashboard/Recommendation.jsx";
import Resources from "./pages/Dashboard/Resources.jsx";
import Performance from "./pages/Dashboard/Performance.jsx";
import Notification from "./pages/Dashboard/Notification.jsx";
import Achievement from "./pages/Dashboard/Achievement.jsx";
import Test from "./pages/Dashboard/Test.jsx";
import Footer from "./components/Footer.jsx";

import LandingPage from "./pages/LandingPage";
import Hero from "./pages/Hero";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Pricing from "./pages/Pricing";
import Main from "./pages/Main";
import Login from "./pages/Login";
import { useAuth } from "./AuthContext";
import Task from "./pages/Dashboard/Task.jsx";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col bg-[#eff3f6] overflow-hidden relative">
      <div className="flex flex-1 overflow-hidden relative ">
        <div className="w-60 bg-white p-4 shadow-lg h-full hidden md:block">
          <Sidebar />
        </div>

        <div className="flex-1 backdrop-blur-md rounded-lg overflow-y-auto p-0 md:p-3">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recommendation" element={<Recommendation />} />
            <Route path="/resources/:id" element={<Resources />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/achievements" element={<Achievement />} />
            <Route path="/test" element={<Test />} />
            <Route path="/task" element={<Task />} />
          </Routes>
        </div>

        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>

            <div
              className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out p-3 md:hidden ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <Sidebar onLinkClick={() => setSidebarOpen(false)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const LandingLayout = () => {
  const location = useLocation();
  const hideOnPaths = ["/login"];
  const shouldHideLayout = hideOnPaths.includes(location.pathname);
  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main className={shouldHideLayout ? "pt-0" : "pt-16"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/main" element={<Main />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      {!shouldHideLayout && <Footer />}
    </>
  );
};

const App = () => {
  const { user } = useAuth();
  console.log("Current User:", user);

  useEffect(() => {
    const handleContextMenu = (event) => event.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {user ? (
          <Route path="/*" element={<DashboardLayout />} />
        ) : (
          <Route path="/*" element={<LandingLayout />} />
        )}
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default App;
