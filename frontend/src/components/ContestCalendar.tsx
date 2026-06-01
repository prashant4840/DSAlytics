import React, { useEffect, useState } from "react";
import { Calendar, ExternalLink } from "lucide-react";

interface Contest {
  name: string;
  url: string;
  start_time: string;
  end_time: string;
  site: string;
}

export const ContestCalendar: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("https://kontests.net/api/v1/all");
        if (!response.ok) {
          throw new Error("Failed to fetch contest calendar");
        }
        const data = await response.json();
        
        const filtered = data
          .filter((contest: Contest) => {
            const siteName = (contest.site || "").toLowerCase();
            const start = new Date(contest.start_time);
            
            // Limit to target platforms and future dates only
            const isTargetPlatform = 
              siteName.includes("leetcode") ||
              siteName.includes("codeforces") ||
              siteName.includes("codechef") ||
              siteName.includes("atcoder");

            return isTargetPlatform && start.getTime() > Date.now();
          })
          // Sort chronologically by start date
          .sort((a: Contest, b: Contest) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
          // Limit to 5 upcoming contests
          .slice(0, 5);

        setContests(filtered);
      } catch (err: any) {
        console.error("Error loading contests:", err.message);
        setError("Contest calendar unavailable");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, []);

  const getPlatformStyle = (site: string) => {
    const platform = site.toLowerCase();
    if (platform.includes("leetcode")) {
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400";
    }
    if (platform.includes("codeforces")) {
      return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400";
    }
    if (platform.includes("codechef")) {
      return "bg-amber-800/10 text-amber-900 border-amber-900/20 dark:bg-amber-850/20 dark:text-amber-300";
    }
    // AtCoder
    return "bg-neutral-100 text-neutral-800 border-neutral-300 dark:bg-zinc-800 dark:text-zinc-300";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPlatformDisplayName = (site: string) => {
    const platform = site.toLowerCase();
    if (platform.includes("leetcode")) return "LeetCode";
    if (platform.includes("codeforces")) return "Codeforces";
    if (platform.includes("codechef")) return "CodeChef";
    if (platform.includes("atcoder")) return "AtCoder";
    return site;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        <h4 className="font-bold text-gray-900 dark:text-white text-md flex items-center gap-2 mb-1">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <span>Contest Calendar</span>
        </h4>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mb-4">
          Upcoming official coding rounds and competitive contests
        </p>

        {isLoading ? (
          <div className="space-y-3 py-2">
            {[...Array(3)].map((_, idx) => (
              <div key={idx} className="animate-pulse flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-2 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-6 text-center text-xs text-zinc-400 border border-dashed rounded-xl">
            {error}
          </div>
        ) : contests.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-400 border border-dashed rounded-xl">
            No upcoming contests scheduled
          </div>
        ) : (
          <div className="space-y-4">
            {contests.map((contest, index) => (
              <div 
                key={index} 
                className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0 gap-2"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold tracking-wide ${getPlatformStyle(contest.site)}`}>
                      {getPlatformDisplayName(contest.site)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {formatDate(contest.start_time)}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-gray-800 dark:text-zinc-200 truncate pr-1">
                    {contest.name}
                  </h5>
                </div>
                <a
                  href={contest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Register for Contest"
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-550 transition-colors"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestCalendar;
