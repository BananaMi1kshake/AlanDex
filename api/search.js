import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { q } = req.query;
  if (!q) return res.status(200).json({ status: "Missing search keyword" });

  try {
    const response = await axios.get(`https://api.comick.fun/v1.0/search?q=${encodeURIComponent(q)}&limit=20`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://comick.fun/'
      },
      timeout: 5000
    });
    
    // If successful, show us the structure of the data returning from ComicK
    return res.status(200).json({
      status: "Connection Successful",
      dataType: typeof response.data,
      isArray: Array.isArray(response.data),
      rawData: response.data
    });

  } catch (err) {
    // If it fails, capture the exact blocking signature and pass it to the frontend
    return res.status(200).json({
      status: "Connection Failed",
      errorMessage: err.message,
      errorCode: err.code,
      httpStatus: err.response?.status || "No HTTP Status Available",
      cloudflareBlock: err.message.includes('403') || err.response?.status === 403
    });
  }
}
