import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; 
  if (!url) return res.status(200).json([]);

  const targetUrl = `https://api.comick.fun/comic/${url}/chapters?lang=en&limit=100`;
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;

  try {
    const response = await axios.get(proxyUrl, { timeout: 5000 });
    const data = response.data;
    
    const chaptersData = data?.chapters || [];
    const chapters = chaptersData.map(chap => ({
      name: chap.chap ? `Chapter ${chap.chap}${chap.title ? ': ' + chap.title : ''}` : 'Special Chapter',
      url: chap.hid 
    }));

    return res.status(200).json(chapters);
  } catch (err) {
    console.error("MANGA CHAPTERS PRIMARY FAILED:", err.message);
    try {
      const backupUrl = `https://api.comick.io/comic/${url}/chapters?lang=en&limit=100`;
      const backupProxyUrl = `https://corsproxy.io/?${encodeURIComponent(backupUrl)}`;
      const response = await axios.get(backupProxyUrl, { timeout: 5000 });
      const data = response.data;
      
      const chaptersData = data?.chapters || [];
      const chapters = chaptersData.map(chap => ({
        name: chap.chap ? `Chapter ${chap.chap}${chap.title ? ': ' + chap.title : ''}` : 'Special Chapter',
        url: chap.hid 
      }));
      return res.status(200).json(chapters);
    } catch (backupErr) {
      console.error("MANGA CHAPTERS BACKUP FAILED:", backupErr.message);
      return res.status(200).json([]);
    }
  }
}
