import { useNavigate } from "react-router-dom";

export default function PlaylistCard({
  _id,
  name,
  owner,
  videosCount = 0,
  thumbnail = "/missing-thumbnail.jpg",
  className = "",
}) {
  const navigate = useNavigate();

  return (
    <div
      className={`cursor-pointer ${className}`}
      onClick={() => navigate(`/playlist/${_id}`)}
    >
      <div className="border rounded-lg bg-white hover:shadow-md transition p-2">

        {/* 📸 Thumbnail */}
        <div className="relative">
          <img
            src={thumbnail}
            alt="playlist thumbnail"
            className="w-full h-40 object-cover rounded-md"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center text-white font-semibold">
            {videosCount} videos
          </div>
        </div>

        {/* 📄 Info */}
        <div className="mt-2">
          <p className="font-semibold text-lg line-clamp-2">
            {name}
          </p>

          {owner && (
            <p className="text-sm text-gray-500">
              {owner.fullName || owner.username}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}