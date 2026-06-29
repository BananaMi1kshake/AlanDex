import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL missing' });

  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);
    const chapters = [];

    $('.chapter-name').each((_, el) => {
      chapters.push({
        name: $(el).text().trim(),
        url: $(el).attr('href')
      });
    });

    return res.status(200).json(chapters);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch chapters' });
  }
}