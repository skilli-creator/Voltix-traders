import { useState, useEffect, useMemo } from 'react';
import {
  CUR_NAMES, INSTRUMENTS,
  fmt, fmtPrice, pipSizeOf, contractOf, usdValueOf,
} from '../pages/forexdash';

export default function LotSize({ pairs, strength, initialPair }) {
  const [balance, setBalance] = useState(25000);
  const [risk, setRisk] = useState(1);
  const [sl, setSl] = useState(25);
  const [pair, setPair] = useState(initialPair);
  const [acctCur, setAcctCur] = useState('USD');
  const [lev, setLev] = useState(100);

  useEffect(() => { setPair(initialPair); }, [initialPair]);

  const result = useMemo(() => {
    const riskAmount = balance * (risk / 100);
    const quote = pair.slice(3, 6);
    const price = pairs[pair].price;
    const pipValQ = pipSizeOf(pair) * contractOf(pair);
    const pipValUSD = pipValQ * usdValueOf(quote, strength);
    const pipValAcct = pipValUSD / usdValueOf(acctCur, strength);
    const lots = sl > 0 && pipValAcct > 0 ? riskAmount / (sl * pipValAcct) : 0;
    const units = lots * contractOf(pair);
    const notionalAcct = (units * price * usdValueOf(quote, strength)) / usdValueOf(acctCur, strength);
    const margin = notionalAcct / lev;
    return { riskAmount, pipValAcct, lots, units, notionalAcct, margin, price };
  }, [balance, risk, sl, pair, acctCur, lev, pairs, strength]);

  const fmtAcct = (n) =>
    acctCur === 'USD'
      ? (n < 0 ? '-$' : '$') + fmt(Math.abs(n), 2)
      : fmt(n, 2) + ' ' + acctCur;

  const perLot = result.pipValAcct * sl;
  const ladder = [
    { t: 'Standard', mult: 1, u: '100,000 units' },
    { t: 'Mini', mult: 0.1, u: '10,000 units' },
    { t: 'Micro', mult: 0.01, u: '1,000 units' },
  ];

  return (
    <section className="view active">
      <div className="grid-2" style={{ gridTemplateColumns: '1fr 1.05fr' }}>
        {/* ---- Inputs ---- */}
        <div className="card">
          <div className="card-head">
            <h3>Position Size Parameters</h3>
            <div className="spacer" />
            <span className="tag">Risk Model</span>
          </div>
          <div style={{ padding: 20 }}>
            <div className="form-grid">
              <div className="field">
                <label>Account Balance</label>
                <div className="input-wrap">
                  <input type="number" value={balance}
                    onChange={(e) => setBalance(parseFloat(e.target.value) || 0)}
                    min="0" step="100" />
                </div>
              </div>

              <div className="field">
                <label>Account Currency</label>
                <select value={acctCur} onChange={(e) => setAcctCur(e.target.value)}>
                  {['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD'].map((c) => (
                    <option key={c} value={c}>{c} — {CUR_NAMES[c]}</option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Risk per Trade</label>
                <div className="input-wrap">
                  <input type="number" value={risk}
                    onChange={(e) => setRisk(parseFloat(e.target.value) || 0)}
                    min="0.01" max="100" step="0.1" />
                  <span className="suffix">%</span>
                </div>
                <div className="chip-row">
                  {[0.5, 1, 2, 3].map((r) => (
                    <button key={r}
                      className={`chip ${risk === r ? 'on' : ''}`}
                      onClick={() => setRisk(r)}>{r}%</button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label>Stop Loss</label>
                <div className="input-wrap">
                  <input type="number" value={sl}
                    onChange={(e) => setSl(parseFloat(e.target.value) || 0)}
                    min="0.1" step="0.5" />
                  <span className="suffix">pips</span>
                </div>
              </div>

              <div className="field full">
                <label>Instrument</label>
                <select value={pair} onChange={(e) => setPair(e.target.value)}>
                  {INSTRUMENTS.map((s) => (
                    <option key={s} value={s}>
                      {s.slice(0, 3)}/{s.slice(3, 6)} — {CUR_NAMES[s.slice(0, 3)]} / {CUR_NAMES[s.slice(3, 6)]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field full">
                <label>Leverage</label>
                <select value={lev} onChange={(e) => setLev(parseFloat(e.target.value))}>
                  <option value="1">1:1 — No leverage</option>
                  <option value="30">1:30</option>
                  <option value="50">1:50</option>
                  <option value="100">1:100</option>
                  <option value="200">1:200</option>
                  <option value="500">1:500</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Results ---- */}
        <div>
          <div className="card">
            <div className="result-hero">
              <div className="lbl">Recommended Position Size</div>
              <div className="big">{fmt(result.lots, 2)}</div>
              <div className="sub">standard lots · {fmt(result.units, 0)} units</div>
            </div>
            <div>
              <div className="res-row"><span className="k">Risk amount</span><span className="v">{fmtAcct(result.riskAmount)}</span></div>
              <div className="res-row"><span className="k">Stop loss distance</span><span className="v">{fmt(sl, 1)} pips</span></div>
              <div className="res-row"><span className="k">Pip value per lot</span><span className="v">{fmtAcct(result.pipValAcct)}</span></div>
              <div className="res-row"><span className="k">Pip value at this size</span><span className="v">{fmtAcct(result.pipValAcct * result.lots)}</span></div>
              <div className="res-row"><span className="k">Notional value</span><span className="v">{fmtAcct(result.notionalAcct)}</span></div>
              <div className="res-row"><span className="k">Margin required (1:{lev})</span><span className="v">{fmtAcct(result.margin)}</span></div>
              <div className="res-row"><span className="k">Live {pair.slice(0, 3)}/{pair.slice(3, 6)} rate</span><span className="v">{fmtPrice(pair, result.price)}</span></div>
            </div>
          </div>

          <div className="card" style={{ marginTop: 15 }}>
            <div className="card-head"><h3>Lot Size Reference</h3></div>
            <div className="lot-ladder">
              {ladder.map((l) => {
                const lotSize = result.lots / l.mult;
                const riskAtSize = perLot * lotSize;
                return (
                  <div className="ladder-item" key={l.t}>
                    <div className="t">{l.t}</div>
                    <div className="n">{fmt(lotSize, l.mult === 1 ? 2 : 1)}</div>
                    <div className="u">{l.u}</div>
                    <div className="u" style={{ marginTop: 6, color: riskAtSize > result.riskAmount * 1.02 ? '#ff4d6a' : '#5a6b88' }}>
                      risk {fmtAcct(riskAtSize)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="notice">
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8h.01M11 12h1v4h1" />
        </svg>
        <span>Pip values are converted to your account currency using live cross rates. Always verify contract specifications with your broker before executing.</span>
      </div>
    </section>
  );
}