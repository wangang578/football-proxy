export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'DEEPSEEK_API_KEY 未配置' });
  
  try {
    const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    const resp = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body
    });
    const respBody = await resp.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(resp.status).send(respBody);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
