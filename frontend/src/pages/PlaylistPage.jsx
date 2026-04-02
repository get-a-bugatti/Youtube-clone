import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { VideoCard } from "../components";

export default function PlaylistPage() {
  const { id } = useParams();

  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    axios.get(`/api/playlists/${id}`)
      .then(res => setPlaylist(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!playlist) return <div>Loading...</div>;

  return (
    <div className="w-full">

      {/* 🔥 Playlist Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-gray-500">
          {playlist.videos.length} videos
        </p>
      </div>

      {/* 🎬 Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlist.videos.map(video => (
          <VideoCard
            key={video._id}
            {...video}
          />
        ))}
      </div>
    </div>
  );
}