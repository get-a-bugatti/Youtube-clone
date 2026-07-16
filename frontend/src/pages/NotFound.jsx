import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] gap-5">
      <h1 className="text-8xl font-bold">404</h1>

      <h2 className="text-3xl font-semibold">
        Page Not Found
      </h2>

      <p className="text-gray-500 text-center max-w-md">
        Sorry, the page you're looking for doesn't exist or may have been moved.
      </p>

      <Link
        to="/"
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}