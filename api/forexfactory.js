// api/forexfactory.js
// Vercel serverless function — proxies the current-week Forex Factory XML feed.

export const config = { maxDuration: 20 };

const FEED_URL = 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml';

export default async function handler(req, res) {
  try {
    const upstream = await fetch(FEED_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MyTradeApp/1.0)',
        Accept: 'text/xml, application/xml, text/plain, */*',
      },
    });

    if (!upstream.ok) {
      res.status(upstream.status).send(`Upstream returned ${upstream.status}`);
      return;
    }

    const xml = await upstream.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

    res.status(200).send(xml);
  } catch (err) {
    res.status(502).send(`Proxy error: ${err.message}`);
  }
}