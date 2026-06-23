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
    background: radial-gradient(ellipse at 20% 30%, #0f0c1f, #03020a);
    color: #f0f3fa;
    scroll-behavior: smooth;
    line-height: 1.5;
  }

  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: #191e2e;
  }
  ::-webkit-scrollbar-thumb {
    background: #f0b90b;
    border-radius: 12px;
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
  0%, 100% { box-shadow: 0 0 20px -5px rgba(240, 185, 11, 0.2); }
  50% { box-shadow: 0 0 30px -5px rgba(240, 185, 11, 0.4); }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

// ===== TOPBAR =====
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 48px;
  background: rgba(10, 14, 23, 0.85);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(240, 185, 11, 0.35);
  position: sticky;
  top: 0;
  z-index: 100;

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
  font-size: 30px;
  filter: drop-shadow(0 0 6px #f0b90b);
`;

const LogoText = styled.h2`
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff, #f0b90b);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
`;

const LiveBadge = styled.div`
  background: #1e1a2f;
  border: 1px solid #f0b90b60;
  padding: 6px 16px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 500;
  color: #fcd34d;
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
    border-color: #f0b90b;
    color: white;
  }
`;

// ===== CONTAINER =====
const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 48px 32px 70px;
  text-align: center;

  @media (max-width: 760px) {
    padding: 30px 20px;
  }
`;

const GlowBadge = styled.div`
  display: inline-flex;
  background: rgba(240, 185, 11, 0.12);
  border: 1px solid rgba(240, 185, 11, 0.4);
  backdrop-filter: blur(4px);
  padding: 8px 24px;
  border-radius: 60px;
  font-size: 13px;
  font-weight: 600;
  color: #facc15;
  letter-spacing: 0.3px;
  margin-bottom: 28px;
  animation: ${pulseGlow} 2s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 68px;
  font-weight: 800;
  background: linear-gradient(125deg, #ffffff 20%, #fcd34d 80%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 16px 0 20px;
  letter-spacing: -1.2px;

  @media (max-width: 760px) {
    font-size: 44px;
  }
`;

const Highlight = styled.span`
  background: linear-gradient(145deg, #f0b90b, #ffd966);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #b9c3dd;
  max-width: 720px;
  margin: 0 auto 36px;
  line-height: 1.6;
`;

// ===== BUTTONS =====
const GoldButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(105deg, #f0b90b, #d48806);
  padding: 14px 34px;
  border-radius: 44px;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  color: #0b0e1a;
  cursor: not-allowed;
  transition: all 0.25s ease;
  box-shadow: 0 10px 20px -5px rgba(240, 185, 11, 0.4);
  text-decoration: none;
  opacity: 0.6;
`;

const ComingSoonTag = styled.span`
  display: inline-block;
  background: #f0b90b20;
  color: #f0b90b;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 20px;
  margin-left: 12px;
  font-weight: 600;
`;

const SignupLink = styled.a`
  color: #facc15;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px dashed #f0b90b;
  transition: 0.2s;

  &:hover {
    color: white;
    border-bottom-color: white;
  }
`;

const AccountSignup = styled.div`
  margin: 22px auto 10px;
  font-size: 14px;
  color: #b4c0e0;
`;

// ===== CRYPTO STATS =====
const CryptoStats = styled.div`
  margin: 50px auto 0;
  max-width: 1000px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 48px;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
  border: 1px solid #2a2e4a;
  backdrop-filter: blur(8px);

  @media (max-width: 760px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const StatItem = styled.div`
  flex: 1;
  text-align: center;
  border-right: 1px solid #2a2e4a;

  &:last-child {
    border-right: none;
  }

  @media (max-width: 760px) {
    border-right: none;
    border-bottom: 1px solid #2a2e4a;
    padding-bottom: 10px;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #9ca3cf;
  letter-spacing: 1px;
`;

const StatValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #facc15;
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
  background: rgba(18, 22, 40, 0.65);
  backdrop-filter: blur(8px);
  padding: 32px 28px;
  width: 320px;
  border-radius: 32px;
  text-align: left;
  border: 1px solid rgba(240, 185, 11, 0.3);
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    border-color: #f0b90b;
    background: rgba(26, 30, 55, 0.85);
    box-shadow: 0 20px 32px -12px rgba(0, 0, 0, 0.6);
  }
`;

const CardIcon = styled.div`
  font-size: 38px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 12px;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff, #fcd34d);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const CardDescription = styled.p`
  color: #b9c8f0;
  line-height: 1.5;
`;

// ===== SENTIMENT =====
const SentimentBox = styled.div`
  margin-top: 40px;
  background: #0f132b80;
  padding: 12px 20px;
  border-radius: 60px;
  font-size: 12px;
  backdrop-filter: blur(8px);
  display: inline-block;
  border: 1px solid #f0b90b30;
  transition: opacity 0.3s ease;
`;

// ===== FOOTER =====
const BinanceFooter = styled.footer`
  margin-top: 80px;
  background: linear-gradient(0deg, #04020f, #0a0820);
  border-top: 1px solid #f0b90b30;
  padding: 52px 36px 32px;
`;

const FooterGrid = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 44px;
  text-align: left;
`;

const FooterCol = styled.div`
  h4 {
    color: #facc15;
    font-size: 1.2rem;
    margin-bottom: 22px;
    font-weight: 700;
    letter-spacing: -0.2px;
    border-left: 3px solid #f0b90b;
    padding-left: 14px;
  }

  p, a {
    font-size: 0.85rem;
    color: #b4c0e0;
    line-height: 1.7;
    text-decoration: none;
    display: block;
    margin-bottom: 10px;
    transition: 0.2s;
  }

  a:hover {
    color: #facc15;
    transform: translateX(5px);
    display: inline-block;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 16px;

  span {
    font-size: 22px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      color: #f0b90b;
      transform: translateY(-3px);
    }
  }
`;

const RiskWarning = styled.div`
  background: #0a0720;
  border-radius: 32px;
  padding: 18px 28px;
  margin-top: 48px;
  font-size: 11px;
  color: #8f9bb5;
  text-align: center;
  border: 1px solid #f0b90b20;
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Binancehome = () => {
  const navigate = useNavigate();
  const [prices, setPrices] = useState({
    btc: 67432,
    eth: 3521,
    bnb: 598,
    volume: 48.2
  });
  const [sentiment, setSentiment] = useState('📊 AI Market Sentiment: 🟢 Bullish on Bitcoin, Neutral on Altcoins');
  const sentimentRef = useRef(null);

  const sentiments = [
    "📊 AI Sentiment: Strong buy signal on ETH/BTC pair",
    "🔮 Short-term volatility expected – hedge mode active",
    "💡 Whale accumulation detected on BNB chain",
    "🔵 High confidence: Layer 2 tokens showing strength",
    "📈 Bullish divergence detected on BTC dominance",
    "🔴 Bearish signal: Altcoin season cooling off"
  ];

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [navigate]);

  // Crypto price feed
  useEffect(() => {
    const priceInterval = setInterval(() => {
      setPrices(prev => {
        let { btc, eth, bnb, volume } = prev;
        
        btc += (Math.random() - 0.5) * 85;
        eth += (Math.random() - 0.5) * 18;
        bnb += (Math.random() - 0.5) * 4.2;
        volume += (Math.random() - 0.5) * 0.7;
        
        btc = Math.max(59000, Math.min(78000, btc));
        eth = Math.max(3100, Math.min(4300, eth));
        bnb = Math.max(510, Math.min(690, bnb));
        volume = Math.max(38, Math.min(68, volume));
        
        return { btc, eth, bnb, volume };
      });
    }, 4200);

    return () => clearInterval(priceInterval);
  }, []);

  // Sentiment rotation
  useEffect(() => {
    const sentimentInterval = setInterval(() => {
      const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      setSentiment(`🧠 ${randomSentiment}`);
    }, 13000);

    return () => clearInterval(sentimentInterval);
  }, [sentiments]);

  // Handle card click
  const handleCardClick = (title) => {
    alert(`🔍 ${title}: This feature will be available when Binance integration is fully released.`);
  };

  // Handle connect button click
  const handleConnect = () => {
    alert('🔗 Binance integration coming soon! Stay tuned for updates.');
  };

  return (
    <>
      <GlobalStyle />

      {/* Topbar */}
      <Topbar>
        <LogoArea>
          <LogoText>🔷Voltix Traders• Binance</LogoText>
        </LogoArea>
        <LiveBadge>🔥 AI Live | 24/7 Markets</LiveBadge>
        <BackButton to="/marketsdash">← Back to Markets</BackButton>
      </Topbar>

      {/* Main Content */}
      <Container>
        <GlowBadge>🤖 Binance Smart AI • Real-time signals</GlowBadge>
        <Title>
          Trade Crypto with <Highlight>AI Precision</Highlight>
        </Title>
        <Subtitle>
          Voltix delivers institutional-grade Binance execution, multi-asset AI scanning, and low-latency order routing — all in one dashboard.
        </Subtitle>

        <GoldButton onClick={handleConnect} disabled>
          🔗 Connect Binance Account → <ComingSoonTag>COMING SOON</ComingSoonTag>
        </GoldButton>

        <AccountSignup>
          🚀 New to crypto? 
          <SignupLink 
            href="https://www.binance.com/en" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Open a Binance account
          </SignupLink>
          — low fees & advanced trading
        </AccountSignup>

        {/* Crypto Stats */}
        <CryptoStats>
          <StatItem>
            <StatLabel>BTC/USDT</StatLabel>
            <StatValue>${prices.btc.toFixed(0)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>ETH/USDT</StatLabel>
            <StatValue>${prices.eth.toFixed(0)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>BNB/USDT</StatLabel>
            <StatValue>${prices.bnb.toFixed(0)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>24h Volume</StatLabel>
            <StatValue>${prices.volume.toFixed(1)}B</StatValue>
          </StatItem>
        </CryptoStats>

        {/* Sentiment Box */}
        <SentimentBox ref={sentimentRef}>
          {sentiment}
        </SentimentBox>

        {/* Feature Cards */}
        <Cards>
          <Card onClick={() => handleCardClick('Smart Order Router')}>
            <CardIcon>🧠</CardIcon>
            <CardTitle>Smart Order Router</CardTitle>
            <CardDescription>
              AI finds best liquidity across spot, futures & margin — minimal slippage.
            </CardDescription>
          </Card>

          <Card onClick={() => handleCardClick('On-chain Alpha')}>
            <CardIcon>📡</CardIcon>
            <CardTitle>On-chain Alpha</CardTitle>
            <CardDescription>
              Real-time whale alerts + sentiment analysis for BTC, ETH, altcoins.
            </CardDescription>
          </Card>

          <Card onClick={() => handleCardClick('Binance API Connect')}>
            <CardIcon>🔐</CardIcon>
            <CardTitle>Binance API Connect</CardTitle>
            <CardDescription>
              Secure OAuth & API key integration, encrypted & read-only by default.
            </CardDescription>
          </Card>
        </Cards>
      </Container>

      {/* Footer */}
      <BinanceFooter>
        <FooterGrid>
          <FooterCol>
            <h4>Voltix Traders</h4>
            <p>AI-driven Binance automation suite</p>
            <p>Smart scalping • Grid trading • DCA bots</p>
            <SocialIcons>
              <span>🐦</span> <span>📘</span> <span>📸</span> <span>💬</span>
            </SocialIcons>
          </FooterCol>
          <FooterCol>
            <h4>📈 Crypto Market</h4>
            <p>Top Gainers: SOL +12% | AVAX +8%</p>
            <p>Fear & Greed Index: 64 (Greed)</p>
            <p>BTC Dominance: 52.3%</p>
            <p>Next halving countdown: 310 days</p>
          </FooterCol>
          <FooterCol>
            <h4>📚 Resources</h4>
            <a href="#">Binance API Guide</a>
            <a href="#">AI Trading Strategies</a>
            <a href="#">Risk management</a>
            <a href="#">Support & Docs</a>
          </FooterCol>
          <FooterCol>
            <h4>⚖️ Legal & Compliance</h4>
            <p>Cryptocurrency trading involves high risk. Only invest what you can lose.</p>
            <p>© 2026 Voltix — Binance Partner</p>
            <a href="#">Terms of service</a>
            <a href="#">Privacy & cookies</a>
          </FooterCol>
        </FooterGrid>
        <RiskWarning>
          🚨 HIGH-RISK WARNING: Trading digital assets carries substantial risk. Past performance does not guarantee future results. AI signals are for informational purposes only. Always DYOR.
        </RiskWarning>
      </BinanceFooter>
    </>
  );
};

// ✅ FIXED: Export matches component name
export default Binancehome;