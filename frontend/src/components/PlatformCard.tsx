import React, { useState } from "react";
import { Star, Target, Award, Brain } from "lucide-react";
import { Platform, UserStats } from "../lib/types";
import { useUserContext } from "../contexts/Context";
import Card, { CardContent } from "./ui/Card";
import Badge from "./ui/Badge";
import { Modal } from "./ui/Modal";
import { IoIosAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";

const StatItem = ({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  value: string | number;
  className?: string;
}) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <Icon className="w-4 h-4 text-gray-500" />
    <span className="text-sm text-gray-600">{label}:</span>
    <span className="font-medium">{value}</span>
  </div>
);

export const PlatformCard = ({
  platform,
  username,
  onUpdate,
  isLoading,
}: {
  platform: Platform;
  username?: string;
  onUpdate: (
    platformId: string,
    username: string
  ) => Promise<{ success: boolean } | undefined>;
  isLoading: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username || "");
  const [error, setError] = useState("");
  const { userStats } = useUserContext();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const platformStats =
    userStats?.[platform.id.toLowerCase() as keyof UserStats];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsDisabled(true);
    if (username === newUsername) {
      setError("Please provide a new username");
      return;
    }
    const res = await onUpdate(platform.id, newUsername);
    if (res?.success) {
      setIsEditing(false);
      setError("");
    } else {
      setError("Error finding username");
    }
    setIsDisabled(false);
  };

  return (
    <Card className="relative hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 rounded-lg bg-gray-50 p-2 flex items-center justify-center">
            <img
              src={`/logos/${platform.logo}`}
              alt={platform.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-xl">{platform.name}</h3>
            {isLoading ? (
              <div className="animate-pulse h-4 bg-gray-200 rounded w-24 mt-2" />
            ) : username ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">{username}</span>
                {platformStats?.rank && (
                  <Badge variant="secondary" className="text-xs">
                    {platformStats.rank}
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-gray-400 italic">Not connected</p>
            )}
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            {username ? (
              <MdEdit className="w-6 h-6 text-gray-600" />
            ) : (
              <IoIosAdd className="w-9 h-9 text-gray-600" />
            )}
          </button>
        </div>

        {/* Stats Section */}
        {platformStats && username && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <StatItem
              icon={Brain}
              label="Problems Solved"
              value={platformStats.totalProblemsSolved}
            />
            {platformStats.rating && (
              <StatItem
                icon={Star}
                label="Rating"
                value={platformStats.rating}
                className="text-blue-600"
              />
            )}
            {platformStats.maxRating && (
              <StatItem
                icon={Award}
                label="Max Rating"
                value={platformStats.maxRating}
                className="text-green-600"
              />
            )}
            {platformStats.contestGlobalRank && (
              <StatItem
                icon={Target}
                label="Contest Rank"
                value={`#${platformStats.contestGlobalRank}`}
                className="text-purple-600"
              />
            )}
          </div>
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={isEditing}
          onClose={() => {
            setNewUsername(username || "");
            setError("");
            setIsEditing(false);
          }}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {username ? "Update" : "Add"} {platform.name} Username
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={newUsername}
                onChange={(e) => {
                  setIsDisabled(false);
                  setNewUsername(e.target.value);
                }}
                placeholder="Enter username"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  disabled={isLoading || isDisabled}>
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNewUsername(username || "");
                    setError("");
                    setIsEditing(false);
                  }}
                  className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </CardContent>
    </Card>
  );
};
