import axios from 'axios';

export default async function handler(req, res) {
  const { src } = req.query;
  if (!src) return res.status(400).send('Missing source identifier');

  try {
    const decodedUrl = decodeURIComponent(src);
    
    const response = await axios.get(decodedUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://chapmanganato.to/' // Spoofs the internal asset network perfectly
      }
    });

    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); 
    return res.send(response.data);
  } catch (e) {
    return res.status(500).send('Asset streaming failed');
  }
}
