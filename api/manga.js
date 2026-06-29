import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; // Receives the unique slug string
  if (!url) return res.status(400).json({ error: 'Manga identifier missing' });

  try {
    const { data } = await axios.get(`https://api.comick.io/comic/${url}/chapters?lang=en`);
    
    const chapters = data.chapters.map(chap => ({
      name: chap.chap ? `Chapter ${chap.chap}${chap.title ? ': ' + chap.title : ''}` : 'Special Chapter',
      url: chap.hid // Emits the unique layout ID required to unpack pages
    }));

    return res.status(200).json(chapters);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch chapters' });
  }
}
