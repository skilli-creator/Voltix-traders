// api/forexfactory-range.js
// Vercel serverless function — returns the three Forex Factory weekly
// XML feeds as separate JSON arrays. No date filtering — the feed itself
// is authoritative for "last week", "this week", and "next week".

export const config = { maxDuration: 30 };

const FEEDS = {
  last: 'https://nfs.faireconomy.media/ff_calendar_lastweek.xml',
  this: 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml',
  next: 'https://nfs.faireconomy.media/ff_calendar_nextweek.xml',
};

/* ---------- fetch with timeout ---------- */
const fetchFeed = async (url) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MyTradeApp/1.0)',
        Accept: 'text/xml, application/xml, text/plain, */*',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
};

const fetchFeedSafe = async (url) => {
  try {
    return await fetchFeed(url);
  } catch {
    return '';
  }
};

/* ---------- parse XML ---------- */
const parseEvents = (xml, source) => {
  const events = [];
  if (!xml || typeof xml !== 'string') return events;

  const eventRegex = /<event>([\s\S]*?)<\/event>/g;
  let match;

  while ((match = eventRegex.exec(xml)) !== null) {
    const block = match[1];

    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'i'));
      if (!m) return '';
      return m[1]
        .replace(/<!\[CDATA\[|\]\]>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, ' ')
        .trim();
    };

    const rawDate = get('date'); // MM-DD-YYYY
    if (!rawDate) continue;

    const parts = rawDate.split('-');
    if (parts.length !== 3) continue;
    const [mm, dd, yyyy] = parts;
    const isoDate = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;

    const title = get('title');
    if (!title) continue;

    events.push({
      id: `${isoDate}-${get('time')}-${get('currency')}-${title}`.replace(/\s+/g, '-'),
      date: isoDate,
      time: get('time') || 'All Day',
      currency: get('currency') || '',
      country: get('country'),
      event: title,
      actual: get('actual'),
      forecast: get('forecast'),
      previous: get('previous'),
      impact: get('impact') || 'Low',
      source,
    });
  }

  /* Sort by date then time */
  events.sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? -1 : 1;
    const ta = a.time === 'All Day' ? '00:00' : a.time;
    const tb = b.time === 'All Day' ? '00:00' : b.time;
    return ta < tb ? -1 : ta > tb ? 1 : 0;
  });

  return events;
};

/* ---------- handler ---------- */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const { ping, debug } = req.query || {};

    if (ping === '1') {
      res.status(200).json({ ok: true, version: 'v6-2025-10-11' });
      return;
    }

    /* Debug: per-feed diagnostics */
    if (debug === '1') {
      const diagnostics = {};
      for (const [key, url] of Object.entries(FEEDS)) {
        const xml = await fetchFeedSafe(url);
        const parsed = parseEvents(xml, key);
        diagnostics[key] = {
          url,
          ok: xml.length > 0,
          bytes: xml.length,
          events: parsed.length,
          firstEventDate: parsed[0]?.date || null,
          lastEventDate: parsed[parsed.length - 1]?.date || null,
        };
      }
      res.status(200).json({ version: 'v6-2025-10-11', diagnostics });
      return;
    }

    /* Normal: fetch all 3 feeds in parallel, return separately */
    const [lastXml, thisXml, nextXml] = await Promise.all([
      fetchFeedSafe(FEEDS.last),
      fetchFeedSafe(FEEDS.this),
      fetchFeedSafe(FEEDS.next),
    ]);

    const last = parseEvents(lastXml, 'last');
    const thisWeek = parseEvents(thisXml, 'this');
    const next = parseEvents(nextXml, 'next');

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.status(200).json({
      last,
      this: thisWeek,
      next,
      counts: { last: last.length, this: thisWeek.length, next: next.length },
      version: 'v6-2025-10-11',
    });
  } catch (err) {
    res.status(200).json({
      last: [],
      this: [],
      next: [],
      error: String(err?.message || err),
      version: 'v6-2025-10-11',
    });
  }
}