import axios from "axios";
import {VideoCard} from "../features/videos/VideoCard";
import { handleAxiosError } from "../api/handleAxiosError.js";
import { useLoaderData } from "react-router-dom";

export async function YourVideosLoader() {
    try {

        const response = await axios.get("/api/v1/videos/me");
    
        return response?.data?.data;
    } catch (error) {
        handleAxiosError(error);
    }
}


export default function YourVideos() {
    const videos = useLoaderData();

    return (

        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-fit">
            {
                videos.map((video, i) => {
                    return <VideoCard key={i}
                        _id={video._id}
                        title={video.title}
                        description={video.description}
                        thumbnail={video.thumbnail}
                        owner={video.owner}
                        views={video.views}
                        duration={video.duration}
                        createdAt={video.createdAt}
                    />
                })
            }
        </div>
    )
}