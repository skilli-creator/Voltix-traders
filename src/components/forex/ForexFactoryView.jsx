// src/components/forex/ForexFactoryView.jsx
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';

/* ============================================================
   FOREX FACTORY — ECONOMIC CALENDAR VIEW (v5)
   ============================================================
   Data comes from /api/forexfactory-range, which merges the
   three public Forex Factory weekly XML feeds and filters to
   the requested week.

   Three duration tabs: Last Week · This Week · Next Week
   ============================================================ */

const FOREX_FACTORY_URL = 'https://www.forexfactory.com/calendar';
const IMPACT_ORDER = { High: 0, Medium: 1, Low: 2, Holiday: 3 };

/* ---------- impact helpers ---------- */
const impactMeta = (impact, c) => {
  switch (String(impact || '').toLowerCase()) {
    case 'high':    return { color: c.danger  || '#ef4444', label: 'High' };
    case 'medium':  return { color: c.warning || '#f59e0b', label: 'Medium' };
    case 'low':     return { color: c.success || '#eab308', label: 'Low' };
    case 'holiday': return { color: c.textMuted || '#94a3b8', label: 'Holiday' };
    default:        return { color: c.textMuted || '#94a3b8', label: '—' };
  }
};

/* ---------- date helpers ---------- */
const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const formatDayLong = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
};

