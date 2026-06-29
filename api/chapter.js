import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; // Receives the chapter token
  if (!url) return res.status(200).json([]);

  // Route the lightweight JSON endpoint through the high-speed proxy bridge
  const targetUrl = `https://api.comick.fun/chapter/${url}`;
  const proxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(targetUrl)}`;

  try {
    const response = await axios.get(proxyUrl, { timeout: 5000 });
    
    // Safely handles both pre-parsed JSON objects and raw string payloads
    const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    
    const images = data?.chapter?.md_images || [];
    const pages = images.map(img => `https://meo.comick.pictures/${img.b2key}`);

    return res.status(200).json(pages);
  } catch (err) {
    // Failover backup domain if the main endpoint undergoes maintenance
    try {
      const backupUrl = `https://api.comick.io/chapter/${url}`;
      const backupProxyUrl = `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(backupUrl)}`;
      const response = await axios.get(backupProxyUrl, { timeout: 5000 });
      
      const data = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
      const images = data?.chapter?.md_images || [];
      const pages = images.map(img => `https://meo.comick.pictures/${img.b2key}`);
      
      return res.status(200).json(pages);
    } catch (backupErr) {
      return res.status(200).json([]);
    }
  }
}
