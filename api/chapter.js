import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; // Receives the chapter unique identifier (hid)
  if (!url) return res.status(400).json({ error: 'Chapter identifier missing' });

  try {
    const { data } = await axios.get(`https://api.comick.io/chapter/${url}`);
    
    // Formulates the complete direct image URLs for the reading panel
    const pages = data.chapter.images.map(img => `https://meo.comick.pictures/${img.b2c}`);

    return res.status(200).json(pages);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch chapter pages' });
  }
}
