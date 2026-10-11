// src/components/forex/ForexFactoryView.jsx
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';

/* ============================================================
   FOREX FACTORY — ECONOMIC CALENDAR VIEW (v6.2)
   ============================================================
   v6.1: fixed-position outer container → page scrolls.
   v6.2: toolbar is now sticky at the top of the scroll area.
   ============================================================ */

const FOREX_FACTORY_URL = 'https://www.forexfactory.com/calendar';
const IMPACT_ORDER = { High: 0, Medium: 1, Low: 2, Holiday: 3 };

const impactMeta = (impact, c) => {
  switch (String(impact || '').toLowerCase()) {
    case 'high':    return { color: c.danger  || '#ef4444', label: 'High' };
    case 'medium':  return { color: c.warning || '#f59e0b', label: 'Medium' };
    case 'low':     return { color: c.success || '#eab308', label: 'Low' };
    case 'holiday': return { color: c.textMuted || '#94a3b8', label: 'Holiday' };
    default:        return { color: c.textMuted || '#94a3b8', label: '—' };
  }
};

/* ---------- date formatters ---------- */
const formatDayLong = (iso) => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
};

const formatDayShort = (iso) => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`;
};

/* ---------- fetch ---------- */
const fetchAllFeeds = async () => {
  const res = await fetch('/api/forexfactory-range', { method: 'GET', mode: 'cors' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  const json = await res.json();
  return {
    last: Array.isArray(json.last) ? json.last : [],
    this: Array.isArray(json.this) ? json.this : [],
    next: Array.isArray(json.next) ? json.next : [],
    error: json.error || null,
  };
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function ForexFactoryView() {
  const theme = useTheme();
  const c = theme?.colors || {};

  const [preset, setPreset] = useState('thisWeek');
  const [data, setData] = useState({ last: [], this: [], next: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [impactFilter, setImpactFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAllFeeds();
        if (cancelled) return;
        setData({ last: result.last, this: result.this, next: result.next });
        if (result.error) setError(result.error);
      } catch (err) {
        if (!cancelled) setError(err?.message || String(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const events = useMemo(() => {
    if (preset === 'lastWeek') return data.last || [];
    if (preset === 'nextWeek') return data.next || [];
    return data.this || [];
  }, [preset, data]);

  const dateRange = useMemo(() => {
    if (events.length === 0) return null;
    const dates = events.map((e) => e.date).filter(Boolean).sort();
    return { start: dates[0], end: dates[dates.length - 1] };
  }, [events]);

  const currencies = useMemo(() => {
    const set = new Set();
    for (const ev of events) {
      if (ev.currency) set.add(ev.currency);
    }
    return ['all', ...Array.from(set).sort()];
  }, [events]);

  useEffect(() => {
    if (currencyFilter !== 'all' && !currencies.includes(currencyFilter)) {
      setCurrencyFilter('all');
    }
  }, [currencies, currencyFilter]);

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

  const surface = c.surfaceElevated || c.surface || '#141310';
  const border = c.border || 'rgba(255,255,255,0.08)';
  const borderSoft = c.borderMuted || 'rgba(255,255,255,0.04)';
  const text = c.text || '#f4f4f5';
  const textMuted = c.textMuted || '#94a3b8';
  const textSecondary = c.textSecondary || '#cbd5e1';
  const accent = c.accent || '#3b82f6';
  const danger = c.danger || '#ef4444';
  const bg = c.bg || '#0b0a08';

  const openLive = () => {
    window.open(FOREX_FACTORY_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--topbar-h, 76px)',
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        background: bg,
        color: text,
        zIndex: 1,
      }}
    >
      <style>{`
        @keyframes ff-spin { to { transform: rotate(360deg); } }
        .ff-row:hover { background: ${accent}0a !important; }
      `}</style>

      {/* ===================== STICKY TOOLBAR ===================== */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: bg,
          borderBottom: `1px solid ${border}`,
          boxShadow: `0 6px 14px -8px rgba(0,0,0,0.35)`,
        }}
      >
        <div
          style={{
            maxWidth: 1600,
            margin: '0 auto',
            padding: '14px 26px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: 8, minWidth: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.2px', color: text }}>
              Economic Calendar
            </span>
            <span style={{ fontSize: 11, fontWeight: 500, color: textMuted, marginTop: 2 }}>
              {dateRange
                ? `${formatDayShort(dateRange.start)} – ${formatDayShort(dateRange.end)}`
                : 'No data for this week'}
            </span>
          </div>

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
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: `1px solid ${preset === p.key ? accent + '66' : border}`,
                  background: preset === p.key ? `${accent}18` : 'transparent',
                  color: preset === p.key ? accent : textMuted,
                  fontSize: 12.5,
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
                    padding: '6px 12px',
                    borderRadius: 7,
                    border: `1px solid ${active ? meta.color + '66' : border}`,
                    background: active ? `${meta.color}18` : 'transparent',
                    color: active ? meta.color : textMuted,
                    fontSize: 11.5,
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
              padding: '7px 11px',
              borderRadius: 7,
              border: `1px solid ${currencyFilter !== 'all' ? accent + '66' : border}`,
              background: currencyFilter !== 'all' ? `${accent}14` : surface,
              color: currencyFilter !== 'all' ? accent : text,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              outline: 'none',
              minWidth: 130,
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
              padding: '7px 14px',
              borderRadius: 7,
              border: `1px solid ${accent}55`,
              background: `${accent}14`,
              color: accent,
              fontSize: 12,
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
      </div>

      {/* ===================== SCROLLABLE CONTENT ===================== */}
      <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 26px 80px' }}>
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '90px 70px 1fr 1fr 1fr 1fr',
            gap: 0,
            padding: '10px 0',
            borderBottom: `1px solid ${border}`,
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            color: textMuted,
          }}
        >
          <div style={headerCell(borderSoft)}>Time</div>
          <div style={headerCell(borderSoft)}>Currency</div>
          <div style={headerCell(borderSoft)}>Event</div>
          <div style={{ ...headerCell(borderSoft), textAlign: 'right' }}>Actual</div>
          <div style={{ ...headerCell(borderSoft), textAlign: 'right' }}>Forecast</div>
          <div style={{ ...headerCell(borderSoft), textAlign: 'right' }}>Previous</div>
        </div>

        {/* Body */}
        <div>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', color: textMuted, gap: 12 }}>
              <div style={{ width: 26, height: 26, border: `3px solid ${border}`, borderTopColor: accent, borderRadius: '50%', animation: 'ff-spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>Loading calendar…</span>
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
              <div style={{ marginBottom: 10 }}>
                {events.length === 0
                  ? 'No events in this feed.'
                  : 'No events match your filters.'}
              </div>
              {(impactFilter !== 'all' || currencyFilter !== 'all') && (
                <button
                  onClick={() => { setImpactFilter('all'); setCurrencyFilter('all'); }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: `1px solid ${accent}55`,
                    background: `${accent}14`,
                    color: accent,
                    fontSize: 12,
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 0',
                  borderBottom: `1px solid ${borderSoft}`,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 800, color: accent, letterSpacing: 0.3 }}>
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
                      padding: '10px 0',
                      borderBottom: `1px solid ${borderSoft}`,
                      background: isHigh ? `${meta.color}08` : 'transparent',
                      transition: 'background 0.15s ease',
                      fontSize: 12.5,
                    }}
                  >
                    <div style={{
                      color: isAllDay ? textMuted : textSecondary,
                      fontWeight: isAllDay ? 500 : 700,
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: isAllDay ? 11 : 12,
                    }}>
                      {ev.time}
                    </div>

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

                    <div style={{
                      textAlign: 'right',
                      fontWeight: 800,
                      color: ev.actual ? meta.color : textMuted,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {ev.actual || '—'}
                    </div>

                    <div style={{
                      textAlign: 'right',
                      color: textSecondary,
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      {ev.forecast || '—'}
                    </div>

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
    </div>
  );
}

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */
const headerCell = (borderSoft) => ({
  padding: '0 0',
  borderRight: `1px solid ${borderSoft}`,
  textAlign: 'left',
});