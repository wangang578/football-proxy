const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.text());

// 竞彩数据
async function handleSporttery(req, res) {
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

app.get('/', handleSporttery);
app.get('/sporttery', handleSporttery);

// DeepSeek AI
app.post('/deepseek', async (req, res) => {
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
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
