import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; 
  if (!url || url === 'error') return res.status(200).json([]);

  try {
    const response = await axios.get(`https://mangapill.com${url}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 5000
    });

    const $ = cheerio.load(response.data);
    const chapters = [];

    // Gathers the list of active chapters from the manga's profile page
    $('a[href^="/chapters/"]').each((_, el) => {
      chapters.push({
        name: $(el).text().trim(),
        url: $(el).attr('href') // Saves chapter path (e.g., "/chapters/2-1100/...")
      });
    });

    return res.status(200).json(chapters);
  } catch (err) {
    return res.status(200).json([{ name: "⚠️ Chapters failed to load. Tap to retry.", url: "error" }]);
  }
}
