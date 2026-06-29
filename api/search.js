import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(200).json([]);

  // Community-maintained high-speed endpoint nodes
  const mirrors = [
    `https://consumet-api-production-e143.up.railway.app/manga/manganato/${encodeURIComponent(q)}`,
    `https://api.consumet.org/manga/manganato/${encodeURIComponent(q)}`
  ];

  for (const url of mirrors) {
    try {
      const response = await axios.get(url, { timeout: 4000 });
      const items = response.data?.results || [];

      const results = items.map(item => ({
        title: item.title || 'Unknown Title',
        url: item.id, // Saves Manganato's unique ID (e.g., 'manga-xx123456')
        img: item.image || ''
      }));

      return res.status(200).json(results);
    } catch (err) {
      continue; // Seamlessly jump to the next mirror node if one lags
    }
  }

  return res.status(200).json([]);
}
