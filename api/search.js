import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(200).json([]);

  // Unified cluster of operational developer nodes
  const targets = [
    `https://api.comick.fun/v1.0/search?q=${encodeURIComponent(q)}&limit=20`,
    `https://api.comick.dev/v1.0/search?q=${encodeURIComponent(q)}&limit=20`
  ];

  for (const url of targets) {
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 3000 // Fast 3-second check
      });
      
      const items = response.data || [];
      const results = items.map(item => ({
        title: item.title || item.slug || 'Unknown Title',
        url: item.slug, 
        img: item.md_covers?.[0]?.b2key ? `https://meo.comick.pictures/${item.md_covers[0].b2key}` : ''
      }));

      return res.status(200).json(results);
    } catch (err) {
      // If a mirror drops connection, automatically loop to the backup channel
      continue;
    }
  }

  // Absolute fallback case if the entire cluster is undergoing maintenance
  return res.status(200).json([{
    title: "⚠️ Network cluster busy. Please tap to try searching again.",
    url: "error",
    img: ""
  }]);
}
