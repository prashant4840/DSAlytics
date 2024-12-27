import { useState } from "react";
import { Platform } from "../lib/types";
import { Modal } from "./ui/Modal";
import { MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

export const PlatformCard = ({
  platform,
  username,
  onUpdate,
  isLoading,
}: {
  platform: Platform;
  username?: string;
  onUpdate: (platformId: string, username: string) => Promise<void>;
  isLoading: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(username || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(platform.id, newUsername);
    setIsEditing(false);
  };

  return (
    <div
      className={`relative rounded-lg border-2 p-4  transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 flex items-center justify-center">
          <img
            src={`/logos/${platform.logo}`}
            alt={`${platform.id}`}
            className="max-w-full max-h-full"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{platform.name}</h3>
          {isLoading ? (
            <div className="animate-pulse h-4 bg-gray-200 rounded w-24 mt-2" />
          ) : username ? (
            <p className="text-gray-600">{username}</p>
          ) : (
            <p className="text-gray-400 italic">Not connected</p>
          )}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          {username ? (
            <MdEdit className=" w-6 h-6" />
          ) : (
            <IoMdAdd className=" w-6 h-6" />
          )}
        </button>
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <h2 className="text-xl font-semibold mb-4">
          {username ? "Update" : "Add"} {platform.name} Username
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
