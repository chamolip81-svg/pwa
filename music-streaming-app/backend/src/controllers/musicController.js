import { searchSaavn } from "../services/saavnService.js";

export async function searchSongs(req, res) {
  try {
    const q = req.query.q;

    // 1️⃣ Always respond safely
    if (!q || !q.trim()) {
      return res.json([]);
    }

    // 2️⃣ Call Saavn service
    const results = await searchSaavn(q);

    // 3️⃣ Ensure frontend always gets an array
    if (!Array.isArray(results)) {
      return res.json([]);
    }

    // 4️⃣ Success
    res.json(results);
  } catch (error) {
    // 5️⃣ Never crash search
    console.error("Search error:", error.message);
    res.json([]);
  }
}
