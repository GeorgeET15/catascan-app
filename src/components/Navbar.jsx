import { useNavigate, useLocation } from "react-router-dom";
import { Home, FileText, Settings, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = [
    { path: "/dashboard", icon: <Home size={24} />, label: "Home" },
    { path: "/reports", icon: <FileText size={24} />, label: "Reports" },
    { path: "/profile", icon: <User size={24} />, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1a3c40]/90 backdrop-blur-md p-3 rounded-full shadow-lg flex gap-8 border border-[#b3d1d6]/20">
      {navItems.map(({ path, icon, label }) => (
        <button
          key={path}
          className={`flex flex-col items-center p-2 rounded-full ${
            location.pathname === path
              ? "text-[#b3d1d6] bg-[#0d2a34]/50"
              : "text-white hover:text-[#b3d1d6]"
          } transition-colors duration-200`}
          onClick={() => navigate(path)}
          aria-label={label}
        >
          {icon}
          <span className="text-xs mt-1">{label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navbar;
