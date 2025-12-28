import { useState } from "react";
import Navbar from "./components/Navbar";
import Search from "./pages/Search";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Player from "./components/Player";

export default function App() {
  const [currentTab, setCurrentTab] = useState("home");

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar currentTab={currentTab} onTabChange={setCurrentTab} />

      {currentTab === "home" && <Home />}
      {currentTab === "search" && <Search />}
      {currentTab === "favorites" && <Favorites />}
      {currentTab === "playlists" && (
        <div className="p-6 pb-32 text-center text-gray-400">
          <p>Playlists feature coming soon</p>
        </div>
      )}

      <Player />
    </div>
  );
}