import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(400).json([]);

  try {
    const response = await axios.get(`https://api.comick.io/v1.0/search?q=${encodeURIComponent(q)}&limit=20`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://comick.io/'
      }
    });
    
    const data = response.data;
    const items = Array.isArray(data) ? data : (data.results || []);

    const results = items.map(item => ({
      title: item.title || item.slug || 'Unknown Title',
      url: item.slug, 
      img: item.md_covers?.[0]?.b2key ? `https://meo.comick.pictures/${item.md_covers[0].b2key}` : ''
    }));

    return res.status(200).json(results);
  } catch (err) {
    // Returns an empty array on failure to prevent frontend ghost loops
    return res.status(200).json([]); 
  }
}
