// loaders/homeLoader.js

import axios from "axios";
import { handleAxiosError } from "../api/handleAxiosError";
import { useLoaderData } from "react-router-dom";
import { useSelector } from "react-redux";
import VideoCard from "../features/videos/VideoCard";
import { getAllPlaylists } from "../features/playlists/playlistSlice";

export async function homeLoader({ request }) {
  try {
    const url = new URL(request.url);

    const query = url.searchParams.get("query");

    const params = new URLSearchParams();

    if (query) {
      params.set("query", query);
    }

    const queryString = params.toString();

    const response = await axios.get(
      `/api/v1/videos/all${queryString ? `?${queryString}` : ""}`
    );

    return response?.data?.data;
  } catch (error) {
    handleAxiosError(error);
  }
}


export default function Home() {
  const videos = useLoaderData();
  console.log("Home rendered");


  const playlists = useSelector(
    getAllPlaylists
  );

  if (videos.length === 0) {
    return <div>No videos found.</div>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <VideoCard
            key={video._id}
            _id={video._id}
            title={video.title}
            owner={video.owner}
            duration={video.duration}
            views={video.views}
            thumbnail={video.thumbnail}
            playlists={playlists}
            createdAt={video.createdAt}
          />
        ))}
      </div>
    </div>
  );
}