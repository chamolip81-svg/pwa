import axios from "axios";

const SAAVN_BASE = "https://saavn.sumit.co";

export async function searchSaavn(query) {
  try {
    const res = await axios.get(
      `${SAAVN_BASE}/api/search/songs`,
      {
        params: {
          query: query,   // ⚠️ must be `query`
          page: 0,
          limit: 10,
        },
        timeout: 15000,
      }
    );

    // According to docs:
    // success -> data -> results
    if (res.data?.success && Array.isArray(res.data?.data?.results)) {
      return res.data.data.results;
    }

    return [];
  } catch (error) {
    console.error("Saavn API error:", error.message);
    return [];
  }
}
