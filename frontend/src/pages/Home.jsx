import { useState, useEffect } from "react";
import { VideoCard } from "../components"
import axios from "axios";

export default function Home() {


    // TODO:  use later.
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("/api/v1/videos/fetchAll") // setup api later.
            .then(response => {
              console.log(response);

                setVideos(response.data.data);
            }).catch(error => {
              if (error.response) {
                setError(error.response.data.message);
              } else {
                  setError(error.message);
              }

            }).finally(() => {
              setLoading(false);
            })
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {
                    videos.map((video, i) => {
                        return <VideoCard key={i} 
                            _id={video._id}
                            title={video.title}
                            owner={video.owner}
                            duration={video.duration}
                            views={video.views}
                            thumbnail={video.thumbnail}
                        />
                    })
                }
            </div>
        </div>
    )
}