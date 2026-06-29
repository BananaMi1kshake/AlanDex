import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  const { url } = req.query; // Receives the comic's unique HID token
  if (!url) return res.status(200).json([]);

  try {
    const response = await axios.get(`https://api.comick.fun/comic/${url}/chapters?lang=en&limit=100`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://comick.fun/'
      },
      timeout: 4000
    });
    
    const chaptersData = response.data?.chapters || [];
    const chapters = chaptersData.map(chap => ({
      name: chap.chap ? `Chapter ${chap.chap}${chap.title ? ': ' + chap.title : ''}` : 'Special Chapter',
      url: chap.hid // Emits individual chapter identifiers
    }));

    return res.status(200).json(chapters);
  } catch (err) {
    return res.status(200).json([]);
  }
}
