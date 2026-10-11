// api/forexfactory-range.js
// Vercel serverless function — returns Forex Factory events for a date range.
//
// Forex Factory publishes three public XML feeds:
//   • ff_calendar_lastweek.xml
//   • ff_calendar_thisweek.xml
//   • ff_calendar_nextweek.xml
//
// We fetch all three, merge them, and filter to the requested range.
// This covers a rolling ~3-week window with no scraping and no 403s.

export const config = { maxDuration: 30 };

const FEEDS = {
  last: 'https://nfs.faireconomy.media/ff_calendar_lastweek.xml',
  this: 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml',
  next: 'https://nfs.faireconomy.media/ff_calendar_nextweek.xml',
};

/* ---------- fetch ---------- */
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

/* ---------- parse XML ---------- */
/* FF feed format: <weeklyevents><event><title>..</title>...
   Date format is "MM-DD-YYYY" in the <date> tag. */
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

    const impact = get('impact') || 'Low';
    const currency = get('currency') || '';
    const time = get('time') || 'All Day';
    const actual = get('actual');
    const forecast = get('forecast');
    const previous = get('previous');
    const country = get('country');

    events.push({
      id: `${isoDate}-${time}-${currency}-${title}`.replace(/\s+/g, '-'),
      date: isoDate,
      time,
      currency,
      country,
      event: title,
      actual,
      forecast,
      previous,
      impact,
      source,
    });
  }

  return events;
};

/* ---------- handler ---------- */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const { start, end, debug, ping } = req.query || {};

    if (ping === '1') {
      res.status(200).json({
        ok: true,
        version: 'v4-2025-10-11',
        node: process.version,
        feeds: Object.keys(FEEDS),
      });
      return;
    }

    if (!start || !end) {
      res.status(400).json({ events: [], error: 'Missing start or end' });
      return;
    }

    const startDate = new Date(start + 'T00:00:00Z');
    const endDate = new Date(end + 'T00:00:00Z');

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) {
      res.status(400).json({ events: [], error: 'Invalid date range' });
      return;
    }

    /* ---------- debug: inspect one feed ---------- */
    if (debug === '1') {
      const results = {};
      for (const [key, url] of Object.entries(FEEDS)) {
        try {
          const xml = await fetchFeed(url);
          const parsed = parseEvents(xml, key);
          results[key] = {
            url,
            ok: true,
            bytes: xml.length,
            parsedEvents: parsed.length,
            sample: parsed.slice(0, 2),
          };
        } catch (e) {
          results[key] = { url, ok: false, error: String(e?.message || e) };
        }
      }
      res.status(200).json({ version: 'v4-2025-10-11', results });
      return;
    }

    /* ---------- normal: fetch all 3 feeds in parallel ---------- */
    const feedResults = await Promise.allSettled(
      Object.entries(FEEDS).map(async ([key, url]) => {
        const xml = await fetchFeed(url);
        return parseEvents(xml, key);
      })
    );

    const seen = new Set();
    const allEvents = [];

    for (const r of feedResults) {
      if (r.status !== 'fulfilled') continue;
      for (const ev of r.value) {
        const key = `${ev.date}|${ev.time}|${ev.currency}|${ev.event}`;
        if (seen.has(key)) continue;
        seen.add(key);
        allEvents.push(ev);
      }
    }

    /* ---------- filter to requested range ---------- */
    const startISO = start;
    const endISO = end;

    const events = allEvents
      .filter((ev) => ev.date >= startISO && ev.date <= endISO)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        const ta = a.time === 'All Day' ? '00:00' : a.time;
        const tb = b.time === 'All Day' ? '00:00' : b.time;
        return ta < tb ? -1 : ta > tb ? 1 : 0;
      });

    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    res.status(200).json({
      events,
      count: events.length,
      totalParsed: allEvents.length,
      range: { start: startISO, end: endISO },
      version: 'v4-2025-10-11',
    });
  } catch (err) {
    res.status(200).json({
      events: [],
      error: String(err?.message || err),
      version: 'v4-2025-10-11',
    });
  }
}