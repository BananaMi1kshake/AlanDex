import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; // Receives chapter path
  if (!url) return res.status(200).json([]);

  try {
    const targetUrl = `https://mangapill.com${url}`;
    const response = await axios.get(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      timeout: 5000
    });

    const $ = cheerio.load(response.data);
    const pages = [];

    // Gathers every manga page image container embedded in the document
    $('img[data-src], .chapter-container img, position-relative img').each((_, el) => {
      const src = $(el).attr('data-src') || $(el).attr('src');
      if (src && !src.includes('logo')) {
        pages.push(src);
      }
    });

    // Fallback regex scan if the aggregator modifies container tags
    if (pages.length === 0) {
      const matches = response.data.matchAll(/<img[^>]+src="([^"]+)"/g);
      for (const match of matches) {
        if (match[1].includes('cdn') || match[1].includes('mangapill')) {
          pages.push(match[1]);
        }
      }
    }

    return res.status(200).json(pages);
  } catch (err) {
    return res.status(200).json([]);
  }
}
