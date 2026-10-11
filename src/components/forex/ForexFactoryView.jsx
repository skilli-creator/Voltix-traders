// src/components/forex/ForexFactoryView.jsx
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTheme } from 'styled-components';

/* ============================================================
   FOREX FACTORY — MULTI-TAB VIEW (v5)
   ============================================================
   Tabs: Calendar · News · Forum · Brokers · Market · Trades

   Calendar  → /api/forexfactory-range (public XML feeds)
   News      → public financial news API
   Others    → direct links to Forex Factory sections
   ============================================================ */

const FOREX_FACTORY_URL = 'https://www.forexfactory.com';

const NEWS_API_URL = 'https://api.marketaux.com/v1/news/all'; // Free tier available
const NEWS_API_KEY = 'YOUR_MARKETAUX_API_KEY'; // Replace with your key

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

/* ---------- range presets (simplified) ---------- */
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
    case 'lastWeek': {
      const s = startOfWeek(today); s.setDate(s.getDate() - 7);
      const e = new Date(s); e.setDate(s.getDate() + 6);
      return { start: toISO(s), end: toISO(e) };
    }
    case 'nextWeek': {
      const s = startOfWeek(today); s.setDate(s.getDate() + 7);
      const e = new Date(s); e.setDate(s.getDate() + 6);
      return { start: toISO(s), end: toISO(e) };
    }
    default: { // 'thisWeek'
      const s = startOfWeek(today);
      const e = new Date(s); e.setDate(s.getDate() + 6);
      return { start: toISO(s), end: toISO(e) };
    }
  }
};

/* ---------- fetch calendar ---------- */
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

