import React, { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/Context";
import { Trophy } from "lucide-react";
import { ModalImg } from "./Modal";

interface ProfileHeaderProps {
  onPhotoChange: (newPhoto: string) => void;
  loadingPlatforms: Record<string, boolean>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onPhotoChange,
  loadingPlatforms,
}) => {
  const { user, userStats } = useUserContext();
  const [totalProblemsSolved, setTotalProblemsSolved] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    user?.pfp || "./defaultpfp.png"
  );

  const isLoading: boolean = Object.values(loadingPlatforms).some(
    (loading) => loading
  );

  useEffect(() => {
    setSelectedPhoto(user?.pfp || "./defaultpfp.png");
  }, []);

  useEffect(() => {
    const total = Object.values(userStats || {}).reduce((total, platform) => {
      return total + (platform?.totalProblemsSolved || 0);
    }, 0);
    setTotalProblemsSolved(total);
  }, [userStats]);

  // Get all available avatar options from userStats
  const avatarOptions = Object.entries(userStats || {})
    .map(([platform, data]) => ({
      platform,
      avatar: data?.avatar,
    }))
    .filter((option) => option.avatar);

  const handlePhotoSelect = (photo: string) => {
    setSelectedPhoto(photo);
    onPhotoChange(photo);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border p-6 mb-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left side - Profile Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative group">
              <img
                src={selectedPhoto}
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-blue-100 transition-transform duration-200 group-hover:scale-105"
                alt={`${user?.name}'s profile`}
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 text-xs sm:text-base">
                  Change Photo
                </span>
              </div>
            </button>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-xl">📧</span>
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Total Problems */}
        <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h3 className="text-lg font-medium text-gray-600">
              Total Problems Solved
            </h3>
          </div>

          {isLoading ? (
            <div className="flex space-x-2 justify-center items-center py-2">
              <span className="sr-only">Loading...</span>
              <div className="h-10 w-3 bg-indigo-600 rounded-full animate-pulse [animation-delay:-0.3s] text-xl"></div>
              <div className="h-10 w-3 bg-indigo-600 rounded-full animate-pulse [animation-delay:-0.15s] text-xl"></div>
              <div className="h-10 w-3 bg-indigo-600 rounded-full animate-pulse text-xl"></div>
            </div>
          ) : (
            <div className="text-5xl font-bold text-indigo-600">
              {totalProblemsSolved.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Photo Selection Modal */}
      <ModalImg
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Profile Photo">
        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handlePhotoSelect("./defaultpfp.png")}>
            <div className="flex flex-col items-center space-y-2">
              <img
                src="./defaultpfp.png"
                alt="Default profile"
                className={`w-16 h-16 rounded-full border-2 ${
                  selectedPhoto === "./defaultpfp.png"
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
              />
              <span className="text-sm font-medium">Default Photo</span>
            </div>
          </div>
          {avatarOptions.map(({ platform, avatar }) => (
            <div
              key={platform}
              className="p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handlePhotoSelect(avatar)}>
              <div className="flex flex-col items-center space-y-2">
                <img
                  src={avatar}
                  alt={`${platform} avatar`}
                  className={`w-16 h-16 rounded-full border-2 ${
                    selectedPhoto === avatar
                      ? "border-blue-500"
                      : "border-gray-200"
                  }`}
                />
                <span className="text-sm font-medium capitalize">
                  {platform}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ModalImg>
    </div>
  );
};

export default ProfileHeader;
