import PlaylistCard from "../features/playlists/PlaylistCard";
import axios from "axios";
import { handleAxiosError } from "../api/handleAxiosError";
import { useLoaderData } from "react-router-dom";


export async function MyPlaylistsLoader() {
  
  try {
    
      const response = await axios.get("/api/v1/playlists/me");
      return response?.data?.data;

  } catch (error) {
    handleAxiosError(error);
  }
}
  
export default function MyPlaylists() {

  const playlists = useLoaderData();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {playlists.map(pl => (
        <PlaylistCard
          key={pl._id}
          _id={pl._id}
          name={pl.name}
          owner={pl.owner}
          videosCount={pl.videosCount}
          thumbnail={pl.thumbnail || pl.videos?.[0]?.thumbnail}
        />
      ))}
    </div>
  );
  }