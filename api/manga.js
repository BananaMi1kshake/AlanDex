import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; // Receives the comic slug correctly
  if (!url) return res.status(200).json([]);

  const domains = ['https://api.comick.io', 'https://api.comick.fun'];

  for (const base of domains) {
    try {
      const response = await axios.get(`${base}/comic/${url}/chapters?lang=en&limit=100`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 4000
      });
      
      const chaptersData = response.data?.chapters || [];
      const chapters = chaptersData.map(chap => ({
        name: chap.chap ? `Chapter ${chap.chap}${chap.title ? ': ' + chap.title : ''}` : 'Special Chapter',
        url: chap.hid // CRITICAL: Pass the chapter's internal HID token to the reader view
      }));

      return res.status(200).json(chapters);
    } catch (err) {
      continue;
    }
  }
  return res.status(200).json([]);
}
