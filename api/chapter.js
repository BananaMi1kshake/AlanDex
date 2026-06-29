import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL missing' });

  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    const pages = [];

    $('.container-chapter-reader img').each((_, el) => {
      const src = $(el).attr('src');
      if (src) pages.push(src);
    });

    return res.status(200).json(pages);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch chapter pages' });
  }
}