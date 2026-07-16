import axios from "axios";
import { handleAxiosError } from "../api/handleAxiosError.js";
import { useLoaderData } from "react-router-dom";
import VideoCard from "../features/videos/VideoCard";

export async function likedVideosLoader() {
  try {
    const response = await axios.get("/api/v1/users/liked/videos");

    return response.data.data.docs;
  } catch (error) {
    handleAxiosError(error);
  }
}


export default function LikedVideos() {
  const videos = useLoaderData();

  if (videos.length === 0) {
    return <div>You have no liked videos.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-fit">
      {videos.map((video) => (
        <VideoCard
          key={video._id}
          _id={video._id}
          title={video.title}
          description={video.description}
          thumbnail={video.thumbnail}
          owner={video.owner}
          views={video.views}
          duration={video.duration}
          createdAt={video.createdAt}
        />
      ))}
    </div>
  );
}