import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosFetch from "../lib/axiosFetch";
import { LeaderboardResponse } from "../lib/types";
import UserRow from "../components/UserRow";
import "./style/Leaderboard.css";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRequested, setIsRequested] = useState<boolean>(false);

  const fetchLeaderboardData = async (page: number) => {
    if (isRequested) return;
    setIsRequested(true);
    setIsLoading(true);
    setError(null);
    try {
      let token = localStorage.getItem("token");
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const { data } = await axiosFetch.post(
        `/leaderboard/${page}`,
        {},
        { headers }
      );
      if (data) setLeaderboardData(data);
    } catch (err) {
      setError("Failed to fetch leaderboard data");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setIsRequested(false);
      }, 1000);
    }
  };

  useEffect(() => {
    fetchLeaderboardData(currentPage);
  }, [currentPage]);

  const handleProfileClick = (userId: string) => {
    navigate(`/preview/${userId}`);
  };

  // Pagination controls with animation
  const renderPaginationNumbers = () => {
    if (!leaderboardData?.totalPages) return null;
    const pages = [];
    const totalPages = leaderboardData.totalPages;

    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPages, currentPage + 2);
      i++
    ) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-4 py-2 mx-1 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 ${
            currentPage === i
              ? "bg-indigo-600 text-white shadow-lg"
              : "bg-gray-100 hover:bg-gray-200"
          }`}>
          {i}
        </button>
      );
    }
    return pages;
  };

  // Enhanced loading skeleton with wave animation
  const LoadingSkeleton = () => (
    <div>
      {[...Array(10)].map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse flex items-center space-x-4 p-4 border-b"
          style={{
            animationDelay: `${idx * 150}ms`,
            opacity: 1 - idx * 0.1,
          }}>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/6"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="text-center my-24 p-8 bg-white rounded-lg animate-fade-in">
        <div className="text-red-600 mb-4 text-lg">{error}</div>
        <button
          onClick={() => {
            fetchLeaderboardData(currentPage);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg transition-all duration-300
            hover:bg-blue-700 hover:shadow-lg transform hover:scale-105">
          {isRequested ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-6 mx-2 text-gray-200 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <p>Retry</p>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl my-20 sm:mx-auto mx-2 bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
      <div className="relative p-8 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-y-6"></div>
        <h2 className="relative text-4xl font-bold mb-2">Global Leaderboard</h2>
        <p className="relative text-blue-100 text-sm">
          Ranking based on total problems solved
        </p>
      </div>

      {leaderboardData?.currentUser && (
        <div className="bg-gray-50 border-b border-gray-200 transform transition-all duration-300">
          <div className="p-4 font-medium text-gray-600">Your Ranking</div>
          <UserRow
            user={leaderboardData.currentUser}
            isCurrentUser={true}
            handleProfileClick={handleProfileClick}
          />
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="transition-all duration-500">
            <div className="p-4 font-medium text-gray-600">Global Ranking</div>
            {leaderboardData?.users
              .filter((user) => user.totalSolved > 0)
              .map((user, index) => (
                <div
                  key={user.userId}
                  className="transform transition-all duration-500"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    opacity: 1 - index * 0.02,
                  }}>
                  <UserRow
                    user={user}
                    isCurrentUser={
                      user.userId === leaderboardData?.currentUser?.userId
                    }
                    handleProfileClick={handleProfileClick}
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-50 flex items-center justify-between">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1 || isLoading}
          className="p-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all duration-300
            transform hover:scale-105 disabled:hover:scale-100">
          <ChevronLeft size={20} />
        </button>

        <div className="flex space-x-2">{renderPaginationNumbers()}</div>

        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === leaderboardData?.totalPages || isLoading}
          className="p-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all duration-300
            transform hover:scale-105 disabled:hover:scale-100">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
