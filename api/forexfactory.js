// api/forexfactory.js
// Vercel serverless function — fetches the Forex Factory feed
// server-side (no CORS in play) and returns it to the browser
// with proper CORS headers + edge caching.

export default async function handler(req, res) {
  try {
    const upstream = await fetch(
      'https://nfs.faireconomy.media/ff_calendar_thisweek.xml',
      {
        headers: {
          // Some servers require a UA; FF doesn't strictly, but harmless
          'User-Agent': 'Mozilla/5.0 (compatible; MyTradeApp/1.0)',
          Accept: 'text/xml, application/xml, text/plain, */*',
        },
      }
    );

    if (!upstream.ok) {
      res.status(upstream.status).send(`Upstream returned ${upstream.status}`);
      return;
    }

    const xml = await upstream.text();

    // Allow your own site + any origin during development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');

    // Cache at Vercel's edge for 5 minutes, allow stale up to 10 min
    // while revalidating. This keeps FF requests well under their
    // 2-per-5-minute rate limit and makes the page load instantly.
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );

    res.status(200).send(xml);
  } catch (err) {
    res.status(502).send(`Proxy error: ${err.message}`);
  }
}