import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; 
  if (!url || url === 'error') return res.status(200).json([]);

  const targets = [
    `https://api.comick.fun/chapter/${url}`,
    `https://api.comick.dev/chapter/${url}`
  ];

  for (const urlPath of targets) {
    try {
      const response = await axios.get(urlPath, { timeout: 3000 });
      const images = response.data?.chapter?.md_images || [];
      const pages = images.map(img => `https://meo.comick.pictures/${img.b2key}`);

      return res.status(200).json(pages);
    } catch (err) {
      continue;
    }
  }

  return res.status(200).json([]);
}
