import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; // Receives the unique chapter hid token
  if (!url) return res.status(200).json([]);

  const domains = ['https://api.comick.io', 'https://api.comick.fun'];

  for (const base of domains) {
    try {
      const response = await axios.get(`${base}/chapter/${url}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 4000
      });
      
      const images = response.data?.chapter?.md_images || [];
      const pages = images.map(img => `https://meo.comick.pictures/${img.b2key}`);

      return res.status(200).json(pages);
    } catch (err) {
      continue;
    }
  }
  return res.status(200).json([]);
}
