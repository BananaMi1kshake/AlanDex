import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query missing' });

  try {
    const targetUrl = `https://manganato.com/search/story/${q.trim().replace(/\s+/g, '_')}`;
    const { data } = await axios.get(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const $ = cheerio.load(data);
    const results = [];

    $('.search-story-item').each((_, el) => {
      results.push({
        title: $(el).find('.item-title').text().trim(),
        url: $(el).find('.item-title').attr('href'),
        img: $(el).find('img').attr('src')
      });
    });

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch search results' });
  }
}