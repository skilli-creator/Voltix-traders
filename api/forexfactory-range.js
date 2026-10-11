// api/forexfactory-range.js
export const config = { maxDuration: 60 };

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
    .replace(/\s+/g, ' ')
    .trim();

const parseHtml = (html, dateLabel) => {
  const events = [];
  if (!html || typeof html !== 'string') return events;

  const rowRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const rowHtml = match[1];
    if (!/calendar__event\b/.test(rowHtml)) continue;

    const cell = (cls) => {
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

/* ---------- URL + fetch ---------- */
const buildDayUrl = (date) => {
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const mon = months[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();
  return `${FF_BASE}?day=${mon}${d}.${y}`;
};

const fetchText = async (url) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
};

const fetchDay = async (date) => {
  const url = buildDayUrl(date);
  const label = date.toISOString().slice(0, 10);
  try {
    const html = await fetchText(url);
    return parseHtml(html, label);
  } catch (e) {
    return [];
  }
};

/* ---------- Handler ---------- */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const { start, end, debug, ping } = req.query || {};

    /* ---------- ping: verify deployment ---------- */
    if (ping === '1') {
      res.status(200).json({
        ok: true,
        version: 'v3-2025-10-11',
        node: process.version,
        fetchAvailable: typeof fetch === 'function',
        now: new Date().toISOString(),
      });
      return;
    }

    if (!start || !end) {
      res.status(400).json({ events: [], error: 'Missing start or end' });
      return;
    }

    const startDate = new Date(start + 'T00:00:00Z');
    const endDate = new Date(end + 'T00:00:00Z');

    if (
      isNaN(startDate.getTime()) ||
      isNaN(endDate.getTime()) ||
      startDate > endDate
    ) {
      res.status(400).json({ events: [], error: 'Invalid date range' });
      return;
    }

    /* ---------- debug: inspect a single day ---------- */
    if (debug === '1') {
      const url = buildDayUrl(startDate);
      let info = { url, version: 'v3-2025-10-11' };
      try {
        const html = await fetchText(url);
        info.status = 'ok';
        info.length = html.length;
        info.first400 = html.slice(0, 400);
        info.hasCalendarRow = /calendar__row/i.test(html);
        info.hasCalendarEvent = /calendar__event/i.test(html);
        info.hasCloudflare = /cloudflare|cf-browser|Just a moment/i.test(html);
        info.rowCount = (html.match(/calendar__row/gi) || []).length;
        info.eventCellCount = (html.match(/calendar__event/gi) || []).length;
        info.parsedEvents = parseHtml(html, 'debug').slice(0, 3);
      } catch (e) {
        info.status = 'error';
        info.error = String(e?.message || e);
      }
      res.status(200).json(info);
      return;
    }

    /* ---------- normal range: parallel fetch, no delays ---------- */
    const days = Math.min(
      Math.ceil((endDate - startDate) / 86400000) + 1,
      60
    );

    const dates = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setUTCDate(d.getUTCDate() + i);
      dates.push(d);
    }

    // Fetch all days in parallel — much faster, avoids timeouts
    const results = await Promise.all(dates.map(fetchDay));

    const seen = new Set();
    const events = [];
    for (const dayEvents of results) {
      for (const ev of dayEvents) {
        const key = `${ev.date}|${ev.time}|${ev.currency}|${ev.event}`;
        if (seen.has(key)) continue;
        seen.add(key);
        events.push(ev);
      }
    }

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );
    res.status(200).json({ events, count: events.length, version: 'v3-2025-10-11' });
  } catch (err) {
    // Any uncaught error returns JSON, never a 500
    res.status(200).json({
      events: [],
      error: String(err?.message || err),
      stack: String(err?.stack || ''),
      version: 'v3-2025-10-11',
    });
  }
}