export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const poolCode = req.query.poolCode || 'hhad,had,crs,ttg,hafu';
  const date = req.query.date || '';
  const target = `https://webapi.sporttery.cn/gateway/uniform/football/getMatchCalculatorV1.qry?poolCode=${poolCode}&channel=c${date ? '&date=' + date : ''}`;
  
  try {
    const resp = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Referer': 'https://m.sporttery.cn/',
        'Accept': 'application/json, text/plain, */*'
      }
    });
    const body = await resp.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(resp.status).send(body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