const formatDayShort = (iso) => {
  const d = new Date(iso + 'T00:00:00');
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`;
};

/* ---------- week ranges ----------
   Sunday-start weeks, matching Forex Factory's own convention.
   Handles month/year boundaries automatically via Date rollover. */
const startOfWeek = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - x.getDay());
  return x;
};

const computeRange = (preset) => {
  const today = new Date();
  const thisSunday = startOfWeek(today);

  let sunday;
  if (preset === 'lastWeek') {
    sunday = new Date(thisSunday); sunday.setDate(sunday.getDate() - 7);
  } else if (preset === 'nextWeek') {
    sunday = new Date(thisSunday); sunday.setDate(sunday.getDate() + 7);
  } else {
    sunday = thisSunday;
  }

  const saturday = new Date(sunday);
  saturday.setDate(saturday.getDate() + 6);

  return { start: toISO(sunday), end: toISO(saturday) };
};

/* ---------- fetch ---------- */
const fetchRange = async (start, end) => {
  const url = `/api/forexfactory-range?start=${start}&end=${end}`;
  const res = await fetch(url, { method: 'GET', mode: 'cors' });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}${body ? ' — ' + body.slice(0, 120) : ''}`);
  }
  const json = await res.json();
  if (!json || !Array.isArray(json.events)) {
    throw new Error('Malformed response from server proxy');
  }
  return json.events;
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function ForexFactoryView() {
  const theme = useTheme();
  const c = theme?.colors || {};

  const [preset, setPreset] = useState('thisWeek');
  const [range, setRange] = useState(() => computeRange('thisWeek'));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [impactFilter, setImpactFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');

  /* Update the range whenever the preset changes */
  useEffect(() => {
    setRange(computeRange(preset));
  }, [preset]);

  /* Reset the currency filter whenever the week changes, so it
     never gets stuck on a currency that doesn't exist in the
     new range. */
  useEffect(() => {
    setCurrencyFilter('all');
  }, [preset]);

  /* Load events for the current range */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const ev = await fetchRange(range.start, range.end);
        if (!cancelled) setEvents(ev);
      } catch (err) {
        if (!cancelled) setError(err?.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [range.start, range.end]);

  /* Currency list, derived from the loaded events */
  const currencies = useMemo(() => {
    const set = new Set();
    for (const ev of events) {
      if (ev.currency) set.add(ev.currency);
    }
    return ['all', ...Array.from(set).sort()];
  }, [events]);

  /* Filtered + sorted events */
  const filtered = useMemo(() => {
    return events
      .filter((e) => impactFilter === 'all' || e.impact === impactFilter)
      .filter((e) => currencyFilter === 'all' || e.currency === currencyFilter)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date < b.date ? -1 : 1;
        const ta = a.time === 'All Day' ? '00:00' : a.time;
        const tb = b.time === 'All Day' ? '00:00' : b.time;
        if (ta !== tb) return ta < tb ? -1 : 1;
        return (IMPACT_ORDER[a.impact] ?? 99) - (IMPACT_ORDER[b.impact] ?? 99);
      });
  }, [events, impactFilter, currencyFilter]);

  /* Group by day */
  const grouped = useMemo(() => {
    const map = new Map();
    for (const ev of filtered) {
      if (!map.has(ev.date)) map.set(ev.date, []);
      map.get(ev.date).push(ev);
    }
    return Array.from(map.entries());
  }, [filtered]);

  /* Style tokens */
  const bg = c.bg || '#0b0a08';
  const surface = c.surfaceElevated || c.surface || '#141310';
  const border = c.border || 'rgba(255,255,255,0.08)';
  const borderSoft = c.borderMuted || 'rgba(255,255,255,0.04)';
  const text = c.text || '#f4f4f5';
  const textMuted = c.textMuted || '#94a3b8';
  const textSecondary = c.textSecondary || '#cbd5e1';
  const accent = c.accent || '#3b82f6';
  const danger = c.danger || '#ef4444';

  const openLive = () => {
    window.open(FOREX_FACTORY_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        width: '100%',
        minHeight: 'calc(100vh - 76px)',
        background: bg,
        color: text,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <style>{`
        .ff-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .ff-scroll::-webkit-scrollbar-thumb { background: ${textMuted}40; border-radius: 10px; }
        .ff-scroll::-webkit-scrollbar-track { background: transparent; }
        @keyframes ff-spin { to { transform: rotate(360deg); } }
        .ff-row:hover { background: ${accent}0a !important; }
      `}</style>

      {/* ===================== TOOLBAR ===================== */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 10,
          padding: '12px 20px',
          borderBottom: `1px solid ${border}`,
          background: surface,
          flexShrink: 0,
        }}
      >
        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 8, minWidth: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: '-0.2px', color: text }}>
            Economic Calendar
          </span>
          <span style={{ fontSize: 10.5, fontWeight: 500, color: textMuted, marginTop: 1 }}>
            {formatDayShort(range.start)} – {formatDayShort(range.end)}
          </span>
        </div>

        {/* Three duration tabs */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { key: 'lastWeek', label: 'Last Week' },
            { key: 'thisWeek', label: 'This Week' },
            { key: 'nextWeek', label: 'Next Week' },
          ].map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              style={{
                padding: '7px 15px',
                borderRadius: 8,
                border: `1px solid ${preset === p.key ? accent + '66' : border}`,
                background: preset === p.key ? `${accent}18` : 'transparent',
                color: preset === p.key ? accent : textMuted,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <span style={{ flex: 1 }} />

        {/* Impact filter */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'High', label: 'High' },
            { key: 'Medium', label: 'Med' },
            { key: 'Low', label: 'Low' },
          ].map((f) => {
            const active = impactFilter === f.key;
            const meta = f.key !== 'all' ? impactMeta(f.key, c) : { color: accent };
            return (
              <button
                key={f.key}
                onClick={() => setImpactFilter(f.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 11px',
                  borderRadius: 7,
                  border: `1px solid ${active ? meta.color + '66' : border}`,
                  background: active ? `${meta.color}18` : 'transparent',
                  color: active ? meta.color : textMuted,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                }}
              >
                {f.key !== 'all' && (
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 2,
                      background: meta.color,
                      boxShadow: `0 0 5px ${meta.color}`,
                    }}
                  />
                )}
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Currency filter */}
        <select
          value={currencyFilter}
          onChange={(e) => setCurrencyFilter(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: 7,
            border: `1px solid ${currencyFilter !== 'all' ? accent + '66' : border}`,
            background: currencyFilter !== 'all' ? `${accent}14` : surface,
            color: currencyFilter !== 'all' ? accent : text,
            fontSize: 11.5,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            outline: 'none',
            minWidth: 110,
          }}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur === 'all' ? 'All currencies' : cur}
            </option>
          ))}
        </select>

        {/* Live button */}
        <button
          onClick={openLive}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 13px',
            borderRadius: 7,
            border: `1px solid ${accent}55`,
            background: `${accent}14`,
            color: accent,
            fontSize: 11.5,
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Live
        </button>
      </div>

      {/* ===================== TABLE HEADER ===================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '90px 70px 1fr 1fr 1fr 1fr',
          gap: 0,
          padding: '0 20px',
          background: surface,
          borderBottom: `1px solid ${border}`,
          fontSize: 10,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          color: textMuted,
          flexShrink: 0,
        }}
      >
        <div style={headerCell(borderSoft)}>Time</div>
        <div style={headerCell(borderSoft)}>Currency</div>
        <div style={headerCell(borderSoft)}>Event</div>
        <div style={{ ...headerCell(borderSoft), textAlign: 'right' }}>Actual</div>
        <div style={{ ...headerCell(borderSoft), textAlign: 'right' }}>Forecast</div>
        <div style={{ ...headerCell(borderSoft), textAlign: 'right' }}>Previous</div>
      </div>

      {/* ===================== BODY ===================== */}
      <div className="ff-scroll" style={{ flex: 1, overflowY: 'auto', background: bg }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', color: textMuted, gap: 12 }}>
            <div style={{ width: 26, height: 26, border: `3px solid ${border}`, borderTopColor: accent, borderRadius: '50%', animation: 'ff-spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4 }}>Loading calendar…</span>
          </div>
        )}

        {!loading && error && (
          <div style={{ padding: '28px 24px', borderRadius: 14, border: `1px solid ${danger}44`, background: `${danger}12`, color: text, maxWidth: 620, margin: '40px auto', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>Calendar unavailable</div>
            <div style={{ fontSize: 12, color: textMuted, lineHeight: 1.6, wordBreak: 'break-word' }}>{error}</div>
            <button onClick={openLive} style={{ marginTop: 18, padding: '9px 18px', borderRadius: 9, border: `1px solid ${accent}55`, background: `${accent}18`, color: accent, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              Open Forex Factory Calendar
            </button>
          </div>
        )}

        {!loading && !error && grouped.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: textMuted, fontSize: 12.5, fontWeight: 600 }}>
            <div style={{ marginBottom: 8 }}>
              {events.length === 0
                ? 'No events found for this week.'
                : 'No events match your filters.'}
            </div>
            {(impactFilter !== 'all' || currencyFilter !== 'all') && (
              <button
                onClick={() => { setImpactFilter('all'); setCurrencyFilter('all'); }}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  border: `1px solid ${accent}55`,
                  background: `${accent}14`,
                  color: accent,
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && grouped.map(([dateKey, dayEvents]) => (
          <div key={dateKey}>
            {/* Day header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 20px',
                background: `${accent}0d`,
                borderTop: `1px solid ${border}`,
                borderBottom: `1px solid ${borderSoft}`,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 800, color: accent, letterSpacing: 0.3 }}>
                {formatDayLong(dateKey)}
              </span>
              <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}55, transparent)` }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: textMuted }}>
                {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Event rows */}
            {dayEvents.map((ev) => {
              const meta = impactMeta(ev.impact, c);
              const isHigh = ev.impact === 'High';
              const isAllDay = ev.time === 'All Day';

              return (
                <div
                  key={ev.id}
                  className="ff-row"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '90px 70px 1fr 1fr 1fr 1fr',
                    alignItems: 'center',
                    padding: '8px 20px',
                    borderBottom: `1px solid ${borderSoft}`,
                    background: isHigh ? `${meta.color}06` : 'transparent',
                    transition: 'background 0.15s ease',
                    fontSize: 12.5,
                  }}
                >
                  {/* Time */}
                  <div style={{
                    color: isAllDay ? textMuted : textSecondary,
                    fontWeight: isAllDay ? 500 : 700,
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: isAllDay ? 11 : 12,
                  }}>
                    {ev.time}
                  </div>

                  {/* Currency + impact square */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: meta.color,
                      boxShadow: `0 0 5px ${meta.color}`,
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: 0.4,
                      color: text,
                    }}>
                      {ev.currency || '—'}
                    </span>
                  </div>

                  {/* Event title */}
                  <div style={{
                    color: text,
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    paddingRight: 10,
                  }}>
                    {ev.event}
                  </div>

                  {/* Actual */}
                  <div style={{
                    textAlign: 'right',
                    fontWeight: 800,
                    color: ev.actual ? meta.color : textMuted,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {ev.actual || '—'}
                  </div>

                  {/* Forecast */}
                  <div style={{
                    textAlign: 'right',
                    color: textSecondary,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {ev.forecast || '—'}
                  </div>

                  {/* Previous */}
                  <div style={{
                    textAlign: 'right',
                    color: textMuted,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {ev.previous || '—'}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */
const headerCell = (borderSoft) => ({
  padding: '9px 0',
  borderRight: `1px solid ${borderSoft}`,
  textAlign: 'left',
});