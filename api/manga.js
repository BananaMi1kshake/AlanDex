import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query; 
  if (!url) return res.status(400).json([]);

  try {
    const response = await axios.get(`https://api.comick.io/comic/${url}/chapters?lang=en&limit=100`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://comick.io/'
      }
    });
    
    const data = response.data;
    const chaptersData = data.chapters || [];

    const chapters = chaptersData.map(chap => ({
      name: chap.chap ? `Chapter ${chap.chap}${chap.title ? ': ' + chap.title : ''}` : 'Special Chapter',
      url: chap.hid 
    }));

    return res.status(200).json(chapters);
  } catch (err) {
    return res.status(200).json([]);
  }
}
