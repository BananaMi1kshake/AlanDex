import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; 
  if (!url) return res.status(200).json([]);

  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await axios.get(proxyUrl);
    const html = response.data.contents;

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
