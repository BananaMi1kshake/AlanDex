import axios from 'axios';

export default async function handler(req, res) {
  // Enforce global CORS compliance for your frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  const { q } = req.query;
  if (!q) return res.status(200).json([]);

  try {
    // Connect directly to the cluster using structural browser camouflage
    const response = await axios.get(`https://api.comick.fun/v1.0/search?q=${encodeURIComponent(q)}&limit=20`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://comick.fun/',
        'Origin': 'https://comick.fun'
      },
      timeout: 4000
    });
    
    const items = response.data || [];
    const results = items.map(item => ({
      title: item.title || 'Unknown Title',
      url: item.hid, // Pass the unique numeric HID down the pipe
      img: item.md_covers?.[0]?.b2key ? `https://meo.comick.pictures/${item.md_covers[0].b2key}` : ''
    }));

    return res.status(200).json(results);
  } catch (err) {
    return res.status(200).json([]);
  }
}
