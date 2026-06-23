import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// ============================================
// GLOBAL STYLES
// ============================================
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', 'Poppins', sans-serif;
    background: linear-gradient(145deg, #051a24 0%, #020c14 100%);
    color: #eef5ff;
    line-height: 1.4;
    scroll-behavior: smooth;
  }

  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: #092c3b;
  }
  ::-webkit-scrollbar-thumb {
    background: #2dd4bf;
    border-radius: 20px;
  }
`;

// ============================================
// KEYFRAMES
// ============================================
const fadeSlideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 2px 10px rgba(45,212,191,0.2); }
  50% { box-shadow: 0 2px 20px rgba(45,212,191,0.4); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

// ===== TOPBAR =====
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 48px;
  background: rgba(2, 20, 30, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(45, 212, 191, 0.3);
  position: sticky;
  top: 0;
  z-index: 99;

  @media (max-width: 760px) {
    padding: 14px 24px;
    flex-wrap: wrap;
    gap: 10px;
  }
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.span`
  font-size: 32px;
  filter: drop-shadow(0 0 5px #2dd4bf);
`;

const LogoText = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  background: linear-gradient(120deg, #cffafe, #2dd4bf);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
`;

const MarketBadge = styled.div`
  background: #0b2b2f;
  padding: 8px 18px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  color: #99f6e4;
  border: 1px solid #2dd4bf40;
  backdrop-filter: blur(4px);
`;

const BackButton = styled(Link)`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 40px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #cbd5e1;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;

  &:hover {
    background: #2d3a5e;
    border-color: #2dd4bf;
    color: white;
  }
`;

// ===== CONTAINER =====
const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 32px 60px;
  text-align: center;

  @media (max-width: 760px) {
    padding: 30px 20px;
  }
`;

const GlassPulse = styled.div`
  display: inline-block;
  background: linear-gradient(95deg, #0f2c38, #08212b);
  padding: 6px 22px;
  border-radius: 60px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #5eead4;
  margin-bottom: 28px;
  border: 1px solid #2dd4bf66;
  animation: ${pulseGlow} 2s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 64px;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff, #b0f3e8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 16px 0 20px;
  letter-spacing: -1px;

  @media (max-width: 760px) {
    font-size: 42px;
  }
`;

const Highlight = styled.span`
  background: linear-gradient(145deg, #2dd4bf, #38bdf8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #b9d9e6;
  max-width: 720px;
  margin: 0 auto 32px;
  line-height: 1.5;
`;

// ===== BUTTONS =====
const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(115deg, #0f766e, #14b8a6);
  padding: 14px 32px;
  border-radius: 60px;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  color: white;
  cursor: not-allowed;
  transition: all 0.25s ease;
  box-shadow: 0 8px 18px rgba(20, 184, 166, 0.3);
  text-decoration: none;
  opacity: 0.6;
`;

const ComingSoonTag = styled.span`
  display: inline-block;
  background: #2dd4bf20;
  color: #2dd4bf;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  margin-left: 12px;
  font-weight: 600;
`;

const SignupLink = styled.a`
  color: #5eead4;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px dashed #2dd4bf;
  transition: 0.2s;

  &:hover {
    color: white;
    border-bottom-color: white;
  }
`;

const AccountSignup = styled.div`
  margin: 24px auto 10px;
  font-size: 14px;
  color: #b9d9e6;
`;

// ===== TICKER =====
const ForexNewsTicker = styled.div`
  background: #06212b;
  border-radius: 60px;
  padding: 12px 24px;
  margin: 48px auto 0;
  max-width: 900px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  border: 1px solid #2dd4bf40;

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
`;

const TickerLabel = styled.span`
  font-weight: 700;
  background: #115e59;
  padding: 4px 14px;
  border-radius: 40px;
  font-size: 13px;
`;

const TickerText = styled.span`
  font-weight: 500;
  color: #ccfbf1;
  font-size: 14px;
`;

const CurrencyPair = styled.span`
  background: #0a2f38;
  padding: 5px 12px;
  border-radius: 24px;
  font-family: monospace;
  font-weight: bold;
  color: #2dd4bf;
`;

// ===== CARDS =====
const Cards = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 70px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Card = styled.div`
  background: rgba(8, 33, 43, 0.7);
  backdrop-filter: blur(6px);
  padding: 32px 24px;
  width: 310px;
  border-radius: 32px;
  text-align: left;
  border: 1px solid rgba(45, 212, 191, 0.25);
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.2);
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    border-color: #2dd4bf;
    background: #0a2d38cc;
    box-shadow: 0 20px 30px -12px rgba(0, 0, 0, 0.5);
  }
`;

const CardIcon = styled.div`
  font-size: 40px;
  margin-bottom: 18px;
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 12px;
  font-weight: 600;
  background: linear-gradient(145deg, #f0fdfa, #b4f0e3);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const CardDescription = styled.p`
  color: #bbdfed;
  line-height: 1.45;
`;

// ===== FOOTER =====
const ForexFooter = styled.footer`
  margin-top: 80px;
  background: radial-gradient(ellipse at 50% 0%, #03161e, #010a0f);
  border-top: 1px solid #2dd4bf30;
  padding: 48px 32px 32px;
  border-radius: 48px 48px 0 0;
`;

const FooterGrid = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 40px;
  text-align: left;
`;

const FooterCol = styled.div`
  h4 {
    color: #5eead4;
    font-size: 1.2rem;
    margin-bottom: 20px;
    font-weight: 600;
    letter-spacing: -0.3px;
    border-left: 3px solid #2dd4bf;
    padding-left: 14px;
  }

  p, a {
    font-size: 0.85rem;
    color: #a5d8e6;
    line-height: 1.6;
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
    transition: 0.2s;
  }

  a:hover {
    color: #2dd4bf;
    transform: translateX(4px);
    display: inline-block;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 22px;
  margin-top: 16px;

  span {
    font-size: 22px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      color: #2dd4bf;
      transform: scale(1.1);
    }
  }
`;

const RiskWarning = styled.div`
  background: #0b2027;
  border-radius: 28px;
  padding: 16px 24px;
  margin-top: 40px;
  font-size: 11px;
  color: #7d9eaa;
  text-align: center;
  border: 1px solid #2c5a5f;
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Forexhome = () => {
  const navigate = useNavigate();
  const [tickerPairs, setTickerPairs] = useState([
    { name: 'EUR/USD', base: 1.0892, vol: 0.0003 },
    { name: 'GBP/JPY', base: 191.52, vol: 0.38 }
  ]);
  const [spread, setSpread] = useState('0.0 pips');
  const spreads = ['0.1 pips', '0.2 pips', '0.0 pips', '0.3 pips'];

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [navigate]);

  // Forex ticker update
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setTickerPairs(prev => {
        const updated = prev.map(pair => {
          const newVal = pair.base + (Math.random() - 0.5) * pair.vol;
          return {
            ...pair,
            base: parseFloat(newVal.toFixed(pair.name === 'EUR/USD' ? 5 : 2))
          };
        });
        return updated;
      });
    }, 3800);

    return () => clearInterval(tickerInterval);
  }, []);

  // Spread rotation
  useEffect(() => {
    const spreadInterval = setInterval(() => {
      const randomSpread = spreads[Math.floor(Math.random() * spreads.length)];
      setSpread(randomSpread);
    }, 9000);

    return () => clearInterval(spreadInterval);
  }, [spreads]);

  // Handle card click
  const handleCardClick = (title) => {
    alert(`🔍 ${title} feature: Available when Forex integration launches.`);
  };

  // Handle connect button click
  const handleConnect = () => {
    alert('🔗 Forex integration coming soon! Stay tuned for updates.');
  };

  return (
    <>
      <GlobalStyle />

      {/* Topbar */}
      <Topbar>
        <LogoArea>
          <LogoText>🔷Voltix Traders.Forex</LogoText>
        </LogoArea>
        <MarketBadge>📈 Forex | Crypto | Indices</MarketBadge>
        <BackButton to="/marketsdash">← Back to Markets</BackButton>
      </Topbar>

      {/* Main Content */}
      <Container>
        <GlassPulse>🤖 AI-Powered Forex Precision • Real-time Liquidity</GlassPulse>
        <Title>
          Dominate Forex with <Highlight>Adaptive AI</Highlight>
        </Title>
        <Subtitle>
          Voltix delivers institutional-grade signals, multi-contract execution, and deep FX market intelligence — all in one dashboard.
        </Subtitle>

        <PrimaryButton onClick={handleConnect} disabled>
          🔗 Connect Forex Account → <ComingSoonTag>COMING SOON</ComingSoonTag>
        </PrimaryButton>

        <AccountSignup>
          🚀 New to forex? 
          <SignupLink 
            href="https://www.exness.com/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Open real/pro demo account
          </SignupLink>
          — fast execution & tight spreads
        </AccountSignup>

        {/* Live Ticker */}
        <ForexNewsTicker>
          <TickerLabel>💱 LIVE SPOT</TickerLabel>
          <TickerText>
            {tickerPairs[0]?.name}: {tickerPairs[0]?.base.toFixed(5)}
          </TickerText>
          <TickerText>
            {tickerPairs[1]?.name}: {tickerPairs[1]?.base.toFixed(2)}
          </TickerText>
          <CurrencyPair>🔥 Spreads from {spread}</CurrencyPair>
        </ForexNewsTicker>

        {/* Feature Cards */}
        <Cards>
          <Card onClick={() => handleCardClick('Smart Liquidity Engine')}>
            <CardIcon>🌊</CardIcon>
            <CardTitle>Smart Liquidity Engine</CardTitle>
            <CardDescription>
              Aggregates top-tier forex liquidity & minimizes slippage during high-impact news.
            </CardDescription>
          </Card>

          <Card onClick={() => handleCardClick('AI Regime Detector')}>
            <CardIcon>📊</CardIcon>
            <CardTitle>AI Regime Detector</CardTitle>
            <CardDescription>
              Identifies trend, range, or breakout zones with 84% accuracy on major pairs.
            </CardDescription>
          </Card>

          <Card onClick={() => handleCardClick('One-Click OAuth')}>
            <CardIcon>🔐</CardIcon>
            <CardTitle>One-Click OAuth</CardTitle>
            <CardDescription>
              Connect your broker (Exness, Deriv, Pepperstone) without API tokens — secure & instant.
            </CardDescription>
          </Card>
        </Cards>
      </Container>

      {/* Footer */}
      <ForexFooter>
        <FooterGrid>
          <FooterCol>
            <h4>Voltix Traders</h4>
            <p>Next-gen Forex signal automation</p>
            <p>Smart order routing • AI pattern recognition • Low latency execution</p>
            <SocialIcons>
              <span>📘</span> <span>🐦</span> <span>📸</span> <span>💼</span>
            </SocialIcons>
          </FooterCol>
          <FooterCol>
            <h4>💱 Market Hours</h4>
            <p>🇬🇧 London: 08:00 - 17:00 GMT</p>
            <p>🇺🇸 New York: 13:00 - 22:00 GMT</p>
            <p>🇯🇵 Tokyo: 00:00 - 09:00 GMT</p>
            <p>🇦🇺 Sydney: 22:00 - 07:00 GMT</p>
          </FooterCol>
          <FooterCol>
            <h4>📰 Forex Insights</h4>
            <a href="#">NFP Impact Analysis</a>
            <a href="#">Interest rate forecasts</a>
            <a href="#">Gold & USD correlation</a>
            <a href="#">Volatility outlook</a>
          </FooterCol>
          <FooterCol>
            <h4>⚖️ Legal & Risk</h4>
            <p>CFDs are complex instruments. 74-89% of retail accounts lose money. Trade responsibly.</p>
            <p>© 2026 Voltix — AI Forex Intelligence</p>
            <a href="#">Privacy policy</a>
            <a href="#">Risk disclosure</a>
          </FooterCol>
        </FooterGrid>
        <RiskWarning>
          ⚠️ HIGH RISK WARNING: Forex and CFD trading involves substantial risk of loss. Past performance is not indicative of future results. The AI signals are for educational & informational purposes only. Always consult a financial advisor.
        </RiskWarning>
      </ForexFooter>
    </>
  );
};

// ✅ FIXED: Export matches component name
export default Forexhome;