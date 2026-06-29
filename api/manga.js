import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; // Receives the validated hid parameter cleanly
  if (!url || url === 'error') return res.status(200).json([]);

  const targets = [
    `https://api.comick.fun/comic/${url}/chapters?lang=en&limit=100`,
    `https://api.comick.dev/comic/${url}/chapters?lang=en&limit=100`
  ];

  for (const urlPath of targets) {
    try {
      const response = await axios.get(urlPath, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 4000
      });
      const chaptersData = response.data?.chapters || [];

      const chapters = chaptersData.map(chap => ({
        name: chap.chap ? `Chapter ${chap.chap}${chap.title ? ': ' + chap.title : ''}` : 'Special Chapter',
        url: chap.hid 
      }));

      return res.status(200).json(chapters);
    } catch (err) {
      continue;
    }
  }

  return res.status(200).json([{ name: "⚠️ Chapters lagging. Tap to retry loading.", url: "error" }]);
}
