// src/pages/forexdash.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ForexTopbar from '../components/TopBar';   // ← use the TopBar above
import ForexHome from '../components/forexhome';
import LotSize from '../components/lotsize';
import Strength from '../components/strength';
import ForexBots from '../components/forexbots';

/* ... keep ALL the existing helpers & constants exports unchanged ... */

const PAGE_META = {
  home:     ['Dashboard',               'Live market overview & account summary'],
  lot:      ['Lot Size Calculator',     'Risk-based position sizing across all instruments'],
  strength: ['Currency Strength Meter', 'Relative strength of the 8 major currencies'],
  bots:     ['Trading Bots',            'Automated strategies running on your account'],
};

export default function ForexDash() {
  const { view: urlView } = useParams();
  const navigate = useNavigate();
  const view = urlView || 'home';

  // ... all your existing state (strength, pairs, account, positions, etc.)
  const [strength, setStrength] = useState(createInitialStrength);
  const [pairs, setPairs] = useState(() => createInitialPairs(strength));
  const [account] = useState({ balance: 25000, currency: 'USD' });
  const [positions, setPositions] = useState([
    { sym: 'EURUSD', side: 'buy',  lots: 0.5, entry: 1.0821  },
    { sym: 'GBPJPY', side: 'sell', lots: 0.2, entry: 189.45  },
    { sym: 'XAUUSD', side: 'buy',  lots: 0.1, entry: 2028.4  },
  ]);
  const [equityHistory, setEquityHistory] = useState(() => createInitialEquityHistory(25000));
  const [bots, setBots] = useState(createInitialBots);
  const [selectedPair, setSelectedPair] = useState('EURUSD');

  // ... all your existing effects (market sim, repricing, equity, bots)

  const onTrade = useCallback((sym) => {
    setSelectedPair(sym);
    navigate('/forexdash/lot');
  }, [navigate]);

  const onClosePosition = useCallback((index) => {
    setPositions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onToggleBot = useCallback((id) => {
    setBots((prev) => prev.map((b) => (b.id === id ? { ...b, on: !b.on } : b)));
  }, []);

  const meta = PAGE_META[view] || PAGE_META.home;
  const equity = account.balance + totalPL(positions, pairs, strength);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg, #070c16)' }}>
      <ForexTopbar title={meta[0]} subtitle={meta[1]} equity={equity} />

      <div className="content" style={{ padding: '24px 26px 60px' }}>
        {view === 'home' && (
          <ForexHome
            pairs={pairs}
            positions={positions}
            account={account}
            equityHistory={equityHistory}
            strength={strength}
            onTrade={onTrade}
            onClosePosition={onClosePosition}
            onViewChange={(v) => navigate(v === 'home' ? '/forexdash' : `/forexdash/${v}`)}
          />
        )}
        {view === 'lot'      && <LotSize  pairs={pairs} strength={strength} initialPair={selectedPair} />}
        {view === 'strength' && <Strength strength={strength} />}
        {view === 'bots'     && <ForexBots bots={bots} onToggleBot={onToggleBot} />}
      </div>
    </div>
  );
}