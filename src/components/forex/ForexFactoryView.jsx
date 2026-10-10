// src/components/forex/ForexFactoryView.jsx
import { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components';

/* ============================================================
   FOREX FACTORY — ECONOMIC CALENDAR VIEW
   ============================================================
   Forex Factory does not offer an official embeddable widget.
   Their calendar page blocks iframe embedding via X-Frame-Options.

   The public weekly XML feed is the sanctioned data source:
   https://nfs.faireconomy.media/ff_calendar_thisweek.xml

   This component fetches that feed, parses it client-side, and
   renders a theme-aware calendar that matches your app.
   ============================================================ */

const FEED_URL = 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml';

/* ---------- impact helpers ---------- */
const IMPACT_ORDER = { High: 0, Medium: 1, Low: 2, Holiday: 3 };

const impactColor = (impact, c) => {
  switch ((impact || '').toLowerCase()) {
    case 'high':
      return c.danger || '#ef4444';
    case 'medium':
      return c.warning || '#f59e0b';
    case 'low':
      return c.success || '#22c55e';
    default:
      return c.textMuted || '#94a3b8';
  }
};

const impactDot = (impact, c) => (
  <span
    style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: impactColor(impact, c),
      boxShadow: `0 0 6px ${impactColor(impact, c)}`,
      flexShrink: 0,
    }}
  />
);

/* ---------- date helpers ---------- */
const parseEventDate = (raw) => {
  if (!raw) return null;
  // FF feed format: "10-06-2026" (MM-DD-YYYY)
  const parts = raw.split('-');
  if (parts.length !== 3) return null;
  const [m, d, y] = parts.map(Number);
  return new Date(y, m - 1, d);
};

const formatTime = (raw) => {
  if (!raw) return '—';
  // FF feed time is typically "8:30am" or "All Day"
  return raw.trim();
};

