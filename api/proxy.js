import axios from 'axios';

export default async function handler(req, res) {
  const { src } = req.query;
  if (!src) return res.status(400).send('Missing src parameter');

  try {
    const decodedUrl = decodeURIComponent(src);
    const targetOrigin = new URL(decodedUrl).origin;

    const response = await axios.get(decodedUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': targetOrigin
      }
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache locally for fast reloading
    return res.send(response.data);
  } catch (e) {
    return res.status(500).send('Image transmission failed');
  }
}