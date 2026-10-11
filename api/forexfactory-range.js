// api/forexfactory-range.js
// Vercel serverless function — fetches Forex Factory calendar HTML
// for any date range and returns parsed JSON events.
// Add ?debug=1 to inspect the raw response.

const FF_BASE = 'https://www.forexfactory.com/calendar';

/* ---------- impact detection ---------- */
const detectImpact = (html) => {
  if (/icon--ff-impact-red/.test(html)) return 'High';
  if (/icon--ff-impact-ora/.test(html)) return 'Medium';
  if (/icon--ff-impact-yel/.test(html)) return 'Low';
  if (/icon--ff-impact-gra/.test(html)) return 'Holiday';
  return 'Low';
};

/* ---------- HTML helpers ---------- */
const strip = (s) =>
  String(s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

/* ---------- Parse the FF calendar HTML into event objects ----------
   Tries multiple row-class variants because FF has used both
   `calendar__row` and `calendar_row` at different times.
   Each event row is identified by presence of `calendar__event`. */
const parseHtml = (html, dateLabel) => {
  const events = [];

  // Grab every <tr> that contains a calendar__event cell
  const rowRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;

  while ((match = rowRegex.exec(html)) !== null) {
    const rowHtml = match[1];
    if (!/calendar__event\b/.test(rowHtml)) continue;

    const cell = (cls) => {
      // Match a td whose class list contains the given class name
      const re = new RegExp(
        `<td[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/td>`,
        'i'
      );
      const m = rowHtml.match(re);
      return m ? m[1] : '';
    };

    const time = strip(cell('calendar__time'));
    const currency = strip(cell('calendar__currency'));
    const event = strip(cell('calendar__event'));
    const actual = strip(cell('calendar__actual'));
    const forecast = strip(cell('calendar__forecast'));
    const previous = strip(cell('calendar__previous'));
    const impact = detectImpact(rowHtml);

    if (!event) continue;

    events.push({
      id: `${dateLabel}-${time}-${currency}-${event}`.replace(/\s+/g, '-'),
      date: dateLabel,
      time: time || 'All Day',
      currency,
      event,
      actual,
      forecast,
      previous,
      impact,
    });
  }

  return events;
};

/* ---------- Build the FF day URL ----------
   FF uses ?day=monDD.YYYY (e.g. apr3.2025). We try several
   variants and return the first non-empty result. */
const buildDayUrls = (date) => {
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const mon = months[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();
  const iso = `${y}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  return [
    `${FF_BASE}?day=${mon}${d}.${y}`,      // apr3.2025
    `${FF_BASE}?day=${mon}${String(d).padStart(2, '0')}.${y}`, // apr03.2025
    `${FF_BASE}?day=${iso}`,                // 2025-04-03
  ];
};

const fetchText = async (url) => {
  const res = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
};

const fetchDay = async (date) => {
  const urls = buildDayUrls(date);
  const label = date.toISOString().slice(0, 10);

  for (const url of urls) {
    try {
      const html = await fetchText(url);
      const events = parseHtml(html, label);
      if (events.length > 0) return events;
    } catch (e) {
      // try next URL
    }
  }
  return [];
};

/* ---------- Handler ---------- */
export default async function handler(req, res) {
  try {
    const { start, end, debug } = req.query;

    if (!start || !end) {
      res.status(400).json({ error: 'Missing start or end query parameter' });
      return;
    }

    const startDate = new Date(start + 'T00:00:00Z');
    const endDate = new Date(end + 'T00:00:00Z');

    if (isNaN(startDate) || isNaN(endDate) || startDate > endDate) {
      res.status(400).json({ error: 'Invalid date range' });
      return;
    }

    /* ---------- DEBUG MODE ----------
       Visit /api/forexfactory-range?start=YYYY-MM-DD&end=YYYY-MM-DD&debug=1
       to see what FF actually returned. */
    if (debug === '1') {
      const sample = buildDayUrls(startDate)[0];
      let info = { url: sample };
      try {
        const html = await fetchText(sample);
        info.status = 'ok';
        info.length = html.length;
        info.first600 = html.slice(0, 600);
        info.hasCalendarRow = /calendar__row/i.test(html);
        info.hasCalendarEvent = /calendar__event/i.test(html);
        info.hasCloudflare = /cloudflare|cf-browser|Just a moment/i.test(html);
        info.hasTable = /<table/i.test(html);
        info.rowCount = (html.match(/calendar__row/gi) || []).length;
        info.eventCellCount = (html.match(/calendar__event/gi) || []).length;
        info.parsedEvents = parseHtml(html, 'debug').slice(0, 3);
      } catch (e) {
        info.status = 'error';
        info.error = e.message;
      }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.status(200).json(info);
      return;
    }

    /* ---------- Normal range mode ---------- */
    const days = Math.min(
      Math.ceil((endDate - startDate) / 86400000) + 1,
      90
    );

    const dates = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setUTCDate(d.getUTCDate() + i);
      dates.push(d);
    }

    // Dedupe key — the same event may appear on multiple day URLs
    const seen = new Set();
    const events = [];

    const batchSize = 4;
    for (let i = 0; i < dates.length; i += batchSize) {
      const batch = dates.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(fetchDay));
      for (const dayEvents of results) {
        for (const ev of dayEvents) {
          const key = `${ev.date}|${ev.time}|${ev.currency}|${ev.event}`;
          if (seen.has(key)) continue;
          seen.add(key);
          events.push(ev);
        }
      }
      if (i + batchSize < dates.length) {
        await new Promise((r) => setTimeout(r, 150));
      }
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );
    res.status(200).json({ events, count: events.length });
  } catch (err) {
    res.status(502).json({ error: `Proxy error: ${err.message}` });
  }
}