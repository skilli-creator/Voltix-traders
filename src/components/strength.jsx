import { CURRENCIES, PAIRS, fmt, currencyStrength } from '../pages/forexdash';

export default function Strength({ strength }) {
  const st = currencyStrength(strength);
  const sorted = CURRENCIES.slice().sort((a, b) => st[b] - st[a]);
  const maxAbs = Math.max(...CURRENCIES.map((c) => Math.abs(st[c])), 0.05);

  const pairData = PAIRS.map((sym) => {
    const b = sym.slice(0, 3);
    const q = sym.slice(3, 6);
    return { sym, diff: st[b] - st[q] };
  }).sort((a, b) => b.diff - a.diff);

  const row = (d) => (
    <tr key={d.sym}>
      <td><span className="sym-name">{d.sym.slice(0, 3)}/{d.sym.slice(3, 6)}</span></td>
      <td className={`r num ${d.diff >= 0 ? 'pos' : 'neg'}`}>
        {d.diff >= 0 ? '+' : ''}{fmt(d.diff, 2)}%
      </td>
      <td className="r">
        <span className={`side-tag ${d.diff >= 0 ? 'buy' : 'sell'}`}>
          {d.diff >= 0 ? 'LONG' : 'SHORT'}
        </span>
      </td>
    </tr>
  );

  return (
    <section className="view active">
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head">
          <h3>Currency Strength Index</h3>
          <span className="tag">8 Majors</span>
          <div className="spacer" />
          <span className="muted" style={{ fontSize: 11.5 }}>Measured against currency basket · updated live</span>
        </div>
        <div style={{ padding: '14px 0 18px' }}>
          {sorted.map((c) => {
            const v = st[c];
            const w = (Math.abs(v) / maxAbs) * 50;
            const pos = v >= 0;
            return (
              <div className="st-row" key={c}
                style={{ gridTemplateColumns: '54px 1fr 76px', padding: '9px 22px' }}>
                <div className="st-cur" style={{ fontSize: 13 }}>{c}</div>
                <div className="st-track" style={{ height: 26 }}>
                  <div className="st-mid" />
                  <div
                    className={`st-bar ${pos ? 'pos' : 'neg'}`}
                    style={pos ? { left: '50%', width: `${w}%` } : { right: '50%', width: `${w}%` }}
                  />
                </div>
                <div className={`st-val ${pos ? 'pos' : 'neg'}`} style={{ fontSize: 13 }}>
                  {pos ? '+' : ''}{fmt(v, 2)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-head">
            <h3>Strongest Pair Setups</h3>
            <div className="spacer" />
            <span className="tag" style={{ color: 'var(--green)', borderColor: 'rgba(0,214,143,.3)', background: 'rgba(0,214,143,.08)' }}>
              Long bias
            </span>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>Pair</th><th className="r">Strength Δ</th><th className="r">Bias</th></tr>
            </thead>
            <tbody>{pairData.slice(0, 6).map(row)}</tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Weakest Pair Setups</h3>
            <div className="spacer" />
            <span className="tag" style={{ color: 'var(--red)', borderColor: 'rgba(255,77,106,.3)', background: 'rgba(255,77,106,.08)' }}>
              Short bias
            </span>
          </div>
          <table className="tbl">
            <thead>
              <tr><th>Pair</th><th className="r">Strength Δ</th><th className="r">Bias</th></tr>
            </thead>
            <tbody>{pairData.slice(-6).reverse().map(row)}</tbody>
          </table>
        </div>
      </div>

      <div className="notice">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8h.01M11 12h1v4h1" />
        </svg>
        <span>Strength is derived from each currency's performance versus a weighted basket. Wide divergence between the base and quote currency often signals the cleanest trending conditions.</span>
      </div>
    </section>
  );
}