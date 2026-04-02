import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MdPlaylistAdd } from "react-icons/md";
import {Tooltip} from "react-tooltip";

export default function PlaylistDropdown({ videoId }) {
  const [playlistOpen, setPlaylistOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const dropdownRef = useRef();

  useEffect(() => {
    axios.get("/api/playlists")
      .then(res => setPlaylists(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setPlaylistOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handlePlaylistButtonClick =  (e) => {
    e.stopPropagation();
    setPlaylistOpen(playlistOpen => !playlistOpen);
  }

  const handleModalOpen = (e) => {
    e.stopPropagation();
    setModalOpen(true);
  }

  const handleAddToPlaylist = async (playlistId) => {

    try {
      await axios.post(`/api/playlists/${playlistId}/videos`, { videoId });
      alert("Video added!");
      setPlaylistOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add video.");
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    try {
      const res = await axios.post("/api/playlists", { name: newPlaylistName });
      setPlaylists(prev => [...prev, res.data]);
      setNewPlaylistName("");
      setModalOpen(false);
      setPlaylistOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to create playlist.");
    }
  };

  return (
    <div className="relative" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
      <button
      id={`add-playlist-btn-${videoId}`}
        className=" px-2 py-1 rounded text-sm cursor-pointer"
        onClick={(e) => handlePlaylistButtonClick(e)}
      >
        <MdPlaylistAdd size={24} className="bg-transparent"></MdPlaylistAdd>
      </button>

      <Tooltip
        anchorSelect={`#add-playlist-btn-${videoId}`} // connects tooltip to button
        place="top"               // top, bottom, left, right
        content="Add video to your playlist"
        delayShow={200}           // optional delay
      />

      {playlistOpen && (
        <div className="absolute z-50 mt-1 bg-white border shadow-lg rounded w-48" onClick={(e) => e.stopPropagation()}>
          <div
            className="px-2 py-1 cursor-pointer hover:bg-gray-100"
            onClick={(e) => handleModalOpen(e)}
          >
            + Create New Playlist
          </div>
          {playlists.map(pl => (
            <div
              key={pl._id}
              className="px-2 py-1 cursor-pointer hover:bg-gray-100"
              onClick={() => handleAddToPlaylist(pl._id)}
            >
              {pl.name}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={(e) => {
            e.stopPropagation();
            setModalOpen(false);
          }}>
          <div className="bg-white p-6 rounded shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Create New Playlist</h2>
            <input
              type="text"
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              placeholder="Playlist Name"
              className="w-full border px-2 py-1 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setModalOpen(false)}>Cancel</button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleCreatePlaylist}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}