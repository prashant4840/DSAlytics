const LoadingPage = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center space-y-8">
        {/* Animated logo */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping bg-indigo-400 rounded-lg opacity-20" />
          <div className="relative bg-white p-4 rounded-lg shadow-lg">
            <svg
              className=" h-10 w-10"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* Loading spinner and text */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative"></div>
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">Loading</h1>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full animate-progress origin-left" />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-indigo-500 opacity-5 rounded-full animate-float"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Loading message */}
      <p className="mt-8 text-gray-500 animate-pulse">
        Preparing your experience...
      </p>
    </div>
  );
};

// Add custom animation to tailwind
const style = document.createElement("style");
style.textContent = `
  @keyframes float {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-20px) scale(1.05);
    }
  }
  @keyframes progress {
    0% {
      transform: scaleX(0);
    }
    50% {
      transform: scaleX(0.7);
    }
    100% {
      transform: scaleX(1);
    }
  }
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  .animate-progress {
    animation: progress 2s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

export default LoadingPage;
