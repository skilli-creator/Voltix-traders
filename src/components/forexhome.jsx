// src/components/forexhome.jsx
import { useTheme } from 'styled-components';
import {
  CURRENCIES, CUR_NAMES, WATCHLIST,
  fmt, fmtMoney, fmtPrice, usdValueOf, contractOf,
  currencyStrength, positionPL, totalPL,
  Sparkline, AreaChart, StatCard,
} from '../pages/forexdash';

export default function ForexHome({
  pairs, positions, account, equityHistory, strength,
  onTrade, onClosePosition, onViewChange,
}) {
  const theme = useTheme();
  const c = theme?.colors || {};

  const pl = totalPL(positions, pairs, strength);
  const equity = account.balance + pl;

  const usedMargin = positions.reduce((s, p) => {
    const price = pairs[p.sym].price;
    const quote = p.sym.slice(3, 6);
    return s + (Math.abs(p.lots) * contractOf(p.sym) * price * usdValueOf(quote, strength)) / 100;
  }, 0);

  const freeMargin = equity - usedMargin;
  const marginLevel = usedMargin > 0 ? (equity / usedMargin) * 100 : 0;
  const dayPct = ((equity - account.balance) / account.balance) * 100;

  const st = currencyStrength(strength);
  const sortedCur = CURRENCIES.slice().sort((a, b) => st[b] - st[a]);
  const pick = [...sortedCur.slice(0, 4), ...sortedCur.slice(-4)];
  const maxAbs = Math.max(...pick.map((x) => Math.abs(st[x])), 0.05);

  const lo = Math.min(...equityHistory);
  const hi = Math.max(...equityHistory);

  const services = [
    {
      key: 'home',
      title: 'Live Market Overview',
      desc: 'Streaming quotes for majors, gold and crosses with sparkline trends, pip moves and open P/L — all in real time.',
      cta: 'Open market',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l5-6 4 4 8-9" />
          <path d="M15 6h5v5" />
        </svg>
      ),
    },
    {
      key: 'lot',
      title: 'Lot Size Calculator',
      desc: 'Risk-based position sizing across every instrument. Enter balance, risk % and stop-loss — get the exact lot size instantly.',
      cta: 'Calculate size',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="18" rx="2.5" />
          <path d="M8 7.5h8" />
          <path d="M8 12h1.5M12 12h1.5M16 12h.01M8 16h1.5M12 16h1.5M16 16h.01" />
        </svg>
      ),
    },
    {
      key: 'strength',
      title: 'Currency Strength Meter',
      desc: 'Rank the 8 majors against a weighted basket. See the strongest and weakest pairs with a one-glance long/short bias.',
      cta: 'View strength',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 20v-8" />
          <path d="M12 20V4" />
          <path d="M19 20v-5" />
        </svg>
      ),
    },
    {
      key: 'bots',
      title: 'Automated Trading Bots',
      desc: 'Toggle five pre-built strategies on or off and track live P/L, win rate and trade counts without lifting a finger.',
      cta: 'Manage bots',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3.5" y="7.5" width="17" height="12" rx="3.5" />
          <path d="M12 7.5V4" />
          <circle cx="12" cy="3.4" r="1" />
          <path d="M9 13h.01M15 13h.01" />
          <path d="M9.5 16.5h5" />
        </svg>
      ),
    },
  ];

  const features = [
    { k: '8',    v: 'Major currencies' },
    { k: '16',   v: 'Tradable pairs'   },
    { k: '5',    v: 'Built-in bots'    },
    { k: '1.5s', v: 'Live tick rate'   },
  ];

  return (
    <>
      <style>{`
        .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:18px}
        @media (max-width:1180px){ .stats-grid{grid-template-columns:repeat(2,1fr)} }
        @media (max-width:860px){ .stats-grid{grid-template-columns:1fr 1fr;gap:11px} }

        /* ---------- HERO / ABOUT ---------- */
        .home-hero{
          position:relative;
          padding:40px 34px;
          border-radius:18px;
          margin-bottom:22px;
          overflow:hidden;
          border:1px solid ${c.glassBorder || 'rgba(255,255,255,.08)'};
          background:
            radial-gradient(ellipse at 0% 0%, ${c.accentLight || 'rgba(0,214,143,.14)'}, transparent 55%),
            radial-gradient(ellipse at 100% 100%, ${c.accentLight || 'rgba(59,130,246,.12)'}, transparent 55%),
            linear-gradient(180deg, ${c.surfaceElevated || '#0c1523'} 0%, ${c.bg || '#0a121e'} 100%);
        }
        .home-hero::before{
          content:'';
          position:absolute;inset:0;
          background-image:
            linear-gradient(${c.text}05 1px, transparent 1px),
            linear-gradient(90deg, ${c.text}05 1px, transparent 1px);
          background-size:40px 40px;
          pointer-events:none;
          mask-image:radial-gradient(ellipse at center, black, transparent 75%);
        }
        .home-hero > *{ position:relative; z-index:1; }

        .hero-badge{
          display:inline-flex;
          align-items:center;
          gap:7px;
          padding:5px 12px;
          border-radius:20px;
          background:${c.accentLight || 'rgba(0,214,143,.12)'};
          border:1px solid ${c.accentMuted || 'rgba(0,214,143,.28)'};
          color:${c.accent || '#00d68f'};
          font-size:10.5px;
          font-weight:700;
          letter-spacing:1.2px;
          text-transform:uppercase;
          margin-bottom:16px;
        }
        .hero-badge .dot{
          width:6px;height:6px;border-radius:50%;
          background:${c.accent || '#00d68f'};
          box-shadow:0 0 8px ${c.accent || 'rgba(0,214,143,.8)'};
          animation:heroPulse 2s infinite;
        }
        @keyframes heroPulse{
          0%{box-shadow:0 0 0 0 ${c.accentMuted || 'rgba(0,214,143,.7)'}}
          70%{box-shadow:0 0 0 8px transparent}
          100%{box-shadow:0 0 0 0 transparent}
        }

        .home-hero h1{
          font-size:34px;
          line-height:1.15;
          font-weight:800;
          letter-spacing:-1px;
          color:${c.text || '#e8eefb'};
          margin-bottom:12px;
          max-width:720px;
        }
        .home-hero h1 .accent{
          background:linear-gradient(90deg, ${c.accent || '#00d68f'}, ${c.accentHover || '#3b82f6'});
          -webkit-background-clip:text;
          background-clip:text;
          -webkit-text-fill-color:transparent;
        }
        .home-hero p{
          font-size:14.5px;
          line-height:1.6;
          color:${c.textSecondary || '#7d90b0'};
          max-width:660px;
          margin-bottom:26px;
        }

        .hero-features{
          display:flex;
          flex-wrap:wrap;
          gap:22px 40px;
          padding-top:22px;
          border-top:1px solid ${c.border || 'rgba(255,255,255,.06)'};
        }
        .hero-feature .n{
          font-family:'JetBrains Mono','Courier New',monospace;
          font-size:22px;
          font-weight:700;
          letter-spacing:-.6px;
          color:${c.text || '#e8eefb'};
          line-height:1;
        }
        .hero-feature .n span{ color:${c.accent || '#00d68f'}; }
        .hero-feature .l{
          font-size:10.5px;
          color:${c.textMuted || '#5a6b88'};
          text-transform:uppercase;
          letter-spacing:.9px;
          font-weight:600;
          margin-top:5px;
        }

        @media (max-width:768px){
          .home-hero{padding:28px 22px;border-radius:14px;}
          .home-hero h1{font-size:24px;letter-spacing:-.6px;}
          .home-hero p{font-size:13.5px;margin-bottom:20px;}
          .hero-features{gap:16px 26px;padding-top:18px;}
          .hero-feature .n{font-size:18px;}
        }

        /* ---------- SERVICES ---------- */
        .services-section{ margin-bottom:26px; }

        .section-head{
          display:flex;
          align-items:flex-end;
          justify-content:space-between;
          gap:16px;
          margin-bottom:16px;
          flex-wrap:wrap;
        }
        .section-head h2{
          font-size:18px;
          font-weight:700;
          letter-spacing:-.4px;
          color:${c.text || '#e8eefb'};
        }
        .section-head p{
          font-size:12.5px;
          color:${c.textSecondary || '#7d90b0'};
          margin-top:2px;
        }
        .section-head .count{
          font-size:11px;
          font-weight:600;
          color:${c.textMuted || '#5a6b88'};
          text-transform:uppercase;
          letter-spacing:1px;
        }

        .services-grid{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:14px;
        }
        @media (max-width:1180px){ .services-grid{grid-template-columns:repeat(2,1fr)} }
        @media (max-width:560px){ .services-grid{grid-template-columns:1fr} }

        .service-card{
          position:relative;
          padding:20px 18px 18px;
          border-radius:14px;
          background:linear-gradient(180deg, ${c.surfaceElevated || '#0f1829'} 0%, ${c.surface || '#0d1524'} 100%);
          border:1px solid ${c.border || '#16223a'};
          cursor:pointer;
          transition:.22s cubic-bezier(.16,1,.3,1);
          overflow:hidden;
        }
        .service-card::before{
          content:'';
          position:absolute;
          top:0;left:0;right:0;height:2px;
          background:linear-gradient(90deg, ${c.accent || '#00d68f'}, transparent);
          opacity:0;
          transition:opacity .25s;
        }
        .service-card:hover{
          transform:translateY(-3px);
          border-color:${c.accentMuted || '#243550'};
          box-shadow:${c.shadowElevated || '0 14px 34px rgba(0,0,0,.35)'};
        }
        .service-card:hover::before{ opacity:1; }

        .service-icon{
          width:38px;height:38px;
          border-radius:10px;
          display:grid;place-items:center;
          background:linear-gradient(135deg, ${c.accentLight || 'rgba(0,214,143,.16)'}, ${c.accentLight || 'rgba(59,130,246,.12)'});
          border:1px solid ${c.accentMuted || 'rgba(0,214,143,.22)'};
          color:${c.accent || '#00d68f'};
          margin-bottom:14px;
        }
        .service-icon svg{ width:18px;height:18px; }

        .service-card h3{
          font-size:14px;
          font-weight:700;
          letter-spacing:-.2px;
          color:${c.text || '#e8eefb'};
          margin-bottom:7px;
        }
        .service-card p{
          font-size:12.5px;
          line-height:1.55;
          color:${c.textSecondary || '#7d90b0'};
          margin-bottom:14px;
          min-height:58px;
        }
        .service-cta{
          display:inline-flex;
          align-items:center;
          gap:6px;
          font-size:12px;
          font-weight:700;
          color:${c.accent || '#00d68f'};
          letter-spacing:.2px;
        }
        .service-cta::after{
          content:'→';
          transition:transform .2s;
        }
        .service-card:hover .service-cta::after{ transform:translateX(4px); }

        @media (max-width:768px){
          .section-head h2{ font-size:16px; }
          .service-card{ padding:16px 15px 15px; }
          .service-card p{ min-height:0; }
        }
      `}</style>

      <section className="view active">

        {/* ================= HERO / ABOUT ================= */}
        <div className="home-hero">
          <div className="hero-badge">
            <span className="dot" /> Forex Trading Terminal
          </div>
          <h1>
            Trade smarter with real-time <span className="accent">forex intelligence</span>.
          </h1>
          <p>
            MyTradeApp is a third-party terminal for retail forex traders. Analyze live quotes,
            size every position correctly, rank currencies by strength, and let automated bots
            run your strategy — all from one clean dashboard.
          </p>

          <div className="hero-features">
            {features.map((f) => (
              <div className="hero-feature" key={f.v}>
                <div className="n">
                  {f.k}<span>+</span>
                </div>
                <div className="l">{f.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= SERVICES ================= */}
        <div className="services-section">
          <div className="section-head">
            <div>
              <h2>What you can do here</h2>
              <p>Four core tools built into a single terminal.</p>
            </div>
            <span className="count">{services.length} services</span>
          </div>

          <div className="services-grid">
            {services.map((s) => (
              <div
                key={s.key}
                className="service-card"
                onClick={() => onViewChange && onViewChange(s.key)}
              >
                <div className="service-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="service-cta">{s.cta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= ACCOUNT SNAPSHOT ================= */}
        <div className="stats-grid">
          <StatCard
            label="Balance"
            value={fmtMoney(account.balance)}
            sub={<><span className="delta pos">USD</span> Base currency</>}
            accent={c.success || '#00d68f'}
            icon={<svg viewBox="0 0 24 24" stroke={c.success || '#00d68f'}><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18" /></svg>}
          />
          <StatCard
            label="Equity"
            value={fmtMoney(equity)}
            sub={<><span className={`delta ${dayPct >= 0 ? 'pos' : 'neg'}`}>{dayPct >= 0 ? '+' : ''}{fmt(dayPct, 2)}%</span> today</>}
            accent={c.accent || '#3b82f6'}
            icon={<svg viewBox="0 0 24 24" stroke={c.accent || '#3b82f6'}><path d="M3 17l5-6 4 4 8-9" /></svg>}
          />
          <StatCard
            label="Open P/L"
            value={(pl >= 0 ? '+' : '') + fmtMoney(pl)}
            valueClass={pl >= 0 ? 'pos' : 'neg'}
            sub={`${positions.length} open positions`}
            accent={c.warning || '#f5a524'}
            icon={<svg viewBox="0 0 24 24" stroke={c.warning || '#f5a524'}><path d="M12 3v18" /><path d="M6 9l6-6 6 6" /></svg>}
          />
          <StatCard
            label="Free Margin"
            value={fmtMoney(Math.max(freeMargin, 0))}
            sub={<>Margin level <span className="delta pos">{fmt(marginLevel, 1)}%</span></>}
            accent={c.accentSoft || '#a855f7'}
            icon={<svg viewBox="0 0 24 24" stroke={c.accentSoft || '#a855f7'}><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /></svg>}
          />
        </div>

        {/* ================= EQUITY CURVE ================= */}
        <div className="grid-eq">
          <div className="card">
            <div className="card-head">
              <h3>Account Equity Curve</h3>
              <span className="tag">Session</span>
              <div className="spacer" />
              <span className="muted" style={{ fontSize: 11.5 }}>{fmtMoney(lo)} — {fmtMoney(hi)}</span>
            </div>
            <div style={{ height: 170, padding: '14px 8px 8px' }}>
              <AreaChart values={equityHistory} w={1000} h={150} color={c.accent || '#00d68f'} id="eqGrad" />
            </div>
          </div>
        </div>

        {/* ================= WATCHLIST + STRENGTH ================= */}
        <div className="grid-2">
          <div className="card">
            <div className="card-head">
              <h3>Watchlist</h3>
              <span className="tag">{WATCHLIST.length} instruments</span>
              <div className="spacer" />
              <span className="muted" style={{ fontSize: 11 }}>Streaming · 1.5s</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Instrument</th>
                    <th className="r">Bid</th>
                    <th className="r">Change</th>
                    <th>Trend</th>
                    <th className="r"></th>
                  </tr>
                </thead>
                <tbody>
                  {WATCHLIST.map((sym) => {
                    const p = pairs[sym];
                    const chg = ((p.price - p.open) / p.open) * 100;
                    const up = chg >= 0;
                    const b = sym.slice(0, 3);
                    const q = sym.slice(3, 6);
                    return (
                      <tr key={sym}>
                        <td>
                          <div className="sym-cell">
                            <div className="sym-badge">{b}</div>
                            <div>
                              <div className="sym-name">{b}/{q}</div>
                              <div className="sym-desc">{CUR_NAMES[b]} / {CUR_NAMES[q]}</div>
                            </div>
                          </div>
                        </td>
                        <td className="r num">{fmtPrice(sym, p.price)}</td>
                        <td className={`r num ${up ? 'pos' : 'neg'}`}>
                          {up ? '+' : ''}{fmt(chg, 2)}%
                        </td>
                        <td><Sparkline values={p.history} w={100} h={28} color={up ? (c.success || '#00d68f') : (c.danger || '#ff4d6a')} /></td>
                        <td className="r">
                          <button className="btn trade" onClick={() => onTrade(sym)}>Trade</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h3>Currency Strength</h3>
              <div className="spacer" />
              <span className="muted" style={{ fontSize: 11 }}>vs basket</span>
            </div>
            <div style={{ padding: '9px 0 14px' }}>
              {pick.map((curr) => {
                const v = st[curr];
                const w = (Math.abs(v) / maxAbs) * 50;
                const pos = v >= 0;
                return (
                  <div className="st-row" key={curr}>
                    <div className="st-cur">{curr}</div>
                    <div className="st-track">
                      <div className="st-mid" />
                      <div
                        className={`st-bar ${pos ? 'pos' : 'neg'}`}
                        style={pos ? { left: '50%', width: `${w}%` } : { right: '50%', width: `${w}%` }}
                      />
                    </div>
                    <div className={`st-val ${pos ? 'pos' : 'neg'}`}>
                      {pos ? '+' : ''}{fmt(v, 2)}%
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: '0 18px 16px' }}>
              <button
                className="btn ghost sm"
                style={{ width: '100%' }}
                onClick={() => onViewChange && onViewChange('strength')}
              >
                Open Strength Meter
              </button>
            </div>
          </div>
        </div>

        {/* ================= OPEN POSITIONS ================= */}
        <div className="card">
          <div className="card-head">
            <h3>Open Positions</h3>
            <span className="tag">{positions.length}</span>
            <div className="spacer" />
            <span className="muted" style={{ fontSize: 11.5 }}>Leverage 1:100</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Side</th>
                  <th>Instrument</th>
                  <th className="r">Lots</th>
                  <th className="r">Entry</th>
                  <th className="r">Current</th>
                  <th className="r">P/L</th>
                  <th className="r"></th>
                </tr>
              </thead>
              <tbody>
                {positions.length === 0 ? (
                  <tr><td colSpan="7" className="empty">No open positions</td></tr>
                ) : (
                  positions.map((p, i) => {
                    const cur = pairs[p.sym].price;
                    const pl2 = positionPL(p, pairs, strength);
                    return (
                      <tr key={i}>
                        <td><span className={`side-tag ${p.side}`}>{p.side.toUpperCase()}</span></td>
                        <td><span className="sym-name">{p.sym.slice(0, 3)}/{p.sym.slice(3, 6)}</span></td>
                        <td className="r num">{fmt(p.lots, 2)}</td>
                        <td className="r num">{fmtPrice(p.sym, p.entry)}</td>
                        <td className="r num">{fmtPrice(p.sym, cur)}</td>
                        <td className={`r num ${pl2 >= 0 ? 'pos' : 'neg'}`}>
                          {pl2 >= 0 ? '+' : ''}{fmtMoney(pl2)}
                        </td>
                        <td className="r">
                          <button className="icon-x" onClick={() => onClosePosition(i)}>×</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="notice">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          <span>Demo environment — all prices and positions are simulated client-side. Connect a broker or market-data API to stream live quotes.</span>
        </div>
      </section>
    </>
  );
}