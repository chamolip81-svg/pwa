import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ListMusic,
  Shuffle,
  Repeat,
  Repeat1,
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import QueueDrawer from "./QueueDrawer";
import { useState } from "react";

const formatTime = (t = 0) =>
  `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;

export default function Player() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    shuffle,
    repeat,
    playSong,
    pauseSong,
    playNext,
    playPrevious,
    seekTo,
    setPlayerVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);

  if (!currentSong) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-4 z-20">
      {/* Progress */}
      <div
        className="h-1 bg-gray-700 rounded cursor-pointer mb-3"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          seekTo(percent * duration);
        }}
      >
        <div
          className="h-1 bg-green-500 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Song Info */}
        <div>
          <h4 className="font-semibold truncate">{currentSong.name}</h4>
          <p className="text-sm text-gray-400 truncate">
            {currentSong.primaryArtists}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <button onClick={playPrevious} className="hover:text-green-500 transition">
            <SkipBack size={20} />
          </button>

          <button
            onClick={isPlaying ? pauseSong : () => playSong(currentSong)}
            className="p-2 bg-green-500 text-black rounded-full hover:bg-green-600 transition"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button onClick={playNext} className="hover:text-green-500 transition">
            <SkipForward size={20} />
          </button>

          <button onClick={toggleMute} className="hover:text-green-500 transition">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => setPlayerVolume(Number(e.target.value))}
            className="w-24 cursor-pointer"
          />

          <button
            onClick={() => setShowQueue(true)}
            className={`transition ${
              showQueue ? "text-green-500" : "text-gray-400 hover:text-green-500"
            }`}
          >
            <ListMusic size={20} />
          </button>

          <button
            onClick={toggleShuffle}
            className={`transition ${shuffle ? "text-green-500" : "text-gray-400 hover:text-green-500"}`}
          >
            <Shuffle size={20} />
          </button>

          <button
            onClick={toggleRepeat}
            className={`transition ${repeat !== "off" ? "text-green-500" : "text-gray-400 hover:text-green-500"}`}
          >
            {repeat === "one" ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>
      </div>

      {showQueue && <QueueDrawer onClose={() => setShowQueue(false)} />}
    </div>
  );
}