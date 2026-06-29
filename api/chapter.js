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
    const pages = [];

    $('.container-chapter-reader img').each((_, el) => {
      const src = $(el).attr('src');
      if (src) pages.push(src);
    });

    return res.status(200).json(pages);
  } catch (err) {
    return res.status(200).json([]);
  }
}
