import { useNavigate } from "react-router-dom";

export const FilledButton = ({
  children,
  to,
}: {
  children: string;
  to: string;
}) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="px-6 py-3  bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors">
      {children}
    </button>
  );
};

export const HollowButton = ({
  children,
  to,
}: {
  children: string;
  to: string;
}) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="px-6 py-3 bg-white text-indigo-600 rounded-lg border border-indigo-600 hover:bg-indigo-200 transition-colors">
      {children}
    </button>
  );
};
