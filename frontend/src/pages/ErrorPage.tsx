const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="text-3xl mt-4">Page Not Found</p>
        <p className="mt-2 text-xl text-gray-400">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-500 transition">
          Go Back Home
        </a>
      </div>
    </div>
  );
};

export default ErrorPage;
