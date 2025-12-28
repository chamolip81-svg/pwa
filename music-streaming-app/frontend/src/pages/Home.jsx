
import { Music, Heart } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { useFavorites } from "../context/FavoritesContext";

export default function Home() {
  const { queue, playSong } = usePlayer();
  const { favorites } = useFavorites();

  const recentSongs = queue.slice(0, 8);
  
  const artists = [...queue, ...favorites]
    .map((s) => s.primaryArtists)
    .filter(Boolean);

  const uniqueArtists = [...new Set(artists)].slice(0, 5);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="p-6 pb-32">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">{getGreeting()} 🎵</h1>

      {/* Recently Played */}
      {recentSongs.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => playSong(song)}
                className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-green-500 cursor-pointer transition group"
              >
                {song.image?.[1]?.link ? (
                  <img
                    src={song.image[1].link}
                    alt={song.name}
                    className="w-full aspect-square object-cover rounded mb-3 group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-800 rounded mb-3 flex items-center justify-center">
                    <Music size={40} className="text-gray-600" />
                  </div>
                )}
                <h3 className="font-semibold truncate">{song.name}</h3>
                <p className="text-sm text-gray-400 truncate">
                  {song.primaryArtists}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Liked Songs */}
      {favorites.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Heart size={24} className="text-red-500" fill="currentColor" />
            Your Liked Songs
          </h2>
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <p className="text-gray-400 mb-4">
              {favorites.length} songs saved
            </p>
            <div className="space-y-2">
              {favorites.slice(0, 5).map((song) => (
                <div
                  key={song.id}
                  onClick={() => playSong(song)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer transition"
                >
                  <img
                    src={song.image?.[0]?.link}
                    alt=""
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium">{song.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {song.primaryArtists}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recommended Artists */}
      {uniqueArtists.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Based on Your Taste</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uniqueArtists.map((artist) => (
              <div
                key={artist}
                className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-green-500 transition"
              >
                <p className="text-gray-300">
                  Because you listen to{" "}
                  <span className="font-semibold text-green-400">{artist}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {recentSongs.length === 0 && favorites.length === 0 && (
        <div className="text-center py-16">
          <Music size={64} className="mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 text-lg">
            Start by searching for your favorite songs
          </p>
        </div>
      )}
    </div>
  );
}