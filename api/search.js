import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(200).json([]);

  const targetUrl = `https://api.comick.fun/v1.0/search?q=${encodeURIComponent(q)}&limit=20`;
  // Switching to the faster corsproxy.io network
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

  try {
    const response = await axios.get(proxyUrl, { timeout: 5000 });
    const data = response.data;
    
    const items = data || [];
    const results = items.map(item => ({
      title: item.title || 'Unknown Title',
      url: item.slug, 
      img: item.md_covers?.[0]?.b2key ? `https://meo.comick.pictures/${item.md_covers[0].b2key}` : ''
    }));

    return res.status(200).json(results);
  } catch (err) {
    // DIAGNOSTIC LOG: This prints the exact reason for failure to your Vercel console
    console.error("SEARCH PRIMARY FAILED:", err.message, err.response?.data);

    try {
      const backupUrl = `https://api.comick.io/v1.0/search?q=${encodeURIComponent(q)}&limit=20`;
      const backupProxyUrl = `https://corsproxy.io/?${encodeURIComponent(backupUrl)}`;
      const response = await axios.get(backupProxyUrl, { timeout: 5000 });
      const data = response.data;
      
      const items = data || [];
      const results = items.map(item => ({
        title: item.title || 'Unknown Title',
        url: item.slug,
        img: item.md_covers?.[0]?.b2key ? `https://meo.comick.pictures/${item.md_covers[0].b2key}` : ''
      }));
      return res.status(200).json(results);
    } catch (backupErr) {
      console.error("SEARCH BACKUP FAILED:", backupErr.message);
      return res.status(200).json([]);
    }
  }
}
