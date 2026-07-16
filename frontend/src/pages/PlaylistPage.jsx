import { useLoaderData } from "react-router-dom";
import axios from "axios";
import { VideoCard } from "../components";
import { useSelector } from "react-redux";

import { getAllPlaylists } from "../store/playlistSlice";
import { handleAxiosError } from "../api/handleAxiosError";

export async function PlaylistLoader({ params }) {
  try {
    const {playlistId} = params;
    const response = await axios.get(`/api/v1/playlists/${playlistId}`);
    return response?.data?.data;
    
  } catch (error) {
    handleAxiosError(error);
  }
}

export default function PlaylistPage() {
  const playlist = useLoaderData();

  const playlists = useSelector(getAllPlaylists);

  return (
    <div className="w-full">

      {/* 🔥 Playlist Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{playlist.name}</h1>
        <p className="text-gray-500">
          {playlist.videos.length} videos
        </p>
        <p className="text-gray-500">
          By ...
        </p>
      </div>

      {/* 🎬 Videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlist.videos.map((video, i) => {
          return <VideoCard
            key={video._id}
            _id={video._id}
            playlists={playlists}
            owner={video.owner}
            title={video.title}
            playlistPage={true}
            thumbnail={video.thumbnail}
            duration={video.duration}
            createdAt={video.createdAt}
          />
        })}
      </div>
    </div>
  );
}