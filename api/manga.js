import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; 
  if (!url || url === 'error') return res.status(200).json([]);

  try {
    const proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`;
    const response = await axios.get(proxyUrl, { timeout: 6000 });
    const html = response.data;

    const $ = cheerio.load(html);
    const chapters = [];

    $('.chapter-name').each((_, el) => {
      chapters.push({
        name: $(el).text().trim(),
        url: $(el).attr('href')
      });
    });

    return res.status(200).json(chapters);
  } catch (err) {
    return res.status(200).json([{ name: "⚠️ Connection lagged. Tap to try reloading chapters.", url: "error" }]);
  }
}
