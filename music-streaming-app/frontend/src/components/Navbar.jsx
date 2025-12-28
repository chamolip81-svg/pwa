import { Home, Search as SearchIcon, Heart, ListMusic } from "lucide-react";

export default function Navbar({ currentTab, onTabChange }) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: SearchIcon },
    { id: "favorites", label: "Liked", icon: Heart },
    { id: "playlists", label: "Playlists", icon: ListMusic },
  ];

  return (
    <nav className="sticky top-0 bg-black border-b border-gray-800 z-10">
      <div className="px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-green-400">🎵 Auralyn</h1>
        <div className="flex items-center gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded transition ${
                currentTab === id
                  ? "bg-green-500 text-black font-semibold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}