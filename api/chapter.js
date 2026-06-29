import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; // Receives the unique chapter ID
  if (!url) return res.status(200).json([]);

  const mirrors = [
    `https://consumet-api-production-e143.up.railway.app/manga/manganato/read?chapterId=${url}`,
    `https://api.consumet.org/manga/manganato/read?chapterId=${url}`
  ];

  for (const urlPath of mirrors) {
    try {
      const response = await axios.get(urlPath, { timeout: 4000 });
      const pagesData = response.data || [];
      
      // Extracts the raw image properties straight from the array objects
      const pages = pagesData.map(page => page.img || page.page);

      return res.status(200).json(pages);
    } catch (err) {
      continue;
    }
  }

  return res.status(200).json([]);
}
