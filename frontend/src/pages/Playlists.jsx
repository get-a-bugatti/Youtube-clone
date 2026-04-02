import { PlaylistCard } from "../components";

export default function Playlists({ playlists }) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlists.map(pl => (
          <PlaylistCard
            key={pl._id}
            _id={pl._id}
            name={pl.name}
            owner={pl.owner}
            videosCount={pl.videos?.length}
            thumbnail={pl.thumbnail || pl.videos?.[0]?.thumbnail}
          />
        ))}
      </div>
    );
  }