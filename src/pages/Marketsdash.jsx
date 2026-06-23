import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
    background: radial-gradient(ellipse at 30% 20%, #0c1a2f, #03050c);
    color: #f0f4ff;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
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

const pulseEffect = keyframes`
  0% { opacity: 0.8; transform: scale(0.95); }
  100% { opacity: 0; transform: scale(1.2); }
`;

const shimmer = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

// ============================================
// STYLED COMPONENTS
// ============================================

// Background overlay
const BackgroundOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px);
  background-size: 40px 40px;
  pointer-events: none;
  z-index: 0;
`;

// ===== TOPBAR =====
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 48px;
  background: rgba(3, 10, 25, 0.75);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.25);
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 680px) {
    padding: 14px 20px;
    flex-direction: column;
    gap: 12px;
  }
`;

const Brand = styled.div`
  h2 {
    font-size: 1.7rem;
    font-weight: 800;
    background: linear-gradient(135deg, #ffffff, #38bdf8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: -0.5px;
  }
`;

const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(15, 30, 55, 0.6);
  padding: 6px 18px;
  border-radius: 60px;
  backdrop-filter: blur(4px);
`;

const Greeting = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #cbd5e6;
`;

const ProfilePic = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #38bdf8;
  object-fit: cover;
  background: #1e293b;
`;

const LogoutButton = styled.button`
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 6px 14px;
  border-radius: 40px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    color: white;
  }
`;

// ===== CONTAINER =====
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 80px;
  position: relative;
  z-index: 2;
`;

// ===== WELCOME BANNER =====
const WelcomeBanner = styled.div`
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(56, 189, 248, 0.1));
  border-radius: 20px;
  padding: 20px 30px;
  margin-bottom: 30px;
  text-align: center;
  border: 1px solid rgba(56, 189, 248, 0.2);

  h3 {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }

  p {
    color: #9ca3af;
  }
`;

// ===== SLOGAN =====
const Slogan = styled.div`
  text-align: center;
  font-size: 1.3rem;
  font-weight: 500;
  background: linear-gradient(120deg, #e2e8f0, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 16px;
  letter-spacing: -0.2px;
  animation: ${fadeSlideUp} 0.6s ease;
  transition: opacity 0.3s ease;
`;

const MarketIntro = styled.div`
  text-align: center;
  margin: 20px 0 40px;
  font-size: 1rem;
  color: #9ca9cc;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 500;
`;

// ===== MARKET GRID =====
const MarketContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MarketGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 280px);
  gap: 38px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 280px);
    gap: 30px;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const MarketCard = styled.div`
  background: linear-gradient(145deg, #0a142e, #050e1f);
  border-radius: 28px;
  padding: 42px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  border: 1px solid rgba(56, 189, 248, 0.2);
  box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-10px) scale(1.02);
    border-color: #38bdf8;
    box-shadow: 0 30px 45px -15px rgba(56, 189, 248, 0.3);
    background: linear-gradient(145deg, #11203f, #07112a);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MarketIcon = styled.div`
  font-size: 52px;
  margin-bottom: 20px;
  display: inline-block;
  transition: 0.2s;