/* ---------- fetch news ---------- */
const fetchNews = async () => {
  try {
    const params = new URLSearchParams({
      api_token: NEWS_API_KEY,
      language: 'en',
      limit: 20,
      filter_entities: 'true',
      entity_types: 'forex',
    });
    const res = await fetch(`${NEWS_API_URL}?${params.toString()}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  }
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function ForexFactoryView() {
  const theme = useTheme();
  const c = theme?.colors || {};

  const [activeTab, setActiveTab] = useState('calendar');

  // Calendar state
  const [preset, setPreset] = useState('thisWeek');
  const [range, setRange] = useState(() => computeRange('thisWeek'));
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [impactFilter, setImpactFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');

  // News state
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);

  // Load calendar data
  useEffect(() => {
    if (activeTab !== 'calendar') return;
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
  }, [range.start, range.end, activeTab]);

  // Load news data
  useEffect(() => {
    if (activeTab !== 'news') return;
    let cancelled = false;
    (async () => {
      setNewsLoading(true);
      setNewsError(null);
      try {
        const items = await fetchNews();
        if (!cancelled) setNews(items);
      } catch (err) {
        if (!cancelled) setNewsError(err?.message || String(err));
      } finally {
        if (!cancelled) setNewsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [activeTab]);

  // Update range when preset changes
  useEffect(() => {
    setRange(computeRange(preset));
  }, [preset]);

  /* Derived calendar data */
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

  const openLive = (path = '/calendar') => {
    window.open(`${FOREX_FACTORY_URL}${path}`, '_blank', 'noopener,noreferrer');
  };

  const TABS = [
    { key: 'calendar', label: 'Calendar' },
    { key: 'news', label: 'News' },
    { key: 'forum', label: 'Forum' },
    { key: 'brokers', label: 'Brokers' },
    { key: 'market', label: 'Market' },
    { key: 'trades', label: 'Trades' },
  ];

  /* ============================================================
     RENDER
     ============================================================ */
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
        .ff-tab:hover { background: ${accent}0d !important; }
        .ff-news:hover { background: ${accent}0a !important; }
      `}</style>

      {/* ===================== TAB BAR ===================== */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 4,
          padding: '8px 20px',
          borderBottom: `1px solid ${border}`,
          background: surface,
          flexShrink: 0,
        }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className="ff-tab"
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '7px 16px',
              borderRadius: 8,
              border: `1px solid ${activeTab === tab.key ? accent + '66' : 'transparent'}`,
              background: activeTab === tab.key ? `${accent}18` : 'transparent',
              color: activeTab === tab.key ? accent : textMuted,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        ))}

        <span style={{ flex: 1 }} />

        <button
          onClick={() => openLive('/calendar')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 8,
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
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Live
        </button>
      </div>

      {/* ===================== CALENDAR TAB ===================== */}
      {activeTab === 'calendar' && (
        <>
          {/* Calendar toolbar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 10,
              padding: '10px 20px',
              borderBottom: `1px solid ${border}`,
              background: bg,
              flexShrink: 0,
            }}
          >
            {/* Simplified duration tabs */}
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { key: 'lastWeek', label: 'Last Week' },
                { key: 'thisWeek', label: 'This Week' },
                { key: 'nextWeek', label: 'Next Week' },
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

            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: textMuted,
                marginLeft: 8,
                whiteSpace: 'nowrap',
              }}
            >
              {formatDayShort(range.start)} – {formatDayShort(range.end)}
            </span>

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
                    }}
                  >
                    {f.key !== 'all' && (
                      <span style={{ width: 7, height: 7, borderRadius: 2, background: meta.color, boxShadow: `0 0 5px ${meta.color}` }} />
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
          </div>

          {/* Calendar table header */}
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

          {/* Calendar body */}
          <div className="ff-scroll" style={{ flex: 1, overflowY: 'auto', background: bg }}>
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
                <button onClick={() => openLive('/calendar')} style={{ marginTop: 18, padding: '9px 18px', borderRadius: 9, border: `1px solid ${accent}55`, background: `${accent}18`, color: accent, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Open Forex Factory Calendar
                </button>
              </div>
            )}

            {!loading && !error && grouped.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: textMuted, fontSize: 12.5, fontWeight: 600 }}>
                <div style={{ marginBottom: 8 }}>No events found for this range.</div>
                <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.75, marginBottom: 14 }}>
                  The public feeds cover last week, this week, and next week.
                </div>
                <a
                  href={`${FOREX_FACTORY_URL}/calendar`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', padding: '6px 14px', borderRadius: 8, border: `1px solid ${accent}55`, background: `${accent}14`, color: accent, fontSize: 11.5, fontWeight: 700, textDecoration: 'none' }}
                >
                  Open full calendar on Forex Factory →
                </a>
              </div>
            )}

            {!loading && !error && grouped.map(([dateKey, dayEvents]) => (
              <div key={dateKey}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 20px', background: `${accent}0d`, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${borderSoft}` }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: accent, letterSpacing: 0.3 }}>{formatDayLong(dateKey)}</span>
                  <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}55, transparent)` }} />
                  <span style={{ fontSize: 10, fontWeight: 700, color: textMuted }}>{dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}</span>
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
        </>
      )}

      {/* ===================== NEWS TAB ===================== */}
      {activeTab === 'news' && (
        <div className="ff-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {newsLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 20px', color: textMuted, gap: 12 }}>
              <div style={{ width: 26, height: 26, border: `3px solid ${border}`, borderTopColor: accent, borderRadius: '50%', animation: 'ff-spin 0.8s linear infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>Loading news…</span>
            </div>
          )}

          {!newsLoading && newsError && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: textMuted }}>
              <div style={{ marginBottom: 8 }}>{newsError}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 14 }}>
                Set your Marketaux API key in the component to load news.
              </div>
              <a href={`${FOREX_FACTORY_URL}/news`} target="_blank" rel="noopener noreferrer" style={{ color: accent, fontWeight: 700, textDecoration: 'none' }}>
                Open Forex Factory News →
              </a>
            </div>
          )}

          {!newsLoading && !newsError && news.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: textMuted, fontSize: 12.5 }}>
              No news articles available.
            </div>
          )}

          {!newsLoading && !newsError && news.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {news.map((article, i) => (
                <a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ff-news"
                  style={{
                    display: 'block',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: `1px solid ${border}`,
                    background: surface,
                    textDecoration: 'none',
                    color: text,
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                      {article.source || 'Forex News'}
                    </span>
                    {article.published_at && (
                      <span style={{ fontSize: 10, color: textMuted }}>
                        {new Date(article.published_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4, lineHeight: 1.35 }}>
                    {article.title}
                  </div>
                  {article.description && (
                    <div style={{ fontSize: 12, color: textSecondary, lineHeight: 1.5 }}>
                      {article.description.slice(0, 200)}{article.description.length > 200 ? '…' : ''}
                    </div>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================== LINK TABS (Forum, Brokers, Market, Trades) ===================== */}
      {['forum', 'brokers', 'market', 'trades'].includes(activeTab) && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
          <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 18,
              background: `${accent}14`,
              border: `1px solid ${accent}33`,
              color: accent,
              margin: '0 auto 20px',
            }}>
              {activeTab === 'forum' && (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              )}
              {activeTab === 'brokers' && (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="7" width="18" height="14" rx="2" />
                  <path d="M3 11h18" />
                  <circle cx="12" cy="15" r="2" />
                </svg>
              )}
              {activeTab === 'market' && (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              )}
              {activeTab === 'trades' && (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              )}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8, color: text }}>
              {activeTab === 'forum' && 'Forex Factory Forum'}
              {activeTab === 'brokers' && 'Forex Broker Directory'}
              {activeTab === 'market' && 'Live Market Data'}
              {activeTab === 'trades' && 'Live Trade Feed'}
            </h2>

            <p style={{ fontSize: 13, color: textSecondary, lineHeight: 1.6, marginBottom: 24 }}>
              {activeTab === 'forum' && 'Join the largest forex discussion forum on the web. Trading systems, strategies, broker reviews, and live market analysis from thousands of traders.'}
              {activeTab === 'brokers' && 'Compare regulated forex brokers side by side. Spreads, commissions, swap rates, regulation, and platform features — all maintained by Forex Factory staff.'}
              {activeTab === 'market' && 'Real-time forex market prices aggregated from leading brokers. Live quotes, charts, and market overview across all major pairs.'}
              {activeTab === 'trades' && 'Watch live trades from thousands of traders around the world. See what the community is buying and selling in real time.'}
            </p>

            <button
              onClick={() => openLive(`/${activeTab}`)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 24px',
                borderRadius: 10,
                border: `1px solid ${accent}55`,
                background: `${accent}14`,
                color: accent,
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Open on Forex Factory
            </button>
          </div>
        </div>
      )}
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

function Chip({ children, active, onClick, accent, border, textMuted }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: 7,
        border: `1px solid ${active ? accent + '66' : border}`,
        background: active ? `${accent}18` : 'transparent',
        color: active ? accent : textMuted,
        fontSize: 11.5,
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