// src/pages/Terms.jsx

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ===== ANIMATIONS =====
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ===== STYLED COMPONENTS =====
const PageContainer = styled.div`
  min-height: calc(100vh - 48px);
  background: ${props => props.theme?.colors?.background || '#0a0e17'};
  padding: 40px 24px;
  display: flex;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 768px) {
    padding: 20px 16px;
    min-height: calc(100vh - 56px);
  }

  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

const ContentWrapper = styled.div`
  max-width: 900px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 16px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  .icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: ${props => `linear-gradient(135deg, ${props.theme?.colors?.accent || '#2962ff'}, ${props.theme?.colors?.accent + 'dd' || '#1a4fcf'})`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: ${props => props.theme?.colors?.text || '#ffffff'};
    box-shadow: 0 4px 20px ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.15)'};
  }

  .title-group {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .title {
    font-size: 24px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    letter-spacing: -0.5px;
  }

  .version {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
    padding: 2px 10px;
    border-radius: 12px;
    border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  }

  @media (max-width: 768px) {
    .icon { width: 40px; height: 40px; font-size: 20px; }
    .title { font-size: 20px; }
    .version { font-size: 10px; }
  }

  @media (max-width: 480px) {
    .icon { width: 36px; height: 36px; font-size: 18px; }
    .title { font-size: 18px; }
    .version { font-size: 9px; padding: 1px 8px; }
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  border-radius: 8px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.accent || '#2962ff'};
    background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)'};
    color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    transform: translateX(-2px);
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const LastUpdated = styled.div`
  font-size: 12px;
  color: ${props => props.theme?.colors?.textMuted || '#64748b'};
  margin-bottom: 24px;
  padding: 8px 16px;
  background: ${props => props.theme?.colors?.backgroundSecondary || 'rgba(255,255,255,0.02)'};
  border-radius: 8px;
  border: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  display: inline-block;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 12px;
    margin-bottom: 20px;
  }
`;

const Section = styled.div`
  margin-bottom: 28px;
  animation: ${slideDown} 0.4s ease;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.text || '#f1f5f9'};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  .number {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.accent || '#2962ff'};
    background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)'};
    padding: 1px 10px;
    border-radius: 6px;
    border: 2px solid ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.1)'};
  }

  @media (max-width: 768px) {
    font-size: 16px;
    .number { font-size: 11px; padding: 1px 8px; }
  }

  @media (max-width: 480px) {
    font-size: 14px;
    .number { font-size: 10px; padding: 0 6px; }
  }
`;

const SectionContent = styled.div`
  p {
    font-size: 13px;
    line-height: 1.8;
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    margin-bottom: 10px;
    font-weight: 700;

    strong {
      color: ${props => props.theme?.colors?.text || '#f1f5f9'};
    }

    &:last-child { margin-bottom: 0; }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 8px 0 12px 0;

    li {
      font-size: 13px;
      line-height: 1.8;
      color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
      padding: 4px 0 4px 24px;
      position: relative;
      font-weight: 700;

      &::before {
        content: '▸';
        position: absolute;
        left: 4px;
        color: ${props => props.theme?.colors?.accent || '#2962ff'};
        font-weight: 700;
      }

      strong {
        color: ${props => props.theme?.colors?.text || '#f1f5f9'};
        font-weight: 700;
      }
    }
  }

  .highlight-box {
    padding: 14px 18px;
    background: ${props => props.theme?.colors?.accentActive || 'rgba(41,98,255,0.06)'};
    border: 2px solid ${props => props.theme?.colors?.accent + '30' || 'rgba(41,98,255,0.1)'};
    border-radius: 8px;
    margin: 12px 0;

    p {
      margin-bottom: 0;
      color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
      font-weight: 700;
    }

    strong {
      color: ${props => props.theme?.colors?.accent || '#2962ff'};
      font-weight: 700;
    }
  }

  .warning-box {
    padding: 14px 18px;
    background: ${props => props.theme?.colors?.danger + '15' || 'rgba(239,68,68,0.06)'};
    border: 2px solid ${props => props.theme?.colors?.danger + '30' || 'rgba(239,68,68,0.1)'};
    border-radius: 8px;
    margin: 12px 0;

    p {
      margin-bottom: 0;
      color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
      font-weight: 700;
    }

    strong {
      color: ${props => props.theme?.colors?.danger || '#ef4444'};
      font-weight: 700;
    }
  }

  @media (max-width: 768px) {
    p { font-size: 12px; }
    ul li { font-size: 12px; }
    .highlight-box { padding: 12px 14px; }
    .warning-box { padding: 12px 14px; }
  }

  @media (max-width: 480px) {
    p { font-size: 11px; }
    ul li { font-size: 11px; padding: 3px 0 3px 20px; }
    .highlight-box { padding: 10px 12px; }
    .warning-box { padding: 10px 12px; }
  }
`;

