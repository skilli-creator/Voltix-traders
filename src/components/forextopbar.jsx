import { fmtMoney } from '../pages/forexdash';

export default function ForexTopbar({ title, subtitle, equity }) {
  return (
    <header className="topbar">
      <div>
        <div className="page-title">{title}</div>
        <div className="page-sub">{subtitle}</div>
      </div>

      <div className="topbar-spacer" />

      <div className="search">
        <svg viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input type="text" placeholder="Search instruments…" />
      </div>

      <div className="market-pill">
        <span className="live-dot" /> Market Open
      </div>

      <div className="acct-chip">
        <div>
          <div className="k">Equity</div>
          <div className="v">{fmtMoney(equity)}</div>
        </div>
      </div>
    </header>
  );
}