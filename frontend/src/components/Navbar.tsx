import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useUserContext } from "../contexts/Context";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { user, logout } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const currentUrl = location.pathname;
  const isVisible = currentUrl === "/login" || currentUrl === "/signup";
  const textDark = /^\/preview\/[^/]+$/.test(currentUrl);

  const getLinkClasses = (path: string) => {
    if (textDark) {
      return path.startsWith("/preview")
        ? "text-indigo-600 underline text-xl underline-offset-4 flex max-w-max "
        : "hover:text-indigo-600 dark:text-white text-xl text-black transition-colors flex";
    }

    return currentUrl === path
      ? "text-indigo-600 border-b-2 text-xl border-indigo-600 flex max-w-max"
      : "text-black hover:text-indigo-600 text-xl transition-colors flex";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full backdrop-blur-lg rounded-b-3xl z-50">
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
            <span
              className={`font-bold ${
                textDark ? "dark:text-white text-black" : "text-black"
              } text-xl`}>
              DEVlytics
            </span>
          </Link>
          <div className="hidden md:flex space-x-8 text-lg">
            <Link to="/profile" className={getLinkClasses("/profile")}>
              Profile
            </Link>
            <Link
              to={`/preview/${user?._id || "null"}`}
              className={getLinkClasses("/preview")}>
              Preview
            </Link>
            <Link to="/leaderboard" className={getLinkClasses("/leaderboard")}>
              Leaderboard
            </Link>
            {!isVisible &&
              (user ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-500 text-xl border border-gray-500 px-3 rounded-lg hover:text-indigo-600 transition-colors flex cursor-pointer">
                  Log Out
                </button>
              ) : (
                <Link to={"/login"}>
                  <div className="text-gray-500 text-xl border border-gray-500 line px-3 rounded-lg hover:text-indigo-600 transition-colors flex cursor-pointer">
                    Log in
                  </div>
                </Link>
              ))}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center cursor-pointer"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <button
            className={`md:hidden ${
              textDark ? "dark:text-white text-black" : "text-black"
            } hover:text-indigo-600 transition-colors`}
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
            <Link
              to={`/preview/${user?._id || "null"}`}
              className={getLinkClasses("/preview")}>
              Preview
            </Link>
            <Link to="/leaderboard" className={getLinkClasses("/leaderboard")}>
              Leaderboard
            </Link>
            {!isVisible &&
              (user ? (
                <button
                  onClick={handleLogout}
                  className=" text-gray-500 text-xl rounded-lg transition-colors flex cursor-pointer">
                  Log Out
                </button>
              ) : (
                <Link to={"/login"}>
                  <div className=" text-gray-500 text-xl mt-2 underline rounded-lg transition-colors flex cursor-pointer">
                    Log in
                  </div>
                </Link>
              ))}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-zinc-800">
              <span className="text-gray-500 text-sm">Theme</span>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center cursor-pointer"
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
