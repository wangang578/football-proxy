export async function onRequest(context) {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json; charset=utf-8'
  };
  if (context.request.method === 'OPTIONS') return new Response(null, { headers: cors });

  const { searchParams } = new URL(context.request.url);
  const poolCode = searchParams.get('poolCode') || 'hhad,had,crs,ttg,hafu';
  const date = searchParams.get('date') || '';
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
    return new Response(body, { status: resp.status, headers: cors });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: cors });
  }
}
