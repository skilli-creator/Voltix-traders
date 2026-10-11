// src/components/forex/ForexFactoryView.jsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTheme } from 'styled-components';

/* ============================================================
   ECONOMIC CALENDAR VIEW (FXMacroData API)
   ============================================================
   Forex Factory blocks server-side scraping (HTTP 403).
   This component uses FXMacroData, a free API for economic
   calendar data, as a reliable alternative.

   Free tier: USD data, no API key required.
   Upgrade: Set API_KEY below for all 18 currencies.
   ============================================================ */

const API_BASE = 'https://api.fxmacrodata.com/v1';
const API_KEY = null; // Set your key here for all currencies

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

/* ---------- range presets ---------- */
const computeRange = (preset) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfWeek = (d) => {
    const x = new Date(d);
    const day = x.getDay();
    x.setDate(x.getDate() - day);
    return x;
  };

  switch (preset) {
    case 'today':
      return { start: toISO(today), end: toISO(today) };
    case 'thisWeek': {
      const s = startOfWeek(today);
      const e = new Date(s); e.setDate(s.getDate() + 6);
      return { start: toISO(s), end: toISO(e) };
    }
    case 'nextWeek': {
      const s = startOfWeek(today); s.setDate(s.getDate() + 7);
      const e = new Date(s); e.setDate(s.getDate() + 6);
      return { start: toISO(s), end: toISO(e) };
    }
    case 'thisMonth': {
      const s = new Date(today.getFullYear(), today.getMonth(), 1);
      const e = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return { start: toISO(s), end: toISO(e) };
    }
    default:
      return { start: toISO(today), end: toISO(today) };
  }
};

