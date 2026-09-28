import { fmtMoney } from '../pages/forexdash';

export default function ForexTopbar({ title, subtitle, equity }) {
  return (
    <>
      <style>{`
        .topbar{
          height:66px;flex:none;display:flex;align-items:center;gap:18px;
          padding:0 26px;border-bottom:1px solid var(--border-soft);
          background:rgba(9,15,26,.86);backdrop-filter:blur(14px);
          position:sticky;top:0;z-index:30;
        }
        .page-title{font-size:16.5px;font-weight:600;letter-spacing:-.2px}
        .page-sub{font-size:11.5px;color:var(--dim);margin-top:1px}
        .topbar-spacer{flex:1}
        .search{
          display:flex;align-items:center;gap:9px;background:#0f1829;
          border:1px solid var(--border);border-radius:10px;padding:8px 13px;
          width:240px;transition:.18s;
        }
        .search:focus-within{border-color:#2b4a7a;box-shadow:0 0 0 3px rgba(59,130,246,.1)}
        .search svg{width:15px;height:15px;stroke:var(--dim);fill:none;stroke-width:2}
        .search input{background:none;border:none;outline:none;color:var(--text);font-size:13px;width:100%}
        .search input::placeholder{color:var(--dim)}
        .market-pill{
          display:flex;align-items:center;gap:7px;padding:6px 12px;border-radius:20px;
          background:rgba(0,214,143,.09);border:1px solid rgba(0,214,143,.22);
          font-size:11.5px;font-weight:600;color:var(--green);
        }
        .live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 0 0 rgba(0,214,143,.7);animation:pulse 2s infinite}
        .acct-chip{display:flex;align-items:center;gap:10px;background:#0f1829;border:1px solid var(--border);border-radius:11px;padding:7px 14px}
        .acct-chip .k{font-size:10px;color:var(--dim);text-transform:uppercase;letter-spacing:.8px;font-weight:600}
        .acct-chip .v{font-family:var(--mono);font-size:14px;font-weight:500}

        @media (max-width:860px){
          .topbar{padding:0 14px;gap:10px}
          .search{display:none}
          .page-sub{display:none}
        }
      `}</style>

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
    </>
  );
}