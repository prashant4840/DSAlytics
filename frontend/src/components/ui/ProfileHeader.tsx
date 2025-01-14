import React, { useEffect, useState } from "react";
import { useUserContext } from "../../contexts/Context";
import { Trophy } from "lucide-react";
import { Modal, ModalImg } from "./Modal";
import { MdEdit } from "react-icons/md";

interface ProfileHeaderProps {
  onPhotoChange: (newPhoto: string) => void;
  onUserUpdate: (data: {
    name: string;
    email: string;
  }) => Promise<{ success: boolean }>;
  loadingPlatforms: Record<string, boolean>;
  totalProblemsSolved: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onPhotoChange,
  onUserUpdate,
  loadingPlatforms,
  totalProblemsSolved,
}) => {
  const { user, userStats } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    user?.pfp || "/defaultpfp.png"
  );
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading: boolean = Object.values(loadingPlatforms).some(
    (loading) => loading
  );

  useEffect(() => {
    setSelectedPhoto(user?.pfp || "/defaultpfp.png");
    setEditForm({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (user?.name === editForm.name && user?.email === editForm.email) {
      setError("Changes are same as current profile");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await onUserUpdate(editForm);
      if (res.success) {
        setIsEditModalOpen(false);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("An error occurred while updating profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border sm:p-5 p-2 mb-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left side - Profile Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4 border sm:p-5 p-4 rounded-xl relative">
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
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MdEdit className="w-5 h-5 text-gray-600" />
            </button>
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

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setError("");
          setEditForm({
            name: user?.name || "",
            email: user?.email || "",
          });
        }}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(true);
                setIsEditModalOpen(false);
              }}
              className="flex justify-center w-full text-center border hover:bg-gray-100 rounded-lg p-4 transition-colors">
              <div>
                <div className=" focus:outline-none focus:ring-2 focus:ring-blue-500 justify-center flex ">
                  <img
                    src={selectedPhoto}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-full hover:scale-105 transition duration-300"
                    alt={`${user?.name}'s profile`}
                  />{" "}
                </div>
                <div className=" flex justify-center space-x-2 items-center text-sm">
                  <p>Change photo</p>
                  <MdEdit />
                </div>
              </div>
            </button>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-500 text-white py-2 text-nowrap px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setError("");
                  setEditForm({
                    name: user?.name || "",
                    email: user?.email || "",
                  });
                }}
                className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Photo Selection Modal */}
      <ModalImg
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (!isEditModalOpen) {
            setIsEditModalOpen(true);
          }
        }}
        title="Select Profile Photo">
        <div className="grid grid-cols-2 gap-4">
          <div
            className="p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handlePhotoSelect("/defaultpfp.png")}>
            <div className="flex flex-col items-center space-y-2">
              <img
                src="/defaultpfp.png"
                alt="Default profile"
                className={`w-16 h-16 rounded-full border-2 ${
                  selectedPhoto === "/defaultpfp.png"
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
