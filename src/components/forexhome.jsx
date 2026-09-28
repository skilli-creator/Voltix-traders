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
  const maxAbs = Math.max(...pick.map((c) => Math.abs(st[c])), 0.05);

  const lo = Math.min(...equityHistory);
  const hi = Math.max(...equityHistory);

  return (
    <section className="view active">
      {/* ---- Stat cards ---- */}
      <div className="stats-grid">
        <StatCard
          label="Balance"
          value={fmtMoney(account.balance)}
          sub={<><span className="delta pos">USD</span> Base currency</>}
          accent="#00d68f"
          icon={<svg viewBox="0 0 24 24" stroke="#00d68f"><rect x="3" y="6" width="18" height="13" rx="2.5" /><path d="M3 10h18" /></svg>}
        />
        <StatCard
          label="Equity"
          value={fmtMoney(equity)}
          sub={<><span className={`delta ${dayPct >= 0 ? 'pos' : 'neg'}`}>{dayPct >= 0 ? '+' : ''}{fmt(dayPct, 2)}%</span> today</>}
          accent="#3b82f6"
          icon={<svg viewBox="0 0 24 24" stroke="#3b82f6"><path d="M3 17l5-6 4 4 8-9" /></svg>}
        />
        <StatCard
          label="Open P/L"
          value={(pl >= 0 ? '+' : '') + fmtMoney(pl)}
          valueClass={pl >= 0 ? 'pos' : 'neg'}
          sub={`${positions.length} open positions`}
          accent="#f5a524"
          icon={<svg viewBox="0 0 24 24" stroke="#f5a524"><path d="M12 3v18" /><path d="M6 9l6-6 6 6" /></svg>}
        />
        <StatCard
          label="Free Margin"
          value={fmtMoney(Math.max(freeMargin, 0))}
          sub={<>Margin level <span className="delta pos">{fmt(marginLevel, 1)}%</span></>}
          accent="#a855f7"
          icon={<svg viewBox="0 0 24 24" stroke="#a855f7"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" /></svg>}
        />
      </div>

      {/* ---- Equity curve ---- */}
      <div className="grid-eq">
        <div className="card">
          <div className="card-head">
            <h3>Account Equity Curve</h3>
            <span className="tag">Session</span>
            <div className="spacer" />
            <span className="muted" style={{ fontSize: 11.5 }}>{fmtMoney(lo)} — {fmtMoney(hi)}</span>
          </div>
          <div style={{ height: 170, padding: '14px 8px 8px' }}>
            <AreaChart values={equityHistory} w={1000} h={150} color="#00d68f" id="eqGrad" />
          </div>
        </div>
      </div>

      {/* ---- Watchlist + Mini strength ---- */}
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
                      <td><Sparkline values={p.history} w={100} h={28} color={up ? '#00d68f' : '#ff4d6a'} /></td>
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
            {pick.map((c) => {
              const v = st[c];
              const w = (Math.abs(v) / maxAbs) * 50;
              const pos = v >= 0;
              return (
                <div className="st-row" key={c}>
                  <div className="st-cur">{c}</div>
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
            <button className="btn ghost sm" style={{ width: '100%' }} onClick={() => onViewChange('strength')}>
              Open Strength Meter
            </button>
          </div>
        </div>
      </div>

      {/* ---- Open positions ---- */}
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
  );
}