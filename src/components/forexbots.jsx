import { fmt, fmtMoney, Sparkline, StatCard } from '../pages/forexdash';

export default function ForexBots({ bots, onToggleBot }) {
  const active = bots.filter((b) => b.on).length;
  const totalPL = bots.reduce((s, b) => s + b.pnl, 0);
  const avgWin = bots.reduce((s, b) => s + b.winRate, 0) / bots.length;
  const totalTrades = bots.reduce((s, b) => s + b.trades, 0);

  return (
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
  );
}