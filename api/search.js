import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(200).json([]);

  try {
    const targetUrl = `https://manganato.com/search/story/${q.trim().replace(/\s+/g, '_')}`;
    // Route the request through the free AllOrigins proxy bridge
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    
    const response = await axios.get(proxyUrl);
    const html = response.data.contents; // AllOrigins wraps the HTML inside a 'contents' key

    const $ = cheerio.load(html);
    const results = [];

    $('.search-story-item').each((_, el) => {
      const titleEl = $(el).find('.item-title');
      results.push({
        title: titleEl.text().trim(),
        url: titleEl.attr('href'), // Passes the full Manganato URL as the identifier
        img: $(el).find('img').attr('src')
      });
    });

    return res.status(200).json(results);
  } catch (err) {
    return res.status(200).json([]); // Fallback to an empty array to prevent layout errors
  }
}
