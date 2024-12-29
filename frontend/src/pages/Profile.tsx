import { useState } from "react";
import { PLATFORMS } from "../lib/types";
import axiosFetch from "../lib/axiosFetch";
import { PlatformCard } from "../components/PlatformCard";
import { AxiosError } from "axios";
import { useUserContext } from "../contexts/Context";
import { ProfileHeader } from "../components/ui/ProfileHeader";

// Main Profile Component
export const Profile = () => {
  const [loadingPlatforms, setLoadingPlatforms] = useState<
    Record<string, boolean>
  >({});
  const { user, setUser, setUserStats } = useUserContext();

  const handleUpdateUsername = async (platformId: string, username: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
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
      const platformDataResponse = await axiosFetch.get("/api/platform/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserStats(platformDataResponse.data);

      return { success: true };
    } catch (error: AxiosError | any) {
      console.error("Error updating username:", error.response?.data.message);
      return { success: false };
    } finally {
      setLoadingPlatforms((prev) => ({ ...prev, [platformId]: false }));
    }
  };

  const handleUpdatePfp = async (avatarUrl: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    if (!avatarUrl) {
      console.error("No photo found");
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
    } catch (error: AxiosError | any) {
      console.error(
        "Error updating profile photo:",
        error.response?.data.message
      );
      return { success: false };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 mt-12">
      <ProfileHeader
        onPhotoChange={handleUpdatePfp}
        loadingPlatforms={loadingPlatforms}
      />

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
