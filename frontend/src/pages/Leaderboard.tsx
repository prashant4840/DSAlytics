import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
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

  // Filter States
  const [sortBy, setSortBy] = useState<"solved" | "overall">("solved");
  const [collegeSearch, setCollegeSearch] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const fetchLeaderboardData = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const { data } = await axiosFetch.post(
        `/leaderboard/${page}`,
        {
          sortBy,
          college: collegeSearch || undefined,
          platform: selectedPlatform || undefined,
        },
        { headers }
      );
      if (data) setLeaderboardData(data);
    } catch {
      setError("Failed to fetch leaderboard data");
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, collegeSearch, selectedPlatform]);

  useEffect(() => {
    fetchLeaderboardData(currentPage);
  }, [currentPage, fetchLeaderboardData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLeaderboardData(1);
  };

  const handleProfileClick = (userId: string) => {
    navigate(`/preview/${userId}`);
  };

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
          Retry
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
          Ranking based on {sortBy === "overall" ? "DEVlytics Career Score" : "total problems solved"}
        </p>
      </div>

      {/* Filter Cockpit */}
      <div className="bg-zinc-50 border-b border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Sort Select */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Sort Candidates By</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as "solved" | "overall");
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-zinc-700 transition duration-200">
            <option value="solved">Total Problems Solved</option>
            <option value="overall">DEVlytics Career Score</option>
          </select>
        </div>

        {/* College Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-1.5 flex-[1.5] min-w-[250px]">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">College / University</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search e.g. Stanford, MIT..."
              value={collegeSearch}
              onChange={(e) => setCollegeSearch(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-zinc-700 transition duration-200"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg px-4 py-2 text-sm shadow-md transition duration-200 flex items-center gap-1.5">
              <Search size={14} />
              Apply
            </button>
          </div>
        </form>

        {/* Platform Selection */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Filter By Active Platform</label>
          <select
            value={selectedPlatform}
            onChange={(e) => {
              setSelectedPlatform(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-zinc-700 transition duration-200">
            <option value="">All Platforms</option>
            <option value="leetcode">LeetCode</option>
            <option value="codeforces">Codeforces</option>
            <option value="codechef">CodeChef</option>
            <option value="gfg">GeeksForGeeks</option>
            <option value="github">GitHub</option>
            <option value="interviewbit">InterviewBit</option>
          </select>
        </div>
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
            {leaderboardData?.users && leaderboardData.users.length > 0 ? (
              leaderboardData.users
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
                ))
            ) : (
              <div className="p-8 text-center text-gray-500 text-sm">
                No active candidate profiles found matching current filters.
              </div>
            )}
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
