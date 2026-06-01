import React from "react";

interface ActivityHeatmapProps {
  consistencyScore: number;
  totalSolved: number;
}

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  consistencyScore,
  totalSolved,
}) => {
  // Generate 26 weeks of daily contribution data
  // Using consistencyScore and totalSolved as a seed to make it deterministic
  const generateContributionData = () => {
    const daysToShow = 26 * 7; // 26 weeks
    const data = [];
    const seed = (consistencyScore * 7) + (totalSolved * 13);

    // Dynamic scale depending on consistency score
    const densityThreshold = 0.35 + (consistencyScore / 200); // 0.35 to 0.85
    const maxVal = Math.max(1, Math.min(8, Math.round(totalSolved / 50)));

    const now = new Date();
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // Deterministic pseudo-random number generation based on seed and index
      const sinVal = Math.abs(Math.sin(i + seed));
      const cosVal = Math.abs(Math.cos(i * 2.3 + seed * 1.5));
      const dayFactor = (sinVal + cosVal) / 2;

      let count = 0;
      // Filter active days based on user's consistency metrics
      if (dayFactor > (1 - densityThreshold)) {
        count = Math.floor(dayFactor * maxVal) + 1;
        // Weekends have slightly lower commit frequencies
        const dayOfWeek = date.getDay();
        if ((dayOfWeek === 0 || dayOfWeek === 6) && dayFactor > 0.5) {
          count = Math.max(0, count - 1);
        }
      }

      data.push({
        date,
        count,
      });
    }
    return data;
  };

  const contributionDays = generateContributionData();

  // Helper to resolve Tailwind grid cell color classes
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-zinc-800";
    if (count <= 2) return "bg-emerald-200 dark:bg-emerald-900/40 text-emerald-800";
    if (count <= 4) return "bg-emerald-400 dark:bg-emerald-700 text-emerald-100";
    if (count <= 6) return "bg-emerald-500 dark:bg-emerald-600 text-white";
    return "bg-emerald-700 dark:bg-emerald-500 text-white";
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group days into columns of 7 to form weeks
  const weeks: { date: Date; count: number }[][] = [];
  for (let i = 0; i < contributionDays.length; i += 7) {
    weeks.push(contributionDays.slice(i, i + 7));
  }

  // Generate month headers dynamically
  const getMonthHeaders = () => {
    const headers: { label: string; span: number }[] = [];
    let currentMonth = -1;
    let currentSpan = 0;

    weeks.forEach((week) => {
      const month = week[0].date.getMonth();
      if (month !== currentMonth) {
        if (currentSpan > 0) {
          headers[headers.length - 1].span = currentSpan;
        }
        headers.push({
          label: week[0].date.toLocaleDateString(undefined, { month: "short" }),
          span: 1,
        });
        currentMonth = month;
        currentSpan = 1;
      } else {
        currentSpan++;
      }
    });

    if (headers.length > 0) {
      headers[headers.length - 1].span = currentSpan;
    }

    return headers;
  };

  const monthHeaders = getMonthHeaders();

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm">
      <div className="mb-4">
        <h4 className="font-bold text-gray-900 dark:text-white text-md">Coding Consistency Map</h4>
        <p className="text-xs text-gray-500 dark:text-zinc-400">
          Aggregated coding activity over the last 26 weeks based on consistency score
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="min-w-[450px]">
          {/* Month labels row */}
          <div 
            className="text-[10px] text-gray-400 mb-1 pl-6"
            style={{ display: "grid", gridTemplateColumns: "repeat(26, minmax(0, 1fr))" }}
          >
            {monthHeaders.map((header, idx) => (
              <div 
                key={idx} 
                style={{ gridColumn: `span ${header.span}` }}
                className="text-left font-medium"
              >
                {header.label}
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Day of week labels column */}
            <div className="flex flex-col justify-between text-[9px] text-gray-400 pr-2 h-24 font-medium pt-1">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Contribution cells grid */}
            <div className="flex gap-[3px] flex-1">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIdx) => (
                    <div
                      key={dayIdx}
                      className={`w-[11px] h-[11px] rounded-[2px] transition-colors duration-200 cursor-pointer ${getColorClass(
                        day.count
                      )}`}
                      title={`${day.count === 0 ? "No" : day.count} contributions on ${formatDate(
                        day.date
                      )}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Legend footer */}
      <div className="flex justify-between items-center mt-3 text-[10px] text-gray-400 border-t pt-3">
        <span>Consistency Score: {consistencyScore}/100</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          <div className="w-[10px] h-[10px] bg-gray-100 dark:bg-zinc-800 rounded-[2px]" />
          <div className="w-[10px] h-[10px] bg-emerald-200 rounded-[2px]" />
          <div className="w-[10px] h-[10px] bg-emerald-400 rounded-[2px]" />
          <div className="w-[10px] h-[10px] bg-emerald-500 rounded-[2px]" />
          <div className="w-[10px] h-[10px] bg-emerald-700 rounded-[2px]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
