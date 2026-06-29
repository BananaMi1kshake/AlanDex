import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query missing' });

  try {
    // Fetch data directly from ComicK's open JSON endpoint
    const { data } = await axios.get(`https://api.comick.io/v1.0/search?q=${encodeURIComponent(q)}`);
    
    // Map the properties to match your index.html layout exactly
    const results = data.map(item => ({
      title: item.title,
      url: item.slug, // Uses the unique text slug as the routing identifier
      img: item.md_covers?.[0]?.b2c ? `https://meo.comick.pictures/${item.md_covers[0].b2c}` : ''
    }));

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch search results' });
  }
}
