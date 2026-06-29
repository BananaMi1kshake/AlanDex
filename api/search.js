import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(200).json([]);

  const domains = ['https://api.comick.io', 'https://api.comick.fun'];

  for (const base of domains) {
    try {
      const response = await axios.get(`${base}/v1.0/search?q=${encodeURIComponent(q)}&limit=20`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 4000
      });
      
      const items = response.data || [];
      const results = items.map(item => ({
        title: item.title || 'Unknown Title',
        url: item.slug, // Sends the text slug (e.g., "one-piece")
        img: item.md_covers?.[0]?.b2key ? `https://meo.comick.pictures/${item.md_covers[0].b2key}` : ''
      }));

      return res.status(200).json(results);
    } catch (err) {
      continue; 
    }
  }
  return res.status(200).json([]);
}
