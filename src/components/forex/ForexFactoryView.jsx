// src/components/forex/ForexFactoryView.jsx
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';

/* ============================================================
   FOREX FACTORY — ECONOMIC CALENDAR VIEW
   ============================================================
   Forex Factory does not allow iframe embedding on their
   calendar page (X-Frame-Options: SAMEORIGIN), and their XML
   feed does not set CORS headers, so the browser blocks direct
   fetches.

   We solve this with a layered fetch strategy:
     1. Try the direct feed URL first (works if you've set up
        your own backend proxy that passes CORS headers).
     2. Fall back to a public CORS proxy (works out of the box,
        but rate-limited — use a real backend for production).
     3. If both fail, show a clear error with a one-click link
        to the live Forex Factory calendar.

   Set PROXY_URL below to your own backend route for production.
   ============================================================ */

const FEED_URL = 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml';
const FOREX_FACTORY_URL = 'https://www.forexfactory.com/calendar';

/* Set this to your backend proxy route for production, e.g.
   '/api/proxy/forexfactory'. Leave null to use the public
   CORS proxy fallback (fine for dev, may be rate-limited). */
const PROXY_URL = null;

/* Public CORS proxies, tried in order if PROXY_URL is null.
   These add the missing Access-Control-Allow-Origin header. */
