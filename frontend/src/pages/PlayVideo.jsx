import axios from "axios";
import { handleAxiosError } from "../api/handleAxiosError.js";
import { useLoaderData } from "react-router-dom";
import VideoPlayer from "../features/videos/VideoPlayer";
import VideoInfo from "../features/videos/VideoInfo.jsx";

export const playVideoLoader = async ({ request }) => {
  const url = new URL(request.url);
  const videoId = url.searchParams.get("v");

  if (!videoId) {
    throw new Response("Missing query parameter 'v'", {
      status: 400,
    });
  }

  try {
    const response = await axios.get(`/api/v1/videos/owner/${videoId}`);

    return response.data.data;
  } catch (error) {
    handleAxiosError(error);
  }
};


export default function PlayVideo() {
  const video = useLoaderData();

  return (
    <div className="w-full">
      <VideoPlayer videoUrl={video.videoFile} />

      <VideoInfo
        title={video.title}
        description={video.description}
        owner={video.owner}
      />
    </div>
  );
}