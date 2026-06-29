import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; 
  if (!url) return res.status(200).json([]);

  const targetUrl = `https://api.comick.fun/chapter/${url}`;
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

  try {
    const response = await axios.get(proxyUrl, { timeout: 5000 });
    const data = response.data;
    
    const images = data?.chapter?.md_images || [];
    const pages = images.map(img => `https://meo.comick.pictures/${img.b2key}`);

    return res.status(200).json(pages);
  } catch (err) {
    console.error("PAGES PRIMARY FAILED:", err.message);
    try {
      const backupUrl = `https://api.comick.io/chapter/${url}`;
      const backupProxyUrl = `https://corsproxy.io/?${encodeURIComponent(backupUrl)}`;
      const response = await axios.get(backupProxyUrl, { timeout: 5000 });
      const data = response.data;
      
      const images = data?.chapter?.md_images || [];
      const pages = images.map(img => `https://meo.comick.pictures/${img.b2key}`);
      
      return res.status(200).json(pages);
    } catch (backupErr) {
      console.error("PAGES BACKUP FAILED:", backupErr.message);
      return res.status(200).json([]);
    }
  }
}
