import axios from "axios";

// ✅ Environment-aware API base
const API_BASE =
  process.env.REACT_APP_API_BASE_URL
    ? `${process.env.REACT_APP_API_BASE_URL}/api/music`
    : "http://localhost:5000/api/music";

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

// Mock data (keep exactly as you had it)
const MOCK_SONGS = [
  {
    id: "song1",
    name: "Shape of You",
    primaryArtists: "Ed Sheeran",
    image: [
      { link: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=150" },
      { link: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300" },
    ],
    downloadUrl: [
      { link: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    ],
  },
  {
    id: "song2",
    name: "Blinding Lights",
    primaryArtists: "The Weeknd",
    image: [
      { link: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=150" },
      { link: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300" },
    ],
    downloadUrl: [
      { link: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    ],
  },
  // keep the rest of your mock songs unchanged
];

export const searchSongs = async (query) => {
  if (!query.trim()) return [];

  try {
    // 🔥 Real API first
    const { data } = await api.get("/search", {
      params: { q: query },
    });
    return data || [];
  } catch (error) {
    console.warn("API failed, using mock data:", error.message);

    // 🔁 Fallback to mock data
    const lowerQuery = query.toLowerCase();
    return MOCK_SONGS.filter(
      (song) =>
        song.name.toLowerCase().includes(lowerQuery) ||
        song.primaryArtists.toLowerCase().includes(lowerQuery)
    );
  }
};

export default api;
