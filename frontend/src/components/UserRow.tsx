import { Trophy, Medal, Award } from "lucide-react";
import { LeaderboardUser } from "../lib/types";

const UserRow = ({
  user,
  isCurrentUser = false,
  handleProfileClick,
}: {
  user: LeaderboardUser;
  isCurrentUser?: boolean;
  handleProfileClick: (str: string) => void;
}) => {
  const getRankDetails = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          title: "Legendary",
          icon: Trophy,
          bgBase:
            "bg-[linear-gradient(45deg,transparent_25%,rgba(90,90,90,.2)_50%,transparent_75%,transparent_100%)] bg-gray-50 bg-[length:250%_250%,100%_100%] bg-[position:-20%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] hover:bg-[position:100%_0,0_0] hover:duration-[1000ms]",
          bgOverlay:
            "bg-gradient-to-r from-transparent via-yellow-100 to-transparent",
          hoverEffect: "hover:bg-yellow-100/50",
          textColor: "text-yellow-900",
          borderColor: "border-yellow-400",
          iconColor: "text-yellow-400",
          ringColor: "ring-yellow-400",
        };
      case 2:
        return {
          title: "Grandmaster",
          icon: Medal,
          bgBase:
            "bg-[linear-gradient(45deg,transparent_25%,rgba(90,90,90,.2)_50%,transparent_75%,transparent_100%)] bg-gray-50 bg-[length:250%_250%,100%_100%] bg-[position:-20%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] hover:bg-[position:100%_0,0_0] hover:duration-[1000ms]",
          bgOverlay:
            "bg-gradient-to-r from-transparent via-gray-100 to-transparent",
          hoverEffect: "hover:bg-gray-100/50",
          textColor: "text-gray-900",
          borderColor: "border-gray-400",
          iconColor: "text-gray-400",
          ringColor: "ring-gray-400",
        };
      case 3:
        return {
          title: "Expert",
          icon: Award,
          bgBase:
            "bg-[linear-gradient(45deg,transparent_25%,rgba(90,90,90,.2)_50%,transparent_75%,transparent_100%)] bg-gray-50 bg-[length:250%_250%,100%_100%] bg-[position:-20%_0,0_0] bg-no-repeat transition-[background-position_0s_ease] hover:bg-[position:100%_0,0_0] hover:duration-[1000ms]",
          bgOverlay:
            "bg-gradient-to-r from-transparent via-yellow-50 to-transparent",
          hoverEffect: "hover:bg-amber-100/50",
          textColor: "text-amber-900",
          borderColor: "border-amber-600",
          iconColor: "text-amber-600",
          ringColor: "ring-amber-600",
        };
      default:
        return {
          title: "Solver",
          icon: null,
          bgBase: "bg-white",
          bgOverlay: "",
          hoverEffect: "hover:bg-gray-50",
          textColor: "text-gray-800",
          borderColor: "",
          iconColor: "",
          ringColor: "",
        };
    }
  };

  const rankDetails = getRankDetails(user.rank);
  const IconComponent = rankDetails.icon;

  return (
    <div
      onClick={() => handleProfileClick(user.userId)}
      className={`relative flex items-center p-4 transition-all duration-500 ease-in-out
        ${rankDetails.bgBase}
        ${rankDetails.hoverEffect}
        ${user.rank <= 3 ? "animate-fadeInUp" : ""}
        ${isCurrentUser ? "border-l-4 border-indigo-500" : ""}
        cursor-pointer overflow-hidden group`}>
      {/* Animated gradient overlay for top 3 */}
      {user.rank <= 3 && (
        <div
          className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700
          ${rankDetails.bgOverlay}`}>
          <div className="absolute inset-0 animate-shine" />
        </div>
      )}

      <div className={`w-8 font-bold ${rankDetails.textColor}`}>
        {user.rank}
      </div>

      <div className="w-12 h-12 relative group">
        <div
          className={`absolute inset-0 rounded-full ${
            user.rank <= 3 ? "animate-pulse-subtle" : ""
          }`}
        />
        <img
          src={user.pfp || "./defaultpfp.png"}
          alt={`${user.name}'s profile`}
          className={`rounded-full object-cover transition-transform duration-300 group-hover:scale-110 
            ${
              user.rank <= 3
                ? `ring-2 ring-offset-2 ${rankDetails.ringColor}`
                : ""
            }`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "./defaultpfp.png";
          }}
        />
        {user.rank <= 3 && IconComponent && (
          <div className="absolute -top-2 -right-2 animate-bounce-gentle">
            <IconComponent className={rankDetails.iconColor} size={20} />
          </div>
        )}
      </div>

      <div className="flex-1 ml-4">
        <div className={`font-bold ${rankDetails.textColor}`}>{user.name}</div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-600">
            Problems solved: {user.totalSolved}
          </span>
        </div>
      </div>
      <span
        className={`text-sm inline-flex items-center rounded-full px-2 py-2 sm:py-1 bg-zinc-50 border opacity-90 font-semibold`}>
        {rankDetails.title}
      </span>
    </div>
  );
};

export default UserRow;
