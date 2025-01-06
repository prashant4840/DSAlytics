import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import axiosFetch from "../lib/axiosFetch";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const currentUrl = location.pathname;
  const isVisible = currentUrl === "/login" || currentUrl === "/signup";
  const textDark = /^\/preview\/[^/]+$/.test(currentUrl);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        return;
      }
      try {
        const { data } = await axiosFetch.get<{
          success: boolean;
          id: string;
        }>("/api/user/id", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!data.success) throw new Error("Not authorized");
        setUserId(data.id);
      } catch (error: any) {
        if (error.response?.status === 429) {
          console.error("Rate limit exceeded:", error.response.data.message);
          window.location.href = "/";
        } else {
          console.error("Authentication or data fetching error:", error);
        }
        setUserId(null);
      }
    };

    fetchData();
  }, [token]);

  const getLinkClasses = (path: string) => {
    if (textDark) {
      return path.startsWith("/preview")
        ? "text-indigo-600 underline underline-offset-4 flex max-w-max "
        : "hover:text-indigo-600 dark:text-white text-black transition-colors flex";
    }

    return currentUrl === path
      ? "text-indigo-600 border-b-2 border-indigo-600 flex max-w-max"
      : "text-black hover:text-indigo-600 transition-colors flex";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.replace("/");
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
              DSA Stats
            </span>
          </Link>
          <div className="hidden md:flex space-x-8 text-lg">
            <Link to="/profile" className={getLinkClasses("/profile")}>
              Profile
            </Link>
            <Link
              to={`/preview/${userId}`}
              className={getLinkClasses("/preview")}>
              Preview
            </Link>
            <Link to="/Leaderboard" className={getLinkClasses("/Leaderboard")}>
              Leaderboard
            </Link>
            {!isVisible &&
              (token ? (
                <button
                  onClick={handleLogout}
                  className="text-gray-500 border border-gray-500 px-3 rounded-lg hover:text-indigo-600 transition-colors flex">
                  Log Out
                </button>
              ) : (
                <Link to={"/login"}>
                  <div className="text-gray-500 border border-gray-500 line px-3 rounded-lg hover:text-indigo-600 transition-colors flex">
                    Log in
                  </div>
                </Link>
              ))}
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
              to={`/preview/${userId}`}
              className={getLinkClasses("/preview")}>
              Preview
            </Link>
            <Link to="/Leaderboard" className={getLinkClasses("/Leaderboard")}>
              Leaderboard
            </Link>
            {!isVisible &&
              (token ? (
                <button
                  onClick={handleLogout}
                  className=" text-gray-500  rounded-lg transition-colors flex">
                  Log Out
                </button>
              ) : (
                <Link to={"/login"}>
                  <div className=" text-gray-500  mt-2 underline rounded-lg transition-colors flex">
                    Log in
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </nav>
  );
};
