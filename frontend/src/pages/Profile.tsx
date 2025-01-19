import { useEffect, useState } from "react";
import { PLATFORMS, UserStats } from "../lib/types";
import axiosFetch from "../lib/axiosFetch";
import { PlatformCard } from "../components/PlatformCard";
import { AxiosError } from "axios";
import { useUserContext } from "../contexts/Context";
import { ProfileHeader } from "../components/ui/ProfileHeader";
import Toast from "../components/ui/Toast";
import { Link } from "react-router-dom";

// Main Profile Component
export const Profile = () => {
  const { user, setUser, setUserStats, userStats } = useUserContext();

  const [loadingPlatforms, setLoadingPlatforms] = useState<
    Record<string, boolean>
  >({});
  const [error, setError] = useState<string | null>();
  const [userId, setUserId] = useState<string | null>(null);
  const [totalProblemsSolved, setTotalProblemsSolved] = useState<number>(0);

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
      } catch (error: any) {
        if (error.response?.status === 429) {
          console.error("Rate limit exceeded:", error.response.data.message);
          window.location.replace("/");
        } else {
          console.error("Authentication or data fetching error:", error);
        }
        setUserId(null);
      }
    };

    fetchData();
  }, [token]);

  const handleUpdateUsername = async (platformId: string, username: string) => {
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found");
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
    } catch (error: AxiosError | any) {
      setError("Error updating username: " + error.response?.data.message);
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
    } catch (error: AxiosError | any) {
      setError("Error deleting username: " + error.response?.data.message);
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
    } catch (error: AxiosError | any) {
      setError("Error updating profile photo:" + error.response?.data.message);
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
    } catch (error: AxiosError | any) {
      setError("Error updating user details: " + error.response?.data.message);
      return { success: false };
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8 mt-12 animate-slide-down">
        {error && <Toast message={error} variant="error" />}
        <ProfileHeader
          onPhotoChange={handleUpdatePfp}
          onUserUpdate={handleUpdateUserDetails}
          loadingPlatforms={loadingPlatforms}
          totalProblemsSolved={totalProblemsSolved}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
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
        <div className=" flex justify-center mt-10">
          <Link to={`/preview/${userId}`} className=" texl-4xl">
            <button className="px-4 py-2  rounded-md border border-black bg-white text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
              Preview Profile card
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Profile;
