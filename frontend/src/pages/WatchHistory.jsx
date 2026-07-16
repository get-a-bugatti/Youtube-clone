import axios from "axios";
import VideoCard from "../features/videos/VideoCard";
import { handleAxiosError } from "../api/handleAxiosError";

export async function WatchHistoryLoader() {
    try {

        const response = await axios.get("/api/v1/users/watch-history");
        return response?.data?.data;
    }
     catch (error) {
        handleAxiosError(error);
    }

}

export default function WatchHistory() {
    const history = useLoaderData();

    return (
        <div className="max-w-[1000px] flex flex-col gap-3">
            {
                history.map((video, i) => {
                    return <VideoCard 
                        key={i}
                        _id={video._id}
                        title={video.title}
                        owner={video.owner}
                        duration={video.duration}
                        views={video.views}
                        thumbnail={video.thumbnail}
                        mode="landscape"
                        className="space-y-3"
                    />
                })
            }
   
        </div>
    )
    
}