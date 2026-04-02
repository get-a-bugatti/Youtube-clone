import axios from "axios";
import { useEffect, useState } from "react";
import { VideoCard } from "../components";

export default function WatchHistory() {
    const [history, setHistory] = useState([]);
    const [loader, setLoader] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        axios.get("/api/v1/users/history")
            .then(response => {
                console.log("WatchHistory response :", response.data);

                setHistory(response.data.data)
            })
            .catch(error => {
                if (error.response) {
                    setError(error.response.data.message)
                } else {
                    setError(error.message);
                }
            })
            .finally(() => {
                setLoader(false);
            })
    }, [])

    if (loader) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

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