const PUBLIC_PROXIES = [
  (u) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
  (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
];

/* ---------- impact helpers ---------- */
const IMPACT_ORDER = { High: 0, Medium: 1, Low: 2, Holiday: 3 };

const impactColor = (impact, c) => {
  switch ((impact || '').toLowerCase()) {
    case 'high':   return c.danger  || '#ef4444';
    case 'medium': return c.warning || '#f59e0b';
    case 'low':    return c.success || '#22c55e';
    default:       return c.textMuted || '#94a3b8';
  }
};

const ImpactDot = ({ impact, c }) => {
  const color = impactColor(impact, c);
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 6px ${color}`,
        flexShrink: 0,
      }}
    />
  );
};

/* ---------- date helpers ---------- */
const parseEventDate = (raw) => {
  if (!raw) return null;
  const parts = raw.split('-');
  if (parts.length !== 3) return null;
  const [m, d, y] = parts.map(Number);
  return new Date(y, m - 1, d);
};

const formatTime = (raw) => (raw ? raw.trim() : '—');

const formatDayLabel = (date) => {
  if (!date) return '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
};

/* ---------- fetch with layered fallback ---------- */
const fetchFeed = async () => {
  const attempt = async (url) => {
    const res = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: { Accept: 'text/xml, application/xml, text/plain, */*' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    if (!text || text.length < 50) throw new Error('Empty response');
    return text;
  };

  // 1. Try direct / configured proxy
  if (PROXY_URL) {
    return attempt(PROXY_URL);
  }

  try {
    return await attempt(FEED_URL);
  } catch (e) {
    // fall through to public proxies
  }

  // 2. Try each public proxy in sequence
  let lastErr;
  for (const build of PUBLIC_PROXIES) {
    try {
      return await attempt(build(FEED_URL));
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error('All feed sources failed');
};

/* ---------- main component ---------- */
export default function ForexFactoryView() {
  const theme = useTheme();
  const c = theme?.colors || {};

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [impactFilter, setImpactFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const xmlText = await fetchFeed();
        if (cancelled) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'text/xml');

        if (doc.querySelector('parsererror')) {
          throw new Error('Feed returned malformed XML.');
        }

        const nodes = Array.from(doc.querySelectorAll('event'));

        const parsed = nodes.map((node, idx) => {
          const get = (tag) => {
            const el = node.querySelector(tag);
            return el ? el.textContent.trim() : '';
          };

          const impact = get('impact') || 'Low';
          const dateObj = parseEventDate(get('date'));

          return {
            id: `${get('date')}-${get('time')}-${get('currency')}-${get('title')}-${idx}`,
            title: get('title'),
            country: get('country'),
            currency: get('currency'),
            date: get('date'),
            time: get('time'),
            impact,
            forecast: get('forecast'),
            previous: get('previous'),
            actual: get('actual'),
            dateObj,
            impactRank: IMPACT_ORDER[impact] ?? 99,
          };
        });

        if (!cancelled) setEvents(parsed);
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              'Could not reach the Forex Factory feed right now. ' +
                'This can happen if the public proxy is rate-limited.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const currencies = useMemo(() => {
    const set = new Set(events.map((e) => e.currency).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [events]);

  const filtered = useMemo(() => {
    return events
      .filter((e) => impactFilter === 'all' || e.impact === impactFilter)
      .filter((e) => currencyFilter === 'all' || e.currency === currencyFilter)
      .sort((a, b) => {
        if (a.dateObj && b.dateObj) {
          const d = a.dateObj - b.dateObj;
          if (d !== 0) return d;
        }
        const t = (a.time || '').localeCompare(b.time || '');
        if (t !== 0) return t;
        return a.impactRank - b.impactRank;
      });
  }, [events, impactFilter, currencyFilter]);

  const grouped = useMemo(() => {
    const map = new Map();
    for (const ev of filtered) {
      const key = ev.date || 'Unknown';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const bg = c.bg || '#0b0a08';
  const surface = c.surfaceElevated || c.surface || '#141310';
  const border = c.border || 'rgba(255,255,255,0.08)';
  const text = c.text || '#f4f4f5';
  const textMuted = c.textMuted || '#94a3b8';
  const accent = c.accent || '#3b82f6';
  const danger = c.danger || '#ef4444';

  const openLive = () => {
    window.open(FOREX_FACTORY_URL, '_blank', 'noopener,noreferrer');
  };

  /* ---------- layout: simple, fills available space, never clips ---------- */
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
      `}</style>

      {/* ---------- toolbar ---------- */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          padding: '14px 20px',
          borderBottom: `1px solid ${border}`,
          background: surface,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 'auto', minWidth: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.3px', color: text }}>
            Economic Calendar
          </span>
          <span style={{ fontSize: 11, fontWeight: 500, color: textMuted, marginTop: 1 }}>
            Powered by Forex Factory · current week
          </span>
        </div>

        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'High', label: 'High' },
            { key: 'Medium', label: 'Med' },
            { key: 'Low', label: 'Low' },
          ].map((f) => {
            const active = impactFilter === f.key;
            const dot = f.key !== 'all' ? impactColor(f.key, c) : accent;
            return (
              <button
                key={f.key}
                onClick={() => setImpactFilter(f.key)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: `1px solid ${active ? dot + '66' : border}`,
                  background: active ? `${dot}18` : 'transparent',
                  color: active ? dot : textMuted,
                  fontSize: 11.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease',
                }}
              >
                {f.key !== 'all' && <ImpactDot impact={f.key} c={c} />}
                {f.label}
              </button>
            );
          })}
        </div>

        <select
          value={currencyFilter}
          onChange={(e) => setCurrencyFilter(e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: 8,
            border: `1px solid ${border}`,
            background: surface,
            color: text,
            fontSize: 11.5,
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
            padding: '6px 14px',
            borderRadius: 8,
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View on Forex Factory
        </button>
      </div>

      {/* ---------- body ---------- */}
      <div
        className="ff-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px 40px',
          background: bg,
        }}
      >
        {/* loading */}
        {loading && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 20px',
              color: textMuted,
              gap: 12,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                border: `3px solid ${border}`,
                borderTopColor: accent,
                borderRadius: '50%',
                animation: 'ff-spin 0.8s linear infinite',
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>
              Loading Forex Factory calendar…
            </span>
          </div>
        )}

        {/* error */}
        {!loading && error && (
          <div
            style={{
              padding: '28px 24px',
              borderRadius: 14,
              border: `1px solid ${danger}44`,
              background: `${danger}12`,
              color: text,
              maxWidth: 560,
              margin: '40px auto',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>
              Calendar unavailable
            </div>
            <div style={{ fontSize: 12, color: textMuted, lineHeight: 1.6 }}>
              {error}
            </div>
            <div
              style={{
                fontSize: 11,
                color: textMuted,
                marginTop: 12,
                lineHeight: 1.6,
                textAlign: 'left',
              }}
            >
              <strong style={{ color: text }}>For production:</strong> create a
              backend route that fetches the feed and returns it with CORS
              headers, then set{' '}
              <code style={{ color: accent }}>PROXY_URL</code> at the top of
              this file to that route.
            </div>
            <button
              onClick={openLive}
              style={{
                marginTop: 18,
                padding: '9px 18px',
                borderRadius: 9,
                border: `1px solid ${accent}55`,
                background: `${accent}18`,
                color: accent,
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
              }}
            >
              Open Forex Factory Calendar
            </button>
          </div>
        )}

        {/* empty */}
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
            No events match your filters.
          </div>
        )}

        {/* events */}
        {!loading &&
          !error &&
          grouped.map(([dateKey, dayEvents]) => {
            const dateObj = dayEvents[0]?.dateObj;
            const label = dateObj ? formatDayLabel(dateObj) : dateKey;

            return (
              <div key={dateKey} style={{ marginBottom: 22 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 8,
                    padding: '0 4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      letterSpacing: 0.4,
                      color: accent,
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      height: 1,
                      background: `linear-gradient(90deg, ${accent}55, transparent)`,
                    }}
                  />
                  <span style={{ fontSize: 10, fontWeight: 700, color: textMuted }}>
                    {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div
                  style={{
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                    overflow: 'hidden',
                    background: surface,
                  }}
                >
                  {dayEvents.map((ev, i) => {
                    const color = impactColor(ev.impact, c);
                    const isHigh = ev.impact === 'High';

                    return (
                      <div
                        key={ev.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '64px 1fr auto',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 14px',
                          borderTop: i === 0 ? 'none' : `1px solid ${border}`,
                          background: isHigh ? `${color}08` : 'transparent',
                          transition: 'background 0.2s ease',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: textMuted,
                            fontVariantNumeric: 'tabular-nums',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {formatTime(ev.time)}
                        </span>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                            <ImpactDot impact={ev.impact} c={c} />
                            <span
                              style={{
                                fontSize: 12.5,
                                fontWeight: 700,
                                color: text,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {ev.title}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 800,
                                letterSpacing: 0.3,
                                padding: '1px 6px',
                                borderRadius: 4,
                                background: `${accent}1a`,
                                color: accent,
                                border: `1px solid ${accent}33`,
                              }}
                            >
                              {ev.currency}
                            </span>
                            {ev.country && (
                              <span style={{ fontSize: 10, color: textMuted }}>{ev.country}</span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                          {ev.actual !== '' && <Stat label="Actual" value={ev.actual} color={color} bold />}
                          {ev.forecast !== '' && <Stat label="Forecast" value={ev.forecast} color={textMuted} />}
                          {ev.previous !== '' && <Stat label="Previous" value={ev.previous} color={textMuted} />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

/* ---------- small stat block ---------- */
function Stat({ label, value, color, bold }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 48 }}>
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          color: 'inherit',
          opacity: 0.55,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: bold ? 800 : 600,
          color,
          fontVariantNumeric: 'tabular-nums',
          marginTop: 1,
        }}
      >
        {value}
      </span>
    </div>
  );
}