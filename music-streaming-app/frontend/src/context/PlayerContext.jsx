import { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext();
const STORAGE_KEY = "auralyn-player";

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());

  /* ---------- CORE STATE ---------- */
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  /* ---------- VOLUME ---------- */
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  /* ---------- QUEUE ---------- */
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);

  /* ---------- MODES ---------- */
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off");

  /* ---------- RESTORE FROM STORAGE ---------- */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      setQueue(data.queue || []);
      setQueueIndex(data.queueIndex ?? -1);
      setCurrentSong(data.currentSong || null);
      setShuffle(data.shuffle || false);
      setRepeat(data.repeat || "off");
      setVolume(data.volume ?? 0.8);
    } catch {}
  }, []);

  /* ---------- PERSIST STATE ---------- */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        queue,
        queueIndex,
        currentSong,
        shuffle,
        repeat,
        volume,
      })
    );
  }, [queue, queueIndex, currentSong, shuffle, repeat, volume]);

  /* ---------- AUDIO EVENTS ---------- */
  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => handleEnded();

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  });

  /* ---------- HELPERS ---------- */
  const resolveUrl = (song) =>
    song?.downloadUrl?.[4]?.url ||
    song?.downloadUrl?.[0]?.url ||
    song?.url ||
    null;

  const playInternal = (song, index) => {
    const url = resolveUrl(song);
    if (!url) return;

    audioRef.current.src = url;
    setCurrentSong(song);
    setQueueIndex(index);
    setCurrentTime(0);

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(console.error);
  };

  /* ---------- PLAY CONTROLS ---------- */
  const playSong = (song) => {
    setQueue([song]);
    playInternal(song, 0);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const seekTo = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  /* ---------- VOLUME ---------- */
  const setPlayerVolume = (v) => {
    const vol = Math.min(1, Math.max(0, v));
    setVolume(vol);
    setIsMuted(vol === 0);
    audioRef.current.volume = vol;
  };

  const toggleMute = () => {
    setIsMuted((m) => !m);
    audioRef.current.volume = isMuted ? volume : 0;
  };

  /* ---------- QUEUE MANAGEMENT ---------- */
  const addToQueue = (song) => {
    setQueue((prev) =>
      prev.find((s) => s.id === song.id) ? prev : [...prev, song]
    );
  };

  const removeFromQueue = (id) => {
    setQueue((prev) => prev.filter((s) => s.id !== id));
  };

  const clearQueue = () => {
    pauseSong();
    setQueue([]);
    setQueueIndex(-1);
    setCurrentSong(null);
  };

  /* ---------- NAVIGATION ---------- */
  const playNext = () => {
    if (!queue.length) return;

    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      playInternal(queue[randomIndex], randomIndex);
      return;
    }

    if (queueIndex + 1 < queue.length) {
      playInternal(queue[queueIndex + 1], queueIndex + 1);
    } else if (repeat === "all") {
      playInternal(queue[0], 0);
    } else {
      setIsPlaying(false);
    }
  };

  const playPrevious = () => {
    if (queueIndex > 0) {
      playInternal(queue[queueIndex - 1], queueIndex - 1);
    }
  };

  const handleEnded = () => {
    if (repeat === "one") {
      playInternal(currentSong, queueIndex);
    } else {
      playNext();
    }
  };

  /* ---------- MODE TOGGLES ---------- */
  const toggleShuffle = () => setShuffle((s) => !s);

  const toggleRepeat = () =>
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        queue,
        queueIndex,
        shuffle,
        repeat,
        playSong,
        pauseSong,
        playNext,
        playPrevious,
        seekTo,
        setPlayerVolume,
        toggleMute,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleShuffle,
        toggleRepeat,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);