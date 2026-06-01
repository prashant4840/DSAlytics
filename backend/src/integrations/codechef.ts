import axios from "axios";

export interface CodechefStats {
  rating: number;
  stars: string;
  globalRank: number;
  solved: number;
}

export const fetchCodechefStats = async (username: string): Promise<CodechefStats> => {
  if (!username) {
    return { rating: 0, stars: "0★", globalRank: 0, solved: 0 };
  }

  try {
    const response = await axios.get(`https://www.codechef.com/users/${username}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 8000,
    });

    const html = response.data;

    // Parse Rating (resilient to attributes, quotes, spaces)
    const ratingMatch = html.match(/<div[^>]*class=["']rating-number["'][^>]*>\s*(\d+)\s*<\/div>/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : 0;

    // Parse Stars (resilient to attributes, quotes, spaces)
    const starsMatch = html.match(/<span[^>]*class=["']rating["'][^>]*>\s*([1-7]★?)\s*<\/span>/i);
    const stars = starsMatch ? starsMatch[1] : "0★";

    // Parse Global Rank (resilient to spaces, href quote styles)
    const rankMatch = html.match(/href=["']\/ratings\/all["'][^>]*>\s*<span[^>]*>\s*(\d+)\s*<\/span>/i);
    const globalRank = rankMatch ? parseInt(rankMatch[1], 10) : 0;

    // Parse Solved Problems (resilient to casing and slight label variations)
    const solvedMatch = html.match(/(?:Fully Solved|Solved Problems?)\s*\((\d+)\)/i);
    const solved = solvedMatch ? parseInt(solvedMatch[1], 10) : 0;

    return {
      rating,
      stars,
      globalRank,
      solved,
    };
  } catch (error: any) {
    console.error(`Error scraping CodeChef stats for ${username}:`, error.message);
    
    // Return zeros on failure instead of fabricated data
    return {
      rating: 0,
      stars: "0★",
      globalRank: 0,
      solved: 0,
    };
  }
};
