import React, { useEffect, useState } from "react";
import { PLATFORMS, User } from "../lib/types";
import axiosFetch from "../lib/axiosFetch";
import { PlatformCard } from "../components/PlatformCard";
import { AxiosError } from "axios";

interface ProfileProps {
  user: User | null;
  setUser: (user: User) => void;
}

// Main Profile Component
export const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const [loadingPlatforms, setLoadingPlatforms] = useState<
    Record<string, boolean>
  >({});
  const [profilePhoto, setProfilePhoto] = useState<string>("/defaultpfp.png");

  const handleUpdateUsername = async (platformId: string, username: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }
    try {
      setLoadingPlatforms((prev) => ({ ...prev, [platformId]: true }));

      const response = await axiosFetch.put(
        "/api/user/usernames",
        {
          [platformId]: username,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedUser = response.data;
      setUser(updatedUser);
      return { success: true };
    } catch (error: AxiosError | any) {
      console.error("Error updating username:", error.response?.data.message);
      return { success: false };
    } finally {
      setLoadingPlatforms((prev) => ({ ...prev, [platformId]: false }));
    }
  };

  useEffect(() => {
    async function getUserData() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      const userData = await axiosFetch.get(
        `${import.meta.env.VITE_API_URL}/api/platform/data`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const platformsData = userData.data;
      const priorityOrder = ["leetcode", "interviewbit", "gfg", "codeforces"];
      const pfp = localStorage.getItem("profilePhoto");
      if (pfp) {
        setProfilePhoto(pfp);
        return;
      }

      for (const platform of priorityOrder) {
        if (platformsData[platform]?.data.profile.userAvatar) {
          const avatarUrl = platformsData[platform].data.profile.userAvatar;
          setProfilePhoto(avatarUrl);
          localStorage.setItem("profilePhoto", avatarUrl);
          return;
        }
      }
    }

    getUserData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-12">
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img src={profilePhoto} className=" w-20 h-20 rounded-full" />
            <span className="text-lg">{user?.name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xl">📧</span>
            <span className="text-lg">{user?.email}</span>
          </div>
        </div>
      </div>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {PLATFORMS.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            username={user?.usernames?.[platform.id]}
            onUpdate={handleUpdateUsername}
            isLoading={loadingPlatforms[platform.id] || false}
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;
