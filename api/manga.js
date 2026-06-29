import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; // Receives the Manganato ID
  if (!url) return res.status(200).json([]);

  const mirrors = [
    `https://consumet-api-production-e143.up.railway.app/manga/manganato/info/${url}`,
    `https://api.consumet.org/manga/manganato/info/${url}`
  ];

  for (const urlPath of mirrors) {
    try {
      const response = await axios.get(urlPath, { timeout: 4000 });
      const chaptersData = response.data?.chapters || [];

      const chapters = chaptersData.map(chap => ({
        name: chap.title || `Chapter ${chap.chapterNumber}`,
        url: chap.id // Passes the internal unique chapter ID cleanly
      }));

      return res.status(200).json(chapters);
    } catch (err) {
      continue;
    }
  }

  return res.status(200).json([{ name: "⚠️ Connection busy. Tap to retry loading chapters.", url: "" }]);
}