const formatDayLabel = (date) => {
  if (!date) return '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
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

  /* ---------- fetch + parse the XML feed ---------- */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(FEED_URL, { mode: 'cors' });
        if (!res.ok) throw new Error(`Feed responded with ${res.status}`);
        const xmlText = await res.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlText, 'text/xml');

        const parseError = doc.querySelector('parsererror');
        if (parseError) throw new Error('Unable to parse the Forex Factory feed.');

        const nodes = Array.from(doc.querySelectorAll('event'));

        const parsed = nodes.map((node, idx) => {
          const get = (tag) => {
            const el = node.querySelector(tag);
            return el ? el.textContent.trim() : '';
          };

          const dateObj = parseEventDate(get('date'));
          const impact = get('impact') || 'Low';

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
            detail: get('detail') || get('url'),
            dateObj,
            impactRank: IMPACT_ORDER[impact] ?? 99,
          };
        });

        if (!cancelled) setEvents(parsed);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              'Could not load the Forex Factory calendar. The feed may be temporarily unavailable.'
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

  /* ---------- derived data ---------- */
  const currencies = useMemo(() => {
    const set = new Set(events.map((e) => e.currency).filter(Boolean));
    return ['all', ...Array.from(set).sort()];
  }, [events]);

  const filtered = useMemo(() => {
    return events
      .filter((e) => impactFilter === 'all' || e.impact === impactFilter)
      .filter((e) => currencyFilter === 'all' || e.currency === currencyFilter)
      .sort((a, b) => {
        // Sort by date first, then by time, then by impact rank
        if (a.dateObj && b.dateObj) {
          const d = a.dateObj - b.dateObj;
          if (d !== 0) return d;
        }
        const t = (a.time || '').localeCompare(b.time || '');
        if (t !== 0) return t;
        return a.impactRank - b.impactRank;
      });
  }, [events, impactFilter, currencyFilter]);

  /* ---------- group by day for rendering ---------- */
  const grouped = useMemo(() => {
    const map = new Map();
    for (const ev of filtered) {
      const key = ev.date || 'Unknown';
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(ev);
    }
    return Array.from(map.entries());
  }, [filtered]);

  /* ---------- inline styles that follow the theme ---------- */
  const bg = c.bg || '#0b0a08';
  const surface = c.surfaceElevated || c.surface || '#141310';
  const border = c.border || 'rgba(255,255,255,0.08)';
  const text = c.text || '#f4f4f5';
  const textMuted = c.textMuted || '#94a3b8';
  const accent = c.accent || '#3b82f6';
  const accentLight = c.accentLight || 'rgba(59,130,246,0.12)';

  return (
    <div
      style={{
        margin: '-24px -26px -60px',
        width: 'calc(100% + 52px)',
        minHeight: 'calc(100vh - 76px)',
        background: bg,
        overflow: 'hidden',
        color: text,
        display: 'flex',
        flexDirection: 'column',
      }}
      className="ff-fullbleed"
    >
      <style>{`
        @media (max-width: 768px) {
          .ff-fullbleed {
            margin: -18px -14px -80px !important;
            width: calc(100% + 28px) !important;
            min-height: calc(100vh - 56px) !important;
          }
        }
        .ff-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .ff-scroll::-webkit-scrollbar-thumb {
          background: ${textMuted}40;
          border-radius: 10px;
        }
        .ff-scroll::-webkit-scrollbar-track { background: transparent; }
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
        <div style={{ display: 'flex', flexDirection: 'column', marginRight: 'auto' }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: '-0.3px',
              color: text,
            }}
          >
            Economic Calendar
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: textMuted,
              marginTop: 1,
            }}
          >
            Powered by Forex Factory · current week
          </span>
        </div>

        {/* impact filter */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'High', label: 'High' },
            { key: 'Medium', label: 'Med' },
            { key: 'Low', label: 'Low' },
          ].map((f) => {
            const active = impactFilter === f.key;
            const dot =
              f.key !== 'all' ? impactColor(f.key, c) : accent;
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
                {f.key !== 'all' && impactDot(f.key, c)}
                {f.label}
              </button>
            );
          })}
        </div>

        {/* currency filter */}
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
      </div>

      {/* ---------- body ---------- */}
      <div
        className="ff-scroll"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px 60px',
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
            <style>{`@keyframes ff-spin { to { transform: rotate(360deg); } }`}</style>
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
              border: `1px solid ${(c.danger || '#ef4444') + '44'}`,
              background: `${c.danger || '#ef4444'}12`,
              color: text,
              maxWidth: 520,
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
                opacity: 0.8,
              }}
            >
              If this persists, the public feed may be rate-limited. Forex Factory
              allows a limited number of requests per minute.
            </div>
          </div>
        )}

        {/* events */}
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

        {!loading &&
          !error &&
          grouped.map(([dateKey, dayEvents]) => {
            const dateObj = dayEvents[0]?.dateObj;
            const label = dateObj ? formatDayLabel(dateObj) : dateKey;

            return (
              <div key={dateKey} style={{ marginBottom: 22 }}>
                {/* day header */}
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

                {/* event rows */}
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
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = `${accent}0a`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isHigh
                            ? `${color}08`
                            : 'transparent';
                        }}
                      >
                        {/* time */}
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

                        {/* title + meta */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            minWidth: 0,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              minWidth: 0,
                            }}
                          >
                            {impactDot(ev.impact, c)}
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

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              flexWrap: 'wrap',
                            }}
                          >
                            {/* currency badge */}
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
                              <span style={{ fontSize: 10, color: textMuted }}>
                                {ev.country}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* values */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 14,
                            flexShrink: 0,
                          }}
                        >
                          {ev.actual !== '' && (
                            <Stat label="Actual" value={ev.actual} color={color} bold />
                          )}
                          {ev.forecast !== '' && (
                            <Stat label="Forecast" value={ev.forecast} color={textMuted} />
                          )}
                          {ev.previous !== '' && (
                            <Stat label="Previous" value={ev.previous} color={textMuted} />
                          )}
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

/* ---------- small stat block for Actual / Forecast / Previous ---------- */
function Stat({ label, value, color, bold }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        minWidth: 48,
      }}
    >
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