`;

const MarketTitle = styled.div`
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 12px;
  background: linear-gradient(135deg, #ffffff, #b9e0ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const MarketDesc = styled.div`
  color: #9ca3cf;
  font-size: 14px;
  line-height: 1.5;
`;

// ===== STATS TICKER =====
const StatsTicker = styled.div`
  margin-top: 55px;
  background: rgba(5, 15, 30, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 60px;
  padding: 14px 24px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  border: 1px solid #38bdf830;

  @media (max-width: 680px) {
    flex-direction: column;
    gap: 12px;
    border-radius: 32px;
  }
`;

const StatBlock = styled.div`
  flex: 1;
  text-align: center;

  @media (max-width: 680px) {
    border-bottom: 1px solid #1e2f4e;
    padding-bottom: 8px;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const StatLabel = styled.div`
  font-size: 11px;
  color: #7e8bb3;
  letter-spacing: 1px;
`;

const StatNumber = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #38bdf8;
`;

// ===== FOOTER =====
const PremiumFooter = styled.footer`
  margin-top: 70px;
  background: linear-gradient(0deg, #020617, #030816);
  border-top: 1px solid #1e2f4e;
  padding: 44px 32px 28px;
  position: relative;
  z-index: 2;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 40px;
  text-align: left;
`;

const FooterCol = styled.div`
  h4 {
    color: #38bdf8;
    font-size: 1.1rem;
    margin-bottom: 20px;
    font-weight: 600;
    border-left: 3px solid #38bdf8;
    padding-left: 12px;
  }

  p, a {
    font-size: 0.8rem;
    color: #9aa9c9;
    line-height: 1.7;
    text-decoration: none;
    display: block;
    margin-bottom: 8px;
    transition: 0.2s;
  }

  a:hover {
    color: #38bdf8;
    transform: translateX(5px);
    display: inline-block;
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 12px;

  span {
    font-size: 20px;
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      color: #38bdf8;
      transform: translateY(-3px);
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #1e2a44;
  font-size: 12px;
  color: #5f6e97;
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('Trader');
  const [quote, setQuote] = useState('"Trade Smart. Stay Disciplined. Let the Market Reward Your Patience."');
  const [volume, setVolume] = useState(187.4);
  const [signals, setSignals] = useState(142);
  const [users, setUsers] = useState(2847);
  const [timestamp, setTimestamp] = useState('');
  const quoteIndexRef = useRef(0);

  const quotes = [
    '"Trade Smart. Stay Disciplined. Let the Market Reward Your Patience."',
    '"The trend is your friend until the end."',
    '"Risk management is the cornerstone of survival."',
    '"Let your profits run, cut your losses short."',
    '"Emotions are the enemy of good trading."'
  ];

  // ✅ FIXED: No process.env needed in this component (no API calls)
  // All good here!

  // Get user data from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
      navigate('/login');
      return;
    }

    setUser(userData);
    const firstName = userData.first_name || '';
    const lastName = userData.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Trader';
    setGreeting(fullName);
  }, [navigate]);

  // Dynamic stats updater
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setVolume(prev => {
        let newVol = prev + (Math.random() - 0.5) * 2.4;
        return Math.max(165, Math.min(220, newVol));
      });
      setSignals(prev => {
        let newSignals = prev + Math.floor(Math.random() * 5) - 1;
        return Math.max(120, Math.min(320, newSignals));
      });
      setUsers(prev => {
        let newUsers = prev + Math.floor(Math.random() * 7) - 2;
        return Math.max(2500, Math.min(3600, newUsers));
      });
    }, 5500);

    return () => clearInterval(statsInterval);
  }, []);

  // Timestamp updater
  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      setTimestamp(`🕒 ${now.toUTCString().slice(5, 25)} UTC`);
    };
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rotate quotes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      quoteIndexRef.current = (quoteIndexRef.current + 1) % quotes.length;
      const quoteElement = document.getElementById('animatedQuote');
      if (quoteElement) {
        quoteElement.style.opacity = '0';
        setTimeout(() => {
          setQuote(quotes[quoteIndexRef.current]);
          quoteElement.style.opacity = '1';
        }, 200);
      }
    }, 7000);

    return () => clearInterval(quoteInterval);
  }, [quotes]);

  // Handle market navigation
  const openMarket = (market, e) => {
    const card = e.currentTarget;
    const btnEffect = document.createElement('div');
    btnEffect.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(56,189,248,0.4) 0%, transparent 70%);
      top: 0;
      left: 0;
      border-radius: 28px;
      pointer-events: none;
      animation: pulseEffect 0.4s ease-out;
    `;
    card.style.position = 'relative';
    card.appendChild(btnEffect);
    setTimeout(() => btnEffect.remove(), 400);

    setTimeout(() => {
      if (market === 'deriv') navigate('/derivhome');
      else if (market === 'binance') navigate('/binancehome');
      else if (market === 'forex') navigate('/forexhome');
    }, 120);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Get avatar URL
  const getAvatarUrl = () => {
    if (user?.email) {
      const email = user.email.trim().toLowerCase();
      // Using a simple hash for avatar
      let hash = 0;
      for (let i = 0; i < email.length; i++) {
        hash = email.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hex = (hash & 0xFFFFFFFF).toString(16);
      return `https://www.gravatar.com/avatar/${hex}?s=200&d=identicon`;
    }
    return 'https://www.gravatar.com/avatar/?s=200&d=identicon';
  };

  return (
    <>
      <GlobalStyle />
      <BackgroundOverlay />

      {/* Topbar */}
      <Topbar>
        <Brand>
          <h2>🔷Voltix Traders</h2>
        </Brand>
        <ProfileArea>
          <Greeting>Hi 👋 {greeting}</Greeting>
          <ProfilePic src={getAvatarUrl()} alt="Profile" />
          <LogoutButton onClick={handleLogout}>🚪 Logout</LogoutButton>
        </ProfileArea>
      </Topbar>

      {/* Main Content */}
      <Container>
        <WelcomeBanner>
          <h3>Welcome back, <span style={{ color: '#38bdf8' }}>{greeting}</span>! 👋</h3>
          <p>Your AI-powered trading terminal is ready. Select a market to begin.</p>
        </WelcomeBanner>

        <Slogan id="animatedQuote">{quote}</Slogan>
        <MarketIntro>🔵 SELECT YOUR TRADING ARENA 🔵</MarketIntro>

        <MarketContainer>
          <MarketGrid>
            <MarketCard onClick={(e) => openMarket('deriv', e)}>
              <MarketIcon>📊</MarketIcon>
              <MarketTitle>Deriv</MarketTitle>
              <MarketDesc>Synthetic indices • Options • High-frequency</MarketDesc>
            </MarketCard>

            <MarketCard onClick={(e) => openMarket('binance', e)}>
              <MarketIcon>₿</MarketIcon>
              <MarketTitle>Binance</MarketTitle>
              <MarketDesc>Spot • Futures • 350+ crypto pairs</MarketDesc>
            </MarketCard>

            <MarketCard onClick={(e) => openMarket('forex', e)}>
              <MarketIcon>💱</MarketIcon>
              <MarketTitle>Forex</MarketTitle>
              <MarketDesc>Major, minor & exotic currency pairs</MarketDesc>
            </MarketCard>
          </MarketGrid>
        </MarketContainer>

        {/* Stats Ticker */}
        <StatsTicker>
          <StatBlock>
            <StatLabel>🌍 TOTAL VOLUME (24H)</StatLabel>
            <StatNumber>${volume.toFixed(1)}B</StatNumber>
          </StatBlock>
          <StatBlock>
            <StatLabel>📈 ACTIVE MARKETS</StatLabel>
            <StatNumber>3</StatNumber>
          </StatBlock>
          <StatBlock>
            <StatLabel>🔵 AI SIGNALS TODAY</StatLabel>
            <StatNumber>{signals}</StatNumber>
          </StatBlock>
          <StatBlock>
            <StatLabel>🔗 CONNECTED USERS</StatLabel>
            <StatNumber>{users.toLocaleString()}</StatNumber>
          </StatBlock>
        </StatsTicker>
      </Container>

      {/* Footer */}
      <PremiumFooter>
        <FooterContent>
          <FooterCol>
            <h4>🔷Voltix Traders</h4>
            <p>Next-gen multi-market execution engine</p>
            <p>Smart order routing • AI predictive models • Risk management</p>
            <SocialIcons>
              <span>🐦</span> <span>📘</span> <span>💼</span> <span>📸</span>
            </SocialIcons>
          </FooterCol>
          <FooterCol>
            <h4>📊 Market Hours</h4>
            <p>Forex: 24/5 (Sun 22:00 - Fri 22:00 GMT)</p>
            <p>Crypto: 24/7 perpetual</p>
            <p>Deriv: 24/7 synthetic indices</p>
          </FooterCol>
          <FooterCol>
            <h4>📚 Resources</h4>
            <a href="#">API Documentation</a>
            <a href="#">Trading guides</a>
            <a href="#">Risk disclosure</a>
            <a href="#">Support center</a>
          </FooterCol>
          <FooterCol>
            <h4>⚖️ Legal & Compliance</h4>
            <p>CFDs and crypto trading involve high risk. 74-89% of retail traders lose money.</p>
            <p>© 2026 Voltix — All rights reserved</p>
            <a href="#">Privacy policy</a>
            <a href="#">Terms of service</a>
          </FooterCol>
        </FooterContent>
        <FooterBottom>
          {timestamp} • Trade responsibly • AI insights for educational purposes only
        </FooterBottom>
      </PremiumFooter>

      {/* Add pulseEffect animation */}
      <style>
        {`
          @keyframes pulseEffect {
            0% { opacity: 0.8; transform: scale(0.95); }
            100% { opacity: 0; transform: scale(1.2); }
          }
        `}
      </style>
    </>
  );
};

export default Dashboard;