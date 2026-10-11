// api/forexfactory-range.js
// Vercel serverless function — fetches Forex Factory calendar HTML
// for any date range and returns parsed JSON events.

const FF_BASE = 'https://www.forexfactory.com/calendar';

/* ---------- impact detection from FF's HTML classes ---------- */
const detectImpact = (html) => {
  if (/icon--ff-impact-red/.test(html)) return 'High';
  if (/icon--ff-impact-ora/.test(html)) return 'Medium';
  if (/icon--ff-impact-yel/.test(html)) return 'Low';
  if (/icon--ff-impact-gra/.test(html)) return 'Holiday';
  return 'Low';
};

/* ---------- strip HTML tags and decode common entities ---------- */
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

/* ---------- parse a single day's HTML ---------- */
const parseDay = (html, dateLabel) => {
  const events = [];
  // Each event row has class "calendar__row"
  const rowRegex = /<tr[^>]*class="[^"]*calendar__row[^"]*"[^>]*>([\s\S]*?)<\/tr>/g;
  let m;

  while ((m = rowRegex.exec(html)) !== null) {
    const rowHtml = m[1];

    // Skip spacer / date-only rows
    if (!/calendar__event/.test(rowHtml)) continue;

    const cell = (cls) => {
      const re = new RegExp(`<td[^>]*class="[^"]*${cls}[^"]*"[^>]*>([\\s\\S]*?)<\\/td>`);
      const match = rowHtml.match(re);
      return match ? match[1] : '';
    };

    const time = strip(cell('calendar__time'));
    const currency = strip(cell('calendar__currency'));
    const event = strip(cell('calendar__event'));
    const actual = strip(cell('calendar__actual'));
    const forecast = strip(cell('calendar__forecast'));
    const previous = strip(cell('calendar__previous'));
    const impact = detectImpact(rowHtml);

    // Skip if no title
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

/* ---------- fetch one day's calendar page ---------- */
const fetchDay = async (date) => {
  // Format: apr3.2023
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const m = months[date.getMonth()];
  const d = date.getDate();
  const y = date.getFullYear();
  const url = `${FF_BASE}?day=${m}${d}.${y}`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; MyTradeApp/1.0)',
      Accept: 'text/html,application/xhtml+xml',
    },
  });
  if (!res.ok) return [];
  const html = await res.text();

  const label = date.toISOString().slice(0, 10);
  return parseDay(html, label);
};

export default async function handler(req, res) {
  try {
    const { start, end } = req.query;
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

    // Cap at 90 days to stay within FF's rate limits
    const days = Math.min(
      Math.ceil((endDate - startDate) / 86400000) + 1,
      90
    );

    // Fetch all days in parallel (batched to avoid hammering FF)
    const dates = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setUTCDate(d.getUTCDate() + i);
      dates.push(d);
    }

    const results = [];
    const batchSize = 5;
    for (let i = 0; i < dates.length; i += batchSize) {
      const batch = dates.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(fetchDay));
      results.push(...batchResults.flat());
      // Small delay between batches to be polite
      if (i + batchSize < dates.length) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600'
    );
    res.status(200).json({ events: results });
  } catch (err) {
    res.status(502).json({ error: `Proxy error: ${err.message}` });
  }
}