import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  const { url } = req.query; // Receives the selected chapter's HID token
  if (!url) return res.status(200).json([]);

  try {
    const response = await axios.get(`https://api.comick.fun/chapter/${url}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://comick.fun/'
      },
      timeout: 4000
    });
    
    const images = response.data?.chapter?.md_images || [];
    const pages = images.map(img => `https://meo.comick.pictures/${img.b2key}`);

    return res.status(200).json(pages);
  } catch (err) {
    return res.status(200).json([]);
  }
}
