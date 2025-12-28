import { useState } from "react";
import { searchSongs } from "../services/api";
import { usePlayer } from "../context/PlayerContext";
import { useFavorites } from "../context/FavoritesContext";
import { Play, Music, AlertCircle, Heart, Download } from "lucide-react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { playSong, addToQueue } = usePlayer();
  const { toggleFavorite, isFavorite } = useFavorites();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setSongs([]);

    try {
      const results = await searchSongs(query);
      setSongs(results);
      if (results.length === 0) {
        setError("No songs found. Try another search.");
      }
    } catch (err) {
      setError("Failed to search songs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="p-6 pb-32">
      <h2 className="text-3xl font-bold mb-6 text-white">Search Music</h2>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Search songs, artists, albums..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-3 rounded bg-gray-900 text-white border border-gray-700 focus:border-green-500 focus:outline-none transition"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-8 bg-green-500 text-black rounded font-semibold hover:bg-green-600 transition disabled:bg-gray-600"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 mb-6 bg-red-900/20 border border-red-700 rounded text-red-300">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {songs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {songs.map((song) => (
            <div
              key={song.id}
              className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-green-500 transition cursor-pointer group"
            >
              <div className="relative w-full aspect-square bg-gray-800 overflow-hidden">
                {song.image?.[1]?.link ? (
                  <img
                    src={song.image[1].link}
                    alt={song.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Music size={40} className="text-gray-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(song);
                    }}
                    className="p-3 bg-green-500 text-black rounded-full hover:bg-green-600 transition"
                    title="Play"
                  >
                    <Play size={20} fill="currentColor" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToQueue(song);
                    }}
                    className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
                    title="Add to queue"
                  >
                    +
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(song);
                    }}
                    className={`p-3 rounded-full transition ${
                      isFavorite(song.id)
                        ? "bg-red-500 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                    title="Add to favorites"
                  >
                    <Heart size={20} fill={isFavorite(song.id) ? "currentColor" : "none"} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        song.downloadUrl?.[4]?.url || song.downloadUrl?.[0]?.url,
                        "_blank"
                      );
                    }}
                    className="p-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition"
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white truncate mb-1">
                  {song.name}
                </h3>
                <p className="text-sm text-gray-400 truncate">
                  {song.primaryArtists}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && songs.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center h-96 text-gray-400">
          <Music size={48} className="mb-4 text-gray-600" />
          <p className="text-lg">Search for your favorite songs</p>
          <p className="text-sm">Start by typing in the search box above</p>
        </div>
      )}
    </div>
  );
}