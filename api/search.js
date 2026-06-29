import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(200).json([]);

  const targets = [
    `https://api.comick.fun/v1.0/search?q=${encodeURIComponent(q)}&limit=20`,
    `https://api.comick.dev/v1.0/search?q=${encodeURIComponent(q)}&limit=20`
  ];

  for (const url of targets) {
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 4000 
      });
      
      const items = response.data || [];
      const results = items.map(item => ({
        title: item.title || 'Unknown Title',
        url: item.hid, // CRITICAL FIX: Passing internal hid token instead of standard slug text
        img: item.md_covers?.[0]?.b2key ? `https://meo.comick.pictures/${item.md_covers[0].b2key}` : ''
      }));

      return res.status(200).json(results);
    } catch (err) {
      continue;
    }
  }

  return res.status(200).json([{
    title: "⚠️ Network cluster busy. Please tap to try searching again.",
    url: "error",
    img: ""
  }]);
}
