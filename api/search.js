import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(200).json([]);

  try {
    const targetUrl = `https://manganato.com/search/story/${q.trim().replace(/\s+/g, '_')}`;
    // Route traffic through the high-speed CodeTabs proxy core
    const proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(targetUrl)}`;
    
    // Enforce an internal threshold so Vercel never kills our process
    const response = await axios.get(proxyUrl, { timeout: 6000 });
    const html = response.data; // CodeTabs transmits raw HTML directly

    const $ = cheerio.load(html);
    const results = [];

    $('.search-story-item').each((_, el) => {
      const titleEl = $(el).find('.item-title');
      if (titleEl.length) {
        results.push({
          title: titleEl.text().trim(),
          url: titleEl.attr('href'), 
          img: $(el).find('img').attr('src')
        });
      }
    });

    return res.status(200).json(results);
  } catch (err) {
    // Graceful error state: returns an actionable card instead of a blank screen
    return res.status(200).json([{
      title: "⚠️ Search Timed Out. Please click to retry.",
      url: "error",
      img: ""
    }]);
  }
}
