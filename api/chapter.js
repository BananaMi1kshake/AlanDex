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
    const pages = [];

    // Collects every high-definition image source link from the reading container
    $('img').each((_, el) => {
      const src = $(el).attr('data-src') || $(el).attr('src');
      if (src && (src.includes('cdn') || src.includes('mangapill'))) {
        pages.push(src);
      }
    });

    return res.status(200).json(pages);
  } catch (err) {
    return res.status(200).json([]);
  }
}
