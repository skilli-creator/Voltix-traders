import { fmt, fmtMoney, Sparkline, StatCard } from '../pages/forexdash';

export default function ForexBots({ bots, onToggleBot }) {
  const active = bots.filter((b) => b.on).length;
  const totalPL = bots.reduce((s, b) => s + b.pnl, 0);
  const avgWin = bots.reduce((s, b) => s + b.winRate, 0) / bots.length;
  const totalTrades = bots.reduce((s, b) => s + b.trades, 0);

  return (
    <>
      <style>{`
        .bots-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:15px;margin-bottom:18px}
        .bots-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:15px}
        .bot-card{
          background:linear-gradient(180deg,#0f1829 0%,#0d1524 100%);
          border:1px solid var(--border-soft);border-radius:var(--radius);
          padding:17px;transition:.2s;position:relative;overflow:hidden;
        }
        .bot-card:hover{border-color:#243550;transform:translateY(-2px);box-shadow:0 10px 30px rgba(0,0,0,.35)}
        .bot-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--bot-color,#00d68f);opacity:.7}
        .bot-head{display:flex;align-items:flex-start;gap:12px;margin-bottom:15px}
        .bot-avatar{
          width:40px;height:40px;border-radius:11px;flex:none;display:grid;place-items:center;
          font-size:13px;font-weight:700;letter-spacing:-.3px;
          background:linear-gradient(135deg,var(--bot-color,#00d68f),rgba(0,0,0,.25));
          color:#04150f;
        }
        .bot-id{flex:1;min-width:0}
        .bot-name{font-size:14px;font-weight:600;display:flex;align-items:center;gap:7px;letter-spacing:-.2px}
        .bot-sub{font-size:11px;color:var(--dim);margin-top:2px}
        .dot{width:6px;height:6px;border-radius:50%;flex:none}
        .dot.on{background:var(--green);box-shadow:0 0 8px rgba(0,214,143,.7);animation:pulse 2s infinite}
        .dot.off{background:#3d4c66}
        .bot-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:14px}
        .bot-stats .k{font-size:10px;color:var(--dim);text-transform:uppercase;letter-spacing:.7px;font-weight:600;display:block;margin-bottom:3px}
        .bot-stats .v{font-family:var(--mono);font-size:13.5px;font-weight:500}
        .bot-spark{height:44px;margin:0 -4px 14px;opacity:.95}
        .bot-foot{display:flex;align-items:center;justify-content:space-between;padding-top:13px;border-top:1px solid var(--border-soft)}
        .switch{
          width:42px;height:23px;border-radius:20px;background:#1d2a44;position:relative;
          transition:.22s;flex:none;border:1px solid var(--border);
        }
        .switch::after{
          content:'';position:absolute;top:2px;left:2px;width:17px;height:17px;border-radius:50%;
          background:#5a6b88;transition:.22s cubic-bezier(.4,0,.2,1);
        }
        .switch.on{background:rgba(0,214,143,.22);border-color:rgba(0,214,143,.45)}
        .switch.on::after{left:21px;background:var(--green);box-shadow:0 0 10px rgba(0,214,143,.6)}

        @media (max-width:1180px){ .bots-summary{grid-template-columns:repeat(2,1fr)} }
        @media (max-width:860px){
          .bots-grid{grid-template-columns:1fr}
          .bots-summary{grid-template-columns:1fr 1fr}
        }
      `}</style>

      <section className="view active">
        <div className="bots-summary">
          <StatCard label="Active Bots" value={`${active} / ${bots.length}`} sub="Automated strategies" accent="#00d68f" />
          <StatCard
            label="Combined P/L"
            value={(totalPL >= 0 ? '+' : '') + fmtMoney(totalPL)}
            valueClass={totalPL >= 0 ? 'pos' : 'neg'}
            sub="Since inception"
            accent="#3b82f6"
          />
          <StatCard label="Avg Win Rate" value={`${fmt(avgWin, 1)}%`} sub="Across all strategies" accent="#f5a524" />
          <StatCard label="Total Trades" value={totalTrades.toLocaleString('en-US')} sub="Executed orders" accent="#a855f7" />
        </div>

        <div className="bots-grid">
          {bots.map((b) => {
            const initials = b.name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
            const up = b.pnl >= 0;
            return (
              <div className="bot-card" key={b.id} style={{ '--bot-color': b.color }}>
                <div className="bot-head">
                  <div className="bot-avatar">{initials}</div>
                  <div className="bot-id">
                    <div className="bot-name">
                      {b.name}
                      <span className={`dot ${b.on ? 'on' : 'off'}`} />
                    </div>
                    <div className="bot-sub">
                      {b.tag} · {b.sym.slice(0, 3)}/{b.sym.slice(3, 6)} {b.tf}
                    </div>
                  </div>
                  <button
                    className={`switch ${b.on ? 'on' : ''}`}
                    onClick={() => onToggleBot(b.id)}
                    aria-label="Toggle bot"
                  />
                </div>

                <div className="bot-stats">
                  <div>
                    <span className="k">P/L</span>
                    <span className={`v ${up ? 'pos' : 'neg'}`}>{up ? '+' : ''}{fmtMoney(b.pnl)}</span>
                  </div>
                  <div>
                    <span className="k">Win rate</span>
                    <span className="v">{fmt(b.winRate, 1)}%</span>
                  </div>
                  <div>
                    <span className="k">Trades</span>
                    <span className="v">{b.trades.toLocaleString('en-US')}</span>
                  </div>
                </div>

                <div className="bot-spark">
                  <Sparkline values={b.history} w={300} h={44} color={up ? '#00d68f' : '#ff4d6a'} />
                </div>

                <div className="bot-foot">
                  <span
                    className="tag"
                    style={b.on ? { color: '#00d68f', borderColor: 'rgba(0,214,143,.3)', background: 'rgba(0,214,143,.08)' } : {}}
                  >
                    {b.on ? 'Running' : 'Stopped'}
                  </span>
                  <span className="muted" style={{ fontSize: 11 }}>Max DD {b.dd}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="notice">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          <span>Bots run in paper-trading mode. Past performance is not indicative of future results — always backtest and forward-test on a demo account first.</span>
        </div>
      </section>
    </>
  );
}