const Footer = styled.div`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 2px solid ${props => props.theme?.colors?.border || 'rgba(255,255,255,0.06)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;

  .copyright {
    font-size: 12px;
    color: ${props => props.theme?.colors?.textMuted || '#64748b'};
    font-weight: 700;
  }

  .links {
    display: flex;
    gap: 16px;

    a {
      font-size: 12px;
      color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
      text-decoration: none;
      font-weight: 700;
      transition: color 0.2s ease;

      &:hover {
        color: ${props => props.theme?.colors?.accent || '#2962ff'};
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-top: 32px;
    padding-top: 16px;

    .copyright { font-size: 11px; }
    .links a { font-size: 11px; }
  }
`;

// ===== MAIN COMPONENT =====
const Terms = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
          <HeaderLeft>
            <div className="icon">⚖️</div>
            <div className="title-group">
              <span className="title">Terms and Conditions</span>
              <span className="version">v2.0</span>
            </div>
          </HeaderLeft>
          <BackButton onClick={() => navigate(-1)}>
            ← Back
          </BackButton>
        </Header>

        <LastUpdated>📅 Last Updated: July 20, 2026</LastUpdated>

        {/* Section 1 */}
        <Section delay="0.05s">
          <SectionTitle>
            <span className="number">1</span>
            Introduction
          </SectionTitle>
          <SectionContent>
            <p>
              Welcome to <strong>Voltix Traders</strong>. By using our third-party trading application 
              ("the App"), you agree to these Terms and Conditions. Please read them carefully 
              before using the App.
            </p>
            <div className="highlight-box">
              <p>
                <strong>📌 Important:</strong> Voltix Traders is a third-party application that connects 
                to Deriv and Forex trading platforms via APIs. We are not affiliated with or endorsed 
                by Deriv or any Forex provider.
              </p>
            </div>
          </SectionContent>
        </Section>

        {/* Section 2 */}
        <Section delay="0.10s">
          <SectionTitle>
            <span className="number">2</span>
            Acceptance of Terms
          </SectionTitle>
          <SectionContent>
            <p>
              By accessing or using Voltix Traders, you confirm that you have read, understood, 
              and agree to be bound by these Terms. If you do not agree with any part of these 
              terms, you must not use the App.
            </p>
            <ul>
              <li>You must be at least <strong>18 years old</strong> to use this App.</li>
              <li>You are <strong>solely responsible</strong> for all trading decisions made through the App.</li>
              <li>You acknowledge that trading involves <strong>significant financial risk</strong>.</li>
            </ul>
          </SectionContent>
        </Section>

        {/* Section 3 */}
        <Section delay="0.15s">
          <SectionTitle>
            <span className="number">3</span>
            Services Provided
          </SectionTitle>
          <SectionContent>
            <p>Voltix Traders provides the following services:</p>
            <ul>
              <li><strong>Automated Trading</strong> — Execute trades based on predefined strategies and bots.</li>
              <li><strong>AI-Assisted Trading</strong> — Receive AI-powered analysis and recommendations.</li>
              <li><strong>Manual Trading</strong> — Execute trades manually with real-time market data.</li>
              <li><strong>Bot Trading</strong> — Deploy trading bots to automate your strategies.</li>
              <li><strong>Real-Time Data</strong> — Access live market data from Deriv and Forex via APIs.</li>
            </ul>
            <div className="highlight-box">
              <p>
                <strong>📊 Data Disclaimer:</strong> All market data provided is sourced from third-party 
                APIs and may contain delays or inaccuracies. Always verify data independently.
              </p>
            </div>
          </SectionContent>
        </Section>

        {/* Section 4 */}
        <Section delay="0.20s">
          <SectionTitle>
            <span className="number">4</span>
            Account Responsibility
          </SectionTitle>
          <SectionContent>
            <p>
              You are responsible for maintaining the security of your Deriv and Forex trading 
              accounts. Voltix Traders does not store your login credentials.
            </p>
            <ul>
              <li>You are <strong>fully responsible</strong> for all trades executed through the App.</li>
              <li>You must <strong>not share</strong> your trading credentials with anyone.</li>
              <li>You are responsible for <strong>all financial losses</strong> incurred through the App.</li>
              <li>You must comply with all <strong>Deriv and Forex terms</strong> and regulations.</li>
            </ul>
            <div className="warning-box">
              <p>
                <strong>⚠️ Risk Warning:</strong> Trading carries a high level of risk and may result 
                in the loss of all your invested capital. Only trade with funds you can afford to lose.
              </p>
            </div>
          </SectionContent>
        </Section>

        {/* Section 5 */}
        <Section delay="0.25s">
          <SectionTitle>
            <span className="number">5</span>
            Payment and Fees
          </SectionTitle>
          <SectionContent>
            <p>
              Voltix Traders may charge fees for premium features, bot usage, or AI-assisted 
              trading services. All fees are clearly displayed before any charges are applied.
            </p>
            <ul>
              <li>All payments are processed through <strong>secure third-party payment gateways</strong>.</li>
              <li>Fees are <strong>non-refundable</strong> unless otherwise specified.</li>
              <li>You are responsible for all <strong>trading fees</strong> charged by Deriv or Forex brokers.</li>
              <li>Voltix Traders reserves the right to <strong>modify fees</strong> with prior notice.</li>
            </ul>
          </SectionContent>
        </Section>

        {/* Section 6 */}
        <Section delay="0.30s">
          <SectionTitle>
            <span className="number">6</span>
            Intellectual Property
          </SectionTitle>
          <SectionContent>
            <p>
              All content, features, and functionality of Voltix Traders are the exclusive property 
              of Voltix Traders and are protected by intellectual property laws.
            </p>
            <ul>
              <li>The App's <strong>code, design, and algorithms</strong> are proprietary.</li>
              <li>You may not <strong>copy, modify, or distribute</strong> any part of the App.</li>
              <li>All <strong>trademarks and logos</strong> displayed are the property of their respective owners.</li>
              <li>You may not <strong>reverse engineer</strong> or decompile the App.</li>
            </ul>
          </SectionContent>
        </Section>

        {/* Section 7 */}
        <Section delay="0.35s">
          <SectionTitle>
            <span className="number">7</span>
            Prohibited Activities
          </SectionTitle>
          <SectionContent>
            <p>When using Voltix Traders, you agree not to engage in any prohibited activities:</p>
            <ul>
              <li><strong>Illegal Trading</strong> — Using the App for any unlawful activities.</li>
              <li><strong>Market Manipulation</strong> — Any form of market manipulation or fraud.</li>
              <li><strong>Unauthorized Access</strong> — Attempting to gain unauthorized access to systems.</li>
              <li><strong>Abuse of Bots</strong> — Using bots in ways that harm platform performance.</li>
              <li><strong>Spam or Harassment</strong> — Sending unsolicited messages or harassing others.</li>
            </ul>
          </SectionContent>
        </Section>

        {/* Section 8 */}
        <Section delay="0.40s">
          <SectionTitle>
            <span className="number">8</span>
            Termination
          </SectionTitle>
          <SectionContent>
            <p>
              Voltix Traders reserves the right to terminate or suspend your access to the App 
              at any time, without prior notice, for any reason.
            </p>
            <ul>
              <li>Termination may occur for <strong>violation of these Terms</strong>.</li>
              <li>You may also <strong>terminate your account</strong> at any time by contacting support.</li>
              <li>Upon termination, all <strong>bot configurations and data</strong> may be permanently deleted.</li>
            </ul>
          </SectionContent>
        </Section>

        {/* Section 9 */}
        <Section delay="0.45s">
          <SectionTitle>
            <span className="number">9</span>
            Limitation of Liability
          </SectionTitle>
          <SectionContent>
            <p>Voltix Traders provides the App "as is" without any warranties. To the fullest extent permitted by law:</p>
            <ul>
              <li>We are <strong>not liable</strong> for any financial losses incurred through the App.</li>
              <li>We are <strong>not responsible</strong> for any technical issues or downtime.</li>
              <li>We <strong>do not guarantee</strong> the accuracy of market data provided.</li>
              <li>We are <strong>not liable</strong> for any damages arising from your use of the App.</li>
            </ul>
            <div className="warning-box">
              <p>
                <strong>📉 Financial Risk:</strong> You acknowledge that all trading decisions are your 
                own and that Voltix Traders is not responsible for your trading outcomes.
              </p>
            </div>
          </SectionContent>
        </Section>

        {/* Section 10 */}
        <Section delay="0.50s">
          <SectionTitle>
            <span className="number">10</span>
            Indemnification
          </SectionTitle>
          <SectionContent>
            <p>
              You agree to indemnify and hold Voltix Traders harmless from any claims, damages, 
              losses, or expenses arising from your use of the App or violation of these Terms.
            </p>
            <ul>
              <li>This includes <strong>legal fees and costs</strong> incurred by Voltix Traders.</li>
              <li>You are responsible for all <strong>trading-related liabilities</strong>.</li>
              <li>We reserve the right to <strong>assume defense</strong> of any claim.</li>
            </ul>
          </SectionContent>
        </Section>

        {/* Section 11 */}
        <Section delay="0.55s">
          <SectionTitle>
            <span className="number">11</span>
            Third-Party Services
          </SectionTitle>
          <SectionContent>
            <p>Voltix Traders integrates with third-party services including:</p>
            <ul>
              <li><strong>Deriv</strong> — Trading platform for synthetic indices and forex.</li>
              <li><strong>Forex Brokers</strong> — External forex trading providers.</li>
              <li><strong>API Providers</strong> — Market data and connectivity services.</li>
            </ul>
            <p>
              We are not responsible for the terms, practices, or performance of these third-party 
              services. Your use of these services is subject to their respective terms.
            </p>
          </SectionContent>
        </Section>

        {/* Section 12 */}
        <Section delay="0.60s">
          <SectionTitle>
            <span className="number">12</span>
            Privacy Policy
          </SectionTitle>
          <SectionContent>
            <p>
              Your privacy matters to us. By using Voltix Traders, you agree to our Privacy Policy, 
              which outlines how we collect, use, and protect your data.
            </p>
            <ul>
              <li>We <strong>do not store</strong> your Deriv or Forex login credentials.</li>
              <li>We collect <strong>minimal data</strong> necessary for app functionality.</li>
              <li>We use <strong>encryption</strong> to protect your data in transit.</li>
              <li>We <strong>never sell</strong> your personal data to third parties.</li>
            </ul>
            <div className="highlight-box">
              <p>
                <strong>🔒 Data Security:</strong> We implement industry-standard security measures 
                to protect your information. However, no method of transmission is 100% secure.
              </p>
            </div>
          </SectionContent>
        </Section>

        {/* Section 13 */}
        <Section delay="0.65s">
          <SectionTitle>
            <span className="number">13</span>
            Changes to Terms
          </SectionTitle>
          <SectionContent>
            <p>
              Voltix Traders reserves the right to update or modify these Terms at any time. 
              We will notify you of significant changes through:
            </p>
            <ul>
              <li>In-app notifications</li>
              <li>Email notifications (if subscribed)</li>
              <li>Updated version date on this page</li>
            </ul>
            <p>
              Your continued use of the App after changes constitutes acceptance of the updated Terms.
            </p>
          </SectionContent>
        </Section>

        {/* Section 14 */}
        <Section delay="0.70s">
          <SectionTitle>
            <span className="number">14</span>
            Governing Law
          </SectionTitle>
          <SectionContent>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the 
              jurisdiction where Voltix Traders operates. Any disputes shall be resolved in the 
              competent courts of that jurisdiction.
            </p>
            <ul>
              <li><strong>Venue:</strong> All legal actions shall be brought in the appropriate courts.</li>
              <li><strong>Severability:</strong> If any provision is invalid, the remainder shall remain enforceable.</li>
              <li><strong>Waiver:</strong> Failure to enforce any provision does not constitute a waiver.</li>
            </ul>
          </SectionContent>
        </Section>

        {/* Section 15 */}
        <Section delay="0.75s">
          <SectionTitle>
            <span className="number">15</span>
            Contact Us
          </SectionTitle>
          <SectionContent>
            <p>If you have any questions, concerns, or feedback about these Terms, please contact us:</p>
            <div className="highlight-box">
              <p>
                <strong>📧 Email:</strong> support@voltixtraders.com<br />
                <strong>🌐 Website:</strong> www.voltixtraders.com<br />
                <strong>📱 In-App Support:</strong> Available 24/7 via the app
              </p>
            </div>
          </SectionContent>
        </Section>

        <Footer>
          <div className="copyright">
            © {new Date().getFullYear()} Voltix Traders. All rights reserved.
          </div>
          <div className="links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/responsible-trading">Responsible Trading</a>
          </div>
        </Footer>
      </ContentWrapper>
    </PageContainer>
  );
};

export default Terms;