/* ---------- fetch FXMacroData calendar ---------- */
const fetchCalendar = async (start, end) => {
  const params = new URLSearchParams({
    from: start,
    to: end,
  });
  if (API_KEY) params.set('api_key', API_KEY);

  const res = await fetch(`${API_BASE}/calendar?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`FXMacroData returned ${res.status}`);
  }
  const json = await res.json();

  // The API returns an array of records. We map them to our format.
  if (!Array.isArray(json)) {
    throw new Error('Unexpected API response format');
  }

  return json.map((r, i) => ({
    id: `fmd-${r.event_id || i}-${r.date || ''}`,
    date: (r.date || '').slice(0, 10),
    time: r.time || 'All Day',
    currency: (r.currency || '').toUpperCase(),
    event: r.title || r.event || 'Economic Event',
    actual: r.actual != null ? String(r.actual) : '',
    forecast: r.forecast != null ? String(r.forecast) : '',
    previous: r.previous != null ? String(r.previous) : '',
    impact: r.impact || 'Low',
  }));
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function ForexFactoryView() {
  const theme = useTheme();
  const c = theme?.colors || {};

  const [preset, setPreset] = useState('thisWeek');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [range, setRange] = useState(() => computeRange('thisWeek'));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [impactFilter, setImpactFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');

  useEffect(() => {
    if (preset === 'custom') return;
    setRange(computeRange(preset));
  }, [preset]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const ev = await fetchCalendar(range.start, range.end);
        if (!cancelled) setEvents(ev);
      } catch (err) {
        if (!cancelled) setError(err?.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [range.start, range.end]);

  const currencies = useMemo(() => {
    const s = new Set(events.map((e) => e.currency).filter(Boolean));
    return ['all', ...Array.from(s).sort()];
  }, [events]);

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

  const grouped = useMemo(() => {
    const map = new Map();
    for (const ev of filtered) {
      if (!map.has(ev.date)) map.set(ev.date, []);
      map.get(ev.date).push(ev);
    }
    return Array.from(map.entries());
  }, [filtered]);

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

  const applyCustom = () => {
    if (!customStart || !customEnd) return;
    if (customStart > customEnd) return;
    setRange({ start: customStart, end: customEnd });
  };

  const stepRange = useCallback((direction) => {
    const s = new Date(range.start + 'T00:00:00');
    const e = new Date(range.end + 'T00:00:00');
    const len = Math.round((e - s) / 86400000) + 1;
    s.setDate(s.getDate() + direction * len);
    e.setDate(e.getDate() + direction * len);
    setPreset('custom');
    setCustomStart(toISO(s));
    setCustomEnd(toISO(e));
    setRange({ start: toISO(s), end: toISO(e) });
  }, [range]);

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
        .ff-scroll::-webkit-scrollbar-thumb {
          background: ${textMuted}40;
          border-radius: 10px;
        }
        .ff-scroll::-webkit-scrollbar-track { background: transparent; }
        @keyframes ff-spin { to { transform: rotate(360deg); } }
        .ff-row:hover { background: ${accent}0a !important; }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.7);
          cursor: pointer;
        }
      `}</style>

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
        <div style={{ display: 'flex', gap: 4 }}>
          <NavBtn onClick={() => stepRange(-1)} border={border} text={textSecondary}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </NavBtn>
          <NavBtn onClick={() => setPreset('today')} border={border} text={textSecondary}>
            Today
          </NavBtn>
          <NavBtn onClick={() => stepRange(1)} border={border} text={textSecondary}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </NavBtn>
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { key: 'today', label: 'Today' },
            { key: 'thisWeek', label: 'This Week' },
            { key: 'nextWeek', label: 'Next Week' },
            { key: 'thisMonth', label: 'This Month' },
            { key: 'custom', label: 'Custom' },
          ].map((p) => (
            <Chip
              key={p.key}
              active={preset === p.key}
              onClick={() => setPreset(p.key)}
              accent={accent}
              border={border}
              textMuted={textMuted}
            >
              {p.label}
            </Chip>
          ))}
        </div>

        {preset === 'custom' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <DateInput value={customStart} onChange={setCustomStart} border={border} surface={surface} text={text} />
            <span style={{ fontSize: 11, color: textMuted }}>→</span>
            <DateInput value={customEnd} onChange={setCustomEnd} border={border} surface={surface} text={text} />
            <Chip active onClick={applyCustom} accent={accent} border={border} textMuted={textMuted}>
              Apply
            </Chip>
          </div>
        )}

        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: textMuted,
            marginLeft: 'auto',
            marginRight: 8,
            whiteSpace: 'nowrap',
          }}
        >
          {formatDayShort(range.start)} – {formatDayShort(range.end)}
        </span>

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

        <select
          value={currencyFilter}
          onChange={(e) => setCurrencyFilter(e.target.value)}
          style={{
            padding: '5px 9px',
            borderRadius: 7,
            border: `1px solid ${border}`,
            background: surface,
            color: text,
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
            outline: 'none',
          }}
        >
          {currencies.map((cur) => (
            <option key={cur} value={cur}>
              {cur === 'all' ? 'All currencies' : cur}
            </option>
          ))}
        </select>

        <button
          onClick={openLive}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 7,
            border: `1px solid ${accent}55`,
            background: `${accent}14`,
            color: accent,
            fontSize: 11,
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

      <div
        className="ff-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          background: bg,
        }}
      >
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', color: textMuted, gap: 12 }}>
            <div style={{ width: 26, height: 26, border: `3px solid ${border}`, borderTopColor: accent, borderRadius: '50%', animation: 'ff-spin 0.8s linear infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.4 }}>
              Loading calendar…
            </span>
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
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: textMuted,
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            No events found for this range.
          </div>
        )}

        {!loading && !error && grouped.map(([dateKey, dayEvents]) => (
          <div key={dateKey}>
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
                  <div style={{ color: isAllDay ? textMuted : textSecondary, fontWeight: isAllDay ? 500 : 700, fontVariantNumeric: 'tabular-nums', fontSize: isAllDay ? 11 : 12 }}>
                    {ev.time}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: meta.color, boxShadow: `0 0 5px ${meta.color}`, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.4, color: text }}>{ev.currency}</span>
                  </div>

                  <div style={{ color: text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: 10 }}>
                    {ev.event}
                  </div>

                  <div style={{ textAlign: 'right', fontWeight: 800, color: ev.actual ? meta.color : textMuted, fontVariantNumeric: 'tabular-nums' }}>
                    {ev.actual || '—'}
                  </div>

                  <div style={{ textAlign: 'right', color: textSecondary, fontVariantNumeric: 'tabular-nums' }}>
                    {ev.forecast || '—'}
                  </div>

                  <div style={{ textAlign: 'right', color: textMuted, fontVariantNumeric: 'tabular-nums' }}>
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

const headerCell = (borderSoft) => ({
  padding: '9px 0',
  borderRight: `1px solid ${borderSoft}`,
  textAlign: 'left',
});

function NavBtn({ children, onClick, border, text }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        padding: '5px 10px',
        borderRadius: 7,
        border: `1px solid ${border}`,
        background: 'transparent',
        color: text,
        fontSize: 11,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  );
}

function Chip({ children, active, onClick, accent, border, textMuted }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 11px',
        borderRadius: 7,
        border: `1px solid ${active ? accent + '66' : border}`,
        background: active ? `${accent}18` : 'transparent',
        color: active ? accent : textMuted,
        fontSize: 11,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </button>
  );
}

function DateInput({ value, onChange, border, surface, text }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '5px 9px',
        borderRadius: 7,
        border: `1px solid ${border}`,
        background: surface,
        color: text,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: 'inherit',
        outline: 'none',
        cursor: 'pointer',
        colorScheme: 'dark',
      }}
    />
  );
}