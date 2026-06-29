import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(200).json([]);

  try {
    const response = await axios.get(`https://mangapill.com/search?q=${encodeURIComponent(q.trim())}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      timeout: 5000
    });

    const $ = cheerio.load(response.data);
    const results = [];
    const seenUrls = new Set();

    // Locates all manga entry grid elements on the page
    $('a[href^="/manga/"]').each((_, el) => {
      const urlPath = $(el).attr('href');
      if (seenUrls.has(urlPath)) return;
      seenUrls.add(urlPath);

      // Extract title and cover art details cleanly
      const title = $(el).find('div.line-clamp-2, .text-sm, .font-bold').text().trim() || $(el).text().trim();
      const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src') || '';

      if (title && urlPath) {
        results.push({
          title: title,
          url: urlPath, // Saves relative pathway (e.g., "/manga/2/one-piece")
          img: img
        });
      }
    });

    return res.status(200).json(results);
  } catch (err) {
    return res.status(200).json([{ title: "⚠️ Search failed. Please try again.", url: "error", img: "" }]);
  }
}
