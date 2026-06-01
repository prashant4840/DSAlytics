import { useEffect, useState } from "react";
import { PLATFORMS, UserStats } from "../lib/types";
import axiosFetch from "../lib/axiosFetch";
import { PlatformCard } from "../components/PlatformCard";
import { AxiosError } from "axios";
import { useUserContext } from "../contexts/Context";
import { ProfileHeader } from "../components/ui/ProfileHeader";
import Toast from "../components/ui/Toast";
import { Link } from "react-router-dom";
import { RefreshCw, AlertTriangle, Compass, Trophy, Brain, Layers } from "lucide-react";
import { ActivityHeatmap } from "../components/ActivityHeatmap";
import { ContestCalendar } from "../components/ContestCalendar";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

// Main Profile Component
export const Profile = () => {
  const { user, setUser, setUserStats, userStats } = useUserContext();

  const [loadingPlatforms, setLoadingPlatforms] = useState<
    Record<string, boolean>
  >({});
  const [error, setError] = useState<string | null>();
  const [userId, setUserId] = useState<string | null>(null);
  const [totalProblemsSolved, setTotalProblemsSolved] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const total = Object.values(userStats || {}).reduce((total, platform) => {
      return total + (platform?.totalProblemsSolved || 0);
    }, 0);
    setTotalProblemsSolved(total);
  }, [userStats]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const { data } = await axiosFetch.get("/api/user/id", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!data.success) throw new Error("Not authorized");
        setUserId(data.id);
      } catch (error) {
        const err = error as AxiosError<{ message?: string }>;
        if (err.response?.status === 429) {
          console.error("Rate limit exceeded:", err.response.data?.message);
          window.location.replace("/");
        } else {
          console.error("Authentication or data fetching error:", error);
        }
        setUserId(null);
      }
    };

    fetchData();
  }, [token]);

  const handleSyncAllStats = async (force: boolean = false) => {
    if (!token) return;
    setIsSyncing(true);
    setError(null);
    setToastMessage(null);

    try {
      const { data } = await axiosFetch.post(
        "/api/user/sync",
        { force },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success && data.user) {
        setUser(data.user);
        if (data.isCached) {
          setToastMessage("Serving cached statistics. Use Force Sync to fetch live data.");
        } else {
          setToastMessage("Dashboard synced successfully!");
        }
        
        // Also fetch platform stats to update cards
        const platformDataResponse = await axiosFetch.get<UserStats>(
          "/api/platform/data",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserStats(platformDataResponse.data);
      }
    } catch (error) {
      const err = error as AxiosError<{ message?: string }> & { message?: string };
      console.error(err);
      setError("Sync failed: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSyncing(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleUpdateUsername = async (platformId: string, username: string) => {
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return { success: false };
    }
    try {
      setLoadingPlatforms((prev) => ({ ...prev, [platformId]: true }));

      const { data } = await axiosFetch.put(
        "/api/user/usernames",
        {
          [platformId]: username,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(data);

      const platformDataResponse = await axiosFetch.get<UserStats>(
        "/api/platform/data",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserStats(platformDataResponse.data);

      const total = Object.values(platformDataResponse.data || {}).reduce(
        (total, platform) => {
          return total + (platform?.totalProblemsSolved || 0);
        },
        0
      );
      if (total <= 0) {
        setError("Unable to set total problems solved");
        return { success: false };
      }

      const totalSolvedResponse = await axiosFetch.put(
        "/api/user/totalsolved",
        { totalSolved: total },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!totalSolvedResponse.data.success) {
        throw new Error("Could not set total problems solved");
      }

      return { success: true };
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setError("Error updating username: " + err.response?.data?.message);
      return { success: false };
    } finally {
      setLoadingPlatforms((prev) => ({ ...prev, [platformId]: false }));
    }
  };

  const handleDeleteUsername = async (platformId: string) => {
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return { success: false };
    }

    try {
      setLoadingPlatforms((prev) => ({ ...prev, [platformId]: true }));

      const { data } = await axiosFetch.delete("/api/user/usernames", {
        headers: { Authorization: `Bearer ${token}` },
        data: { platformId },
      });

      setUser(data);

      const platformDataResponse = await axiosFetch.get<UserStats>(
        "/api/platform/data",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUserStats(platformDataResponse.data);

      const total = Object.values(platformDataResponse.data || {}).reduce(
        (total, platform) => {
          return total + (platform?.totalProblemsSolved || 0);
        },
        0
      );

      if (total < 0) {
        setError("Unable to set total problems solved");
        return { success: false };
      }

      const totalSolvedResponse = await axiosFetch.put(
        "/api/user/totalsolved",
        { totalSolved: total },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!totalSolvedResponse.data.success) {
        throw new Error("Could not set total problems solved");
      }

      return { success: true };
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setError("Error deleting username: " + err.response?.data?.message);
      return { success: false };
    } finally {
      setLoadingPlatforms((prev) => ({ ...prev, [platformId]: false }));
    }
  };

  const handleUpdatePfp = async (avatarUrl: string) => {
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return;
    }

    if (!avatarUrl) {
      setError("No photo found");
      return;
    }

    const expression =
      /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/gi;
    const regex = new RegExp(expression);

    if (!avatarUrl.match(regex)) {
      return;
    }

    try {
      const { data } = await axiosFetch.put(
        "/api/user/pfp",
        { avatarUrl: avatarUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(data);
      return { success: true };
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setError("Error updating profile photo: " + err.response?.data?.message);
      return { success: false };
    }
  };

  const handleUpdateUserDetails = async (data: {
    name: string;
    email: string;
  }) => {
    const { name, email } = data;
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
      return { success: false };
    }

    try {
      const { data } = await axiosFetch.put(
        "/api/user/update",
        { name, email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(data);
      return { success: true };
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      setError("Error updating user details: " + err.response?.data?.message);
      return { success: false };
    }
  };

  // Format skill scores for Radar chart
  const scores = user?.skillScores || {
    dsa: 0,
    development: 0,
    consistency: 0,
    problemSolving: 0,
    projectQuality: 0,
    contestPerformance: 0,
    openSource: 0,
  };

  const radarData = [
    { subject: "DSA", score: scores.dsa, fullMark: 100 },
    { subject: "Development", score: scores.development, fullMark: 100 },
    { subject: "Consistency", score: scores.consistency, fullMark: 100 },
    { subject: "Problem Solving", score: scores.problemSolving, fullMark: 100 },
    { subject: "Project Quality", score: scores.projectQuality, fullMark: 100 },
    { subject: "Contests", score: scores.contestPerformance, fullMark: 100 },
  ];

  const lastSyncedTime = user?.lastSyncedAt ? new Date(user.lastSyncedAt).getTime() : 0;
  const cooldownPeriod = 15 * 60 * 1000;
  const isCooldownActive = lastSyncedTime && (Date.now() - lastSyncedTime < cooldownPeriod);
  const minutesRemaining = isCooldownActive ? Math.ceil((cooldownPeriod - (Date.now() - lastSyncedTime)) / (60 * 1000)) : 0;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 mt-12 animate-slide-down">
        {error && <Toast message={error} variant="error" />}
        {toastMessage && <Toast message={toastMessage} variant="success" />}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              DEVlytics Cockpit
            </h1>
            <p className="text-gray-600 text-sm">
              Manage connected coding accounts and view your AI career intelligence report.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {isCooldownActive && (
              <span className="text-xs font-semibold text-zinc-600 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-xl shadow-sm">
                ⏱️ Cooldown: {minutesRemaining}m remaining
              </span>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleSyncAllStats(false)}
                disabled={isSyncing}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-md transition duration-200 disabled:opacity-50 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
                <span>{isSyncing ? "Syncing..." : isCooldownActive ? "Load Cached Stats" : "Sync All Platforms"}</span>
              </button>
              {isCooldownActive && (
                <button
                  onClick={() => handleSyncAllStats(true)}
                  disabled={isSyncing}
                  title="Bypass cache and force scrape all external accounts"
                  className="flex items-center space-x-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-medium py-2.5 px-3 rounded-xl shadow-sm transition duration-200 text-sm"
                >
                  <RefreshCw className={`w-4 h-4 text-indigo-500 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>Force Sync</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Header */}
        <ProfileHeader
          onPhotoChange={handleUpdatePfp}
          onUserUpdate={handleUpdateUserDetails}
          loadingPlatforms={loadingPlatforms}
          totalProblemsSolved={user?.totalSolved || totalProblemsSolved}
        />

        {/* Skill Scoring & AI Mentorship Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* 1. Developer Score & Radar Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Brain className="text-indigo-600 w-5 h-5" />
                  Developer Skill Radar
                </h3>
                <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                  Percentile Engine
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Your visual capabilities blueprint mapped across the key 6 dimensions. Connect all platform handles to populate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              
              {/* Score display */}
              <div className="md:col-span-2 flex flex-col justify-center items-center text-center p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl border">
                <span className="text-sm font-medium text-gray-500 mb-1">Developer Score</span>
                <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  {user?.skillScores?.overall || 0}
                </span>
                <span className="text-xs text-gray-400 mt-1">out of 1000 max</span>

                {/* Progress bar info */}
                <div className="w-full bg-gray-200 h-2 rounded-full mt-5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${(user?.skillScores?.overall || 0) / 10}%` }}
                  />
                </div>
                <span className="text-xs text-indigo-600 font-semibold mt-2">
                  {user?.skillScores?.overall ? (user.skillScores.overall >= 800 ? "Elite Tier" : user.skillScores.overall >= 600 ? "Advanced Tier" : user.skillScores.overall >= 300 ? "Intermediate Tier" : "Novice Tier") : "Unranked"}
                </span>
              </div>

              {/* Radar chart visual */}
              <div className="md:col-span-3 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8" }} />
                    <Radar
                      name="Developer"
                      dataKey="score"
                      stroke="#4f46e5"
                      fill="#818cf8"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

            </div>
          </div>

          {/* 2. Weakness Detection Engine */}
          <div className="bg-white rounded-2xl shadow-lg border p-6 flex flex-col">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-2">
              <AlertTriangle className="text-red-500 w-5 h-5" />
              Weakness Detection
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Real-time gaps detected in your CS career readiness portfolio.
            </p>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-1">
              {user?.weaknesses && user.weaknesses.length > 0 ? (
                user.weaknesses.map((w, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-red-100 bg-red-50/30 flex items-start gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      w.level === "High" ? "bg-red-100 text-red-800" : w.level === "Medium" ? "bg-orange-100 text-orange-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {w.level}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{w.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">{w.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-6 border-2 border-dashed rounded-xl">
                  <span className="text-3xl">🎯</span>
                  <h4 className="font-bold text-sm text-gray-800 mt-2">Zero High Risks</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    No critical weaknesses detected. Click Sync to recalculate.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 3. Consistency Heatmap & Upcoming Contests calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            <ActivityHeatmap 
              consistencyScore={user?.skillScores?.consistency || 0} 
              totalSolved={user?.totalSolved || 0} 
            />
          </div>
          <div className="lg:col-span-1">
            <ContestCalendar />
          </div>
        </div>

        {/* Mentor recommendations & Roadmaps */}
        <div className="bg-white rounded-2xl shadow-lg border p-6 mb-10">
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-2">
            <Compass className="text-indigo-600 w-5 h-5" />
            Mentor Recommendations & Roadmaps
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Actionable suggestions to improve your skills and placement preparedness strategically.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user?.recommendations && user.recommendations.length > 0 ? (
              user.recommendations.map((rec, idx) => (
                <div key={idx} className="p-5 rounded-2xl border bg-gray-50/50 hover:bg-white hover:shadow-md transition duration-200 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                      {rec.category}
                    </span>
                    <h4 className="font-bold text-gray-900 mt-3 text-base">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{rec.description}</p>
                  </div>
                  <a
                    href={rec.actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mt-4 underline underline-offset-4"
                  >
                    View Roadmap Roadmap Resource →
                  </a>
                </div>
              ))
            ) : (
              <div className="col-span-full p-8 border-2 border-dashed rounded-2xl text-center flex flex-col justify-center items-center">
                <span className="text-4xl mb-2">🎓</span>
                <h4 className="font-bold text-gray-800">Ready to start?</h4>
                <p className="text-sm text-gray-500 max-w-sm mt-1">
                  Connect your usernames and run a sync to generate your customized AI roadmaps.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Username manager card grid */}
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-4">
          <Layers className="text-gray-700 w-5 h-5" />
          Connect Platform Handles
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto mb-10">
          {PLATFORMS.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              username={user?.usernames?.[platform.id]}
              onUpdate={handleUpdateUsername}
              onDelete={handleDeleteUsername}
              isLoading={loadingPlatforms[platform.id] || false}
            />
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link to={`/preview/${userId}`}>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-black bg-white text-black font-semibold hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 transform hover:-translate-y-0.5">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Preview Shareable Profile Card</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Profile;
