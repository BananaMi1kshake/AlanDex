import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(200).json([]);

  const targetUrl = `https://api.comick.fun/v1.0/search?q=${encodeURIComponent(q)}&limit=20`;
  const proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(targetUrl)}`;

  try {
    const response = await axios.get(proxyUrl, { timeout: 6000 });
    // Safely parse the proxy string response into clean JSON data
    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    
    const items = data || [];
    const results = items.map(item => ({
      title: item.title || 'Unknown Title',
      url: item.slug, 
      img: item.md_covers?.[0]?.b2key ? `https://meo.comick.pictures/${item.md_covers[0].b2key}` : ''
    }));

    return res.status(200).json(results);
  } catch (err) {
    // Failover backup network mirror if the primary link experiences lag
    try {
      const backupUrl = `https://api.comick.io/v1.0/search?q=${encodeURIComponent(q)}&limit=20`;
      const backupProxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(backupUrl)}`;
      const response = await axios.get(backupProxyUrl, { timeout: 6000 });
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      
      const items = data || [];
      const results = items.map(item => ({
        title: item.title || 'Unknown Title',
        url: item.slug,
        img: item.md_covers?.[0]?.b2key ? `https://meo.comick.pictures/${item.md_covers[0].b2key}` : ''
      }));
      return res.status(200).json(results);
    } catch (backupErr) {
      return res.status(200).json([]);
    }
  }
}
