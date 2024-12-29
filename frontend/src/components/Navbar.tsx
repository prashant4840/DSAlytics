import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedin = localStorage.getItem("token");

  const getLinkClasses = (path: string) => {
    return location.pathname === path
      ? "text-indigo-600 border-b-2 border-indigo-600 flex max-w-max"
      : "text-black hover:text-indigo-600 transition-colors flex";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full backdrop-blur-[3px] rounded-b-3xl z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-indigo-600">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span className="font-bold text-xl">DSA Stats</span>
          </Link>
          <div className="hidden md:flex space-x-8 text-lg">
            <Link to="/profile" className={getLinkClasses("/profile")}>
              Profile
            </Link>
            <Link to="/share" className={getLinkClasses("/share")}>
              Share Profile
            </Link>
            <Link to="/Leaderboard" className={getLinkClasses("/Leaderboard")}>
              Leaderboard
            </Link>
            {isLoggedin && (
              <button
                onClick={handleLogout}
                className="text-black border px-3 rounded-lg hover:text-indigo-600 transition-colors flex">
                Log Out
              </button>
            )}
          </div>
          <button
            className="md:hidden text-black hover:text-indigo-600 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mb-5 space-y-2 mt-2">
            <Link to="/profile" className={getLinkClasses("/profile")}>
              Profile
            </Link>
            <Link to="/share" className={getLinkClasses("/share")}>
              Share Profile
            </Link>
            <Link to="/Leaderboard" className={getLinkClasses("/Leaderboard")}>
              Leaderboard
            </Link>
            {isLoggedin && (
              <button
                onClick={handleLogout}
                className="text-black border px-3 rounded-lg hover:text-indigo-600 transition-colors flex">
                Log Out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
