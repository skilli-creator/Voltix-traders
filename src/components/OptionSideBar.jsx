// src/components/OptionSideBar.jsx
import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────────
// Base: deep navy #060d1f
// Surface: #0c1628
// Card: #0f1e35
// Border: rgba(56,189,248,0.08) — sky-glass
// Accent: #38bdf8 (sky-400) + #818cf8 (indigo-400)
// Success: #22c55e | Danger: #f87171
// Text: #f1f5f9 / #94a3b8 / #475569
// Signature: left-edge gradient bar that morphs from accent to indigo per section

// ─────────────────────────────────────────────────
// KEYFRAMES
// ─────────────────────────────────────────────────
const slideFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-16px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const modalIn = keyframes`
  from { opacity: 0; transform: scale(0.94) translateY(32px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
`;

const backdropIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const pulseDot = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(248, 113, 113, 0.5); }
  50%       { box-shadow: 0 0 0 5px rgba(248, 113, 113, 0);  }
`;

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

// ─────────────────────────────────────────────────
// SVG ICONS — clean, consistent 20×20
// ─────────────────────────────────────────────────
const Icon = ({ d, d2, circle, viewBox = "0 0 24 24", poly, line1, line2, rect, path2, path3, path4 }) => (
  <svg width="17" height="17" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {circle && <circle {...circle} />}
    {rect   && <rect {...rect} />}
    {d      && <path d={d} />}
    {d2     && <path d={d2} />}
    {path2  && <path d={path2} />}
    {path3  && <path d={path3} />}
    {path4  && <path d={path4} />}
    {poly   && <polyline points={poly} />}
    {line1  && <line {...line1} />}
    {line2  && <line {...line2} />}
  </svg>
);

const BellIcon       = () => <Icon d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" d2="M13.73 21a2 2 0 0 1-3.46 0" />;
const VoiceIcon      = () => <Icon d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" poly="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />;
const VoiceOffIcon   = () => <Icon poly="11 5 6 9 2 9 2 15 6 15 11 19 11 5" line1={{x1:23,y1:9,x2:17,y2:15}} line2={{x1:17,y1:9,x2:23,y2:15}} />;
const AcademyIcon    = () => <Icon d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />;
const AccountIcon    = () => <Icon d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" circle={{cx:12,cy:7,r:4}} />;
const CopyIcon       = () => <Icon rect={{x:9,y:9,width:13,height:13,rx:2}} d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />;
const ManagementIcon = () => <Icon rect={{x:2,y:7,width:20,height:14,rx:2}} d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />;
const RiskIcon       = () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" d2="M12 8v4M12 16h.01" />;
const ShieldIcon     = () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />;
const BookIcon       = () => <Icon d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" d2="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />;
const TermsIcon      = () => <Icon d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" poly="14 2 14 8 20 8" line1={{x1:16,y1:13,x2:8,y2:13}} line2={{x1:16,y1:17,x2:8,y2:17}} />;
const SettingsIcon   = () => <Icon circle={{cx:12,cy:12,r:3}} d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9z" />;
const HelpIcon       = () => <Icon circle={{cx:12,cy:12,r:10}} d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" line1={{x1:12,y1:17,x2:12.01,y2:17}} />;
const CloseIcon      = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─────────────────────────────────────────────────
// MODAL SYSTEM
// ─────────────────────────────────────────────────
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.8);
  backdrop-filter: blur(18px);
  z-index: 1000;
  display: ${p => p.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${backdropIn} 0.25s ease;
`;

const ModalBox = styled.div`
  width: 100%;
  max-width: 500px;
  max-height: 82vh;
  background: #0c1628;
  border: 1px solid rgba(56, 189, 248, 0.12);
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 0 0 0.5px rgba(255,255,255,0.04) inset,
    0 28px 72px rgba(0, 0, 0, 0.7);
  animation: ${modalIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;

  /* SIGNATURE: shimmering gradient top bar */
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      #38bdf8 0%, #818cf8 50%, #38bdf8 100%
    );
    background-size: 200% 100%;
    animation: ${shimmer} 4s linear infinite;
    border-radius: 18px 18px 0 0;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    border-radius: 14px;
    max-height: 88vh;
  }
`;

const ModalHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 14px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  flex-shrink: 0;

  .mh-left {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .mh-icon {
    width: 34px; height: 34px;
    border-radius: 9px;
    background: rgba(56,189,248,0.08);
    border: 1px solid rgba(56,189,248,0.15);
    display: flex; align-items: center; justify-content: center;
    color: #38bdf8;
    flex-shrink: 0;
  }

  .mh-title {
    font-size: 14.5px;
    font-weight: 700;
    color: #f1f5f9;
    letter-spacing: -0.2px;
  }

  .mh-badge {
    font-size: 9px;
    font-weight: 700;
    padding: 2px 9px;
    border-radius: 99px;
    background: rgba(56,189,248,0.08);
    color: #38bdf8;
    border: 1px solid rgba(56,189,248,0.2);
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .mh-close {
    width: 30px; height: 30px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.06);
    background: transparent;
    color: #475569;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: rgba(248,113,113,0.08);
      border-color: rgba(248,113,113,0.25);
      color: #f87171;
      transform: rotate(90deg);
    }
  }

  @media (max-width: 480px) {
    padding: 13px 16px 11px;
    .mh-title { font-size: 13px; }
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 20px;
  
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(56,189,248,0.15);
    border-radius: 10px;
  }

  @media (max-width: 480px) { padding: 12px 14px 16px; }
`;

// ─────────────────────────────────────────────────
// SIDEBAR SHELL
// ─────────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.65);
  backdrop-filter: blur(6px);
  z-index: 98;
  opacity: ${p => p.isOpen ? 1 : 0};
  visibility: ${p => p.isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
  @media (min-width: 769px) { display: none; }
`;

const SidebarWrap = styled.aside`
  position: fixed;
  top: 0; left: 0;
  width: 268px;
  height: 100vh;
  /* Deep navy glass */
  background: rgba(6, 13, 31, 0.97);
  border-right: 1px solid rgba(56, 189, 248, 0.09);
  box-shadow:
    6px 0 32px rgba(0,0,0,0.45),
    0 0 0 0.5px rgba(255,255,255,0.03) inset;
  transform: ${p => p.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* SIGNATURE: vertical gradient left edge */
  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(
      180deg,
      transparent    0%,
      #38bdf8       25%,
      #818cf8       65%,
      transparent  100%
    );
    opacity: 0.6;
  }

  @media (max-width: 768px) { width: 280px; }
  @media (max-width: 480px) { width: 100%; }
`;

const CloseBtn = styled.button`
  display: none;
  position: absolute;
  top: 12px; right: 12px;
  z-index: 1;
  width: 30px; height: 30px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.03);
  color: #475569;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(248,113,113,0.08);
    border-color: rgba(248,113,113,0.3);
    color: #f87171;
  }

  @media (max-width: 768px) {
    display: ${p => p.isOpen ? 'flex' : 'none'};
  }
`;

const SidebarScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0 10px 16px;
  display: flex;
  flex-direction: column;
  gap: 0;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb {
    background: rgba(56,189,248,0.1);
    border-radius: 99px;
  }
`;

// ─────────────────────────────────────────────────
// SIDEBAR HEADER
// ─────────────────────────────────────────────────
const SideHead = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 20px 6px 16px 8px;
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  animation: ${slideFromLeft} 0.35s ease;
  position: relative;
`;

const Avatar = styled.div`
  width: 38px; height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1e3a5f 0%, #0f2541 100%);
  border: 1px solid rgba(56,189,248,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #38bdf8;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  box-shadow: 0 0 18px rgba(56,189,248,0.1);
`;

const UserMeta = styled.div`
  flex: 1;
  min-width: 0;

  .user-name {
    font-size: 13px;
    font-weight: 700;
    color: #e2e8f0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.1px;
  }

  .user-email {
    font-size: 10.5px;
    color: #334155;
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }
`;

const StatusDot = styled.span`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(34,197,94,0.6);
`;

// ─────────────────────────────────────────────────
// NAV SECTIONS
// ─────────────────────────────────────────────────
const Section = styled.div`
  margin-top: 20px;
  animation: ${slideFromLeft} ${p => p.delay || 0.3}s ease;
`;

const SectionEyebrow = styled.div`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1e3a5f;
  padding: 0 8px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.04);
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 8px 10px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.18s ease;
  position: relative;
  color: ${p => p.active ? '#38bdf8' : '#475569'};
  background: ${p => p.active ? 'rgba(56,189,248,0.06)' : 'transparent'};
  margin-bottom: 1px;
  font-size: 12.5px;
  font-weight: ${p => p.active ? '600' : '500'};

  &:hover {
    background: rgba(56,189,248,0.05);
    color: #94a3b8;
    transform: translateX(2px);
  }

  /* Active left indicator */
  ${p => p.active && css`
    &::before {
      content: '';
      position: absolute;
      left: -10px; top: 50%;
      transform: translateY(-50%);
      width: 3px; height: 16px;
      background: linear-gradient(180deg, #38bdf8, #818cf8);
      border-radius: 0 3px 3px 0;
    }
  `}

  .ni-icon {
    width: 16px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    opacity: ${p => p.active ? 1 : 0.55};
    transition: opacity 0.18s;
  }

  &:hover .ni-icon { opacity: 0.8; }

  .ni-label {
    flex: 1;
    font-size: 12.5px;
    font-weight: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// ─────────────────────────────────────────────────
// BADGES
// ─────────────────────────────────────────────────
const Badge = styled.span`
  font-size: 8.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  flex-shrink: 0;

  ${p => p.variant === 'accent' && css`
    background: rgba(56,189,248,0.1);
    color: #38bdf8;
    border: 1px solid rgba(56,189,248,0.2);
  `}
  ${p => p.variant === 'new' && css`
    background: rgba(129,140,248,0.1);
    color: #818cf8;
    border: 1px solid rgba(129,140,248,0.2);
  `}
  ${p => p.variant === 'beta' && css`
    background: rgba(251,191,36,0.08);
    color: #fbbf24;
    border: 1px solid rgba(251,191,36,0.18);
  `}
  ${p => p.variant === 'on' && css`
    background: rgba(34,197,94,0.08);
    color: #22c55e;
    border: 1px solid rgba(34,197,94,0.18);
  `}
  ${p => p.variant === 'off' && css`
    background: rgba(248,113,113,0.08);
    color: #f87171;
    border: 1px solid rgba(248,113,113,0.18);
  `}
  ${p => !p.variant && css`
    background: rgba(255,255,255,0.04);
    color: #334155;
    border: 1px solid rgba(255,255,255,0.06);
  `}
`;

const NotifDot = styled.span`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #f87171;
  flex-shrink: 0;
  animation: ${pulseDot} 2s infinite;
`;

// ─────────────────────────────────────────────────
// INFO CARDS (Responsible Trading, About)
// ─────────────────────────────────────────────────
const InfoCard = styled.div`
  margin-top: 6px;
  padding: 11px 13px;
  background: rgba(15, 30, 53, 0.5);
  border: 1px solid rgba(56,189,248,0.08);
  border-radius: 10px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: rgba(56,189,248,0.18);
  }

  .ic-title {
    font-size: 11.5px;
    font-weight: 600;
    color: #94a3b8;
    margin-bottom: 7px;
    display: flex;
    align-items: center;
    gap: 7px;
    color: #64748b;
  }

  .ic-item {
    font-size: 10.5px;
    color: #334155;
    padding: 2px 0;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    line-height: 1.5;

    .bullet { color: #1e3a5f; font-weight: 700; flex-shrink: 0; }
    .hi { color: #64748b; font-weight: 600; }
  }

  .ic-link {
    margin-top: 8px;
    font-size: 10.5px;
    color: #38bdf8;
    cursor: pointer;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    opacity: 0.7;
    transition: all 0.2s ease;

    &:hover { opacity: 1; gap: 7px; }
  }
`;

// ─────────────────────────────────────────────────
// FEEDBACK
// ─────────────────────────────────────────────────
const FeedbackCard = styled.div`
  margin-top: 6px;
  padding: 12px 13px;
  background: rgba(15, 30, 53, 0.5);
  border: 1px solid rgba(56,189,248,0.08);
  border-radius: 10px;

  .fb-label {
    font-size: 10px;
    font-weight: 600;
    color: #334155;
    text-align: center;
    margin-bottom: 9px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .stars {
    display: flex;
    gap: 5px;
    justify-content: center;
    margin-bottom: 7px;
  }

  .star {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    color: rgba(255,255,255,0.1);
    transition: all 0.15s ease;
    display: flex;
    align-items: center;

    svg { width: 20px; height: 20px; fill: currentColor; }
    &:hover { transform: scale(1.2); }
    &.lit { color: #fbbf24; filter: drop-shadow(0 0 5px rgba(251,191,36,0.35)); }
  }

  .star-label {
    font-size: 10.5px;
    text-align: center;
    color: #334155;
    margin-bottom: 9px;
    min-height: 14px;
    font-weight: 500;
  }

  textarea {
    width: 100%;
    min-height: 60px;
    padding: 8px 10px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 8px;
    color: #94a3b8;
    font-size: 11.5px;
    font-family: inherit;
    resize: none;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 9px;
    box-sizing: border-box;

    &::placeholder { color: #1e3a5f; }
    &:focus { border-color: rgba(56,189,248,0.25); }
  }

  .fb-submit {
    width: 100%;
    padding: 8px 0;
    border: none;
    border-radius: 8px;
    background: linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15));
    border: 1px solid rgba(56,189,248,0.2);
    color: #38bdf8;
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;

    &:hover:not(:disabled) {
      background: linear-gradient(135deg, rgba(56,189,248,0.22), rgba(129,140,248,0.22));
    }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  }

  .fb-status {
    margin-top: 7px;
    font-size: 10.5px;
    text-align: center;
    color: #22c55e;
    font-weight: 500;
  }
`;

// ─────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────
const SideFooter = styled.footer`
  flex-shrink: 0;
  padding: 10px 10px;
  border-top: 1px solid rgba(255,255,255,0.04);
  background: rgba(3,7,18,0.5);
  display: flex;
  gap: 3px;
`;

const FooterBtn = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 8px 6px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
  color: #334155;
  font-size: 11px;
  font-weight: 500;

  &:hover {
    background: rgba(56,189,248,0.05);
    color: #64748b;
  }

  .fi { display: flex; align-items: center; justify-content: center; }
`;

// ─────────────────────────────────────────────────
// MODAL CONTENT PIECES
// ─────────────────────────────────────────────────

// — Notifications —
const NotifItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  background: ${p => p.read ? 'transparent' : 'rgba(56,189,248,0.04)'};
  border: 1px solid ${p => p.read ? 'transparent' : 'rgba(56,189,248,0.1)'};
  margin-bottom: 4px;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.02); }

  .ni-icon {
    width: 28px; height: 28px;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 13px;
    background: ${p => p.type === 'trade' ? 'rgba(34,197,94,0.08)' : 'rgba(56,189,248,0.08)'};
    color: ${p => p.type === 'trade' ? '#22c55e' : '#38bdf8'};
  }

  .ni-content { flex: 1; min-width: 0; }
  .ni-title   { font-size: 12px; font-weight: 600; color: #e2e8f0; margin-bottom: 2px; }
  .ni-desc    { font-size: 11px; color: #475569; line-height: 1.4; font-weight: 400; }
  .ni-time    { font-size: 9.5px; color: #1e3a5f; margin-top: 3px; font-weight: 400; font-family: monospace; }
  .ni-dot     { width: 6px; height: 6px; border-radius: 50%; background: #38bdf8; flex-shrink: 0; margin-top: 4px; ${p => p.read && 'display:none;'} }
`;

// — Voice —
const VoiceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 11px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 8px;
  margin-bottom: 7px;

  .vr-label { font-size: 12px; font-weight: 600; color: #94a3b8; }
  .vr-right { display: flex; align-items: center; gap: 8px; }
  .vr-status {
    font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 99px;
    color: ${p => p.active ? '#22c55e' : '#475569'};
    background: ${p => p.active ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.02)'};
  }
`;

const Toggle = styled.button`
  width: 36px; height: 20px;
  border-radius: 10px;
  border: none;
  background: ${p => p.on ? 'linear-gradient(135deg, #38bdf8, #818cf8)' : '#1e2d42'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${p => p.on ? '18px' : '2px'};
    width: 16px; height: 16px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
`;

const VolumeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 11px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 8px;
  margin-bottom: 7px;

  .vv-label { font-size: 11px; font-weight: 600; color: #475569; min-width: 24px; }

  input[type="range"] {
    flex: 1;
    -webkit-appearance: none;
    height: 3px;
    border-radius: 2px;
    background: #1e2d42;
    outline: none;
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 13px; height: 13px;
      border-radius: 50%;
      background: #38bdf8;
      cursor: pointer;
      box-shadow: 0 0 6px rgba(56,189,248,0.4);
    }
    &:disabled { opacity: 0.3; }
  }

  .vv-val { font-size: 11px; font-weight: 700; color: #64748b; min-width: 28px; text-align: right; font-family: monospace; }
`;

const VoiceEvent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 2px;
  border-bottom: 1px solid rgba(255,255,255,0.02);
  &:last-child { border-bottom: none; }

  .ve-name {
    font-size: 11.5px;
    font-weight: 500;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 7px;
    .ve-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: ${p => p.on ? '#22c55e' : '#1e2d42'};
      transition: background 0.2s;
    }
  }

  .ve-toggle {
    font-size: 9px; font-weight: 700;
    padding: 2px 9px;
    border-radius: 99px;
    cursor: pointer;
    transition: all 0.18s;
    color: ${p => p.on ? '#22c55e' : '#334155'};
    background: ${p => p.on ? 'rgba(34,197,94,0.07)' : 'rgba(255,255,255,0.02)'};
    border: 1px solid ${p => p.on ? 'rgba(34,197,94,0.18)' : 'rgba(255,255,255,0.05)'};
    &:hover { opacity: 0.7; }
  }
`;

// — Account Info —
const AcctRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  &:last-child { border-bottom: none; }

  .ar-label { font-size: 11px; font-weight: 600; color: #334155; }
  .ar-val {
    font-size: 12px; font-weight: 700; color: #94a3b8;
    display: flex; align-items: center; gap: 7px;
  }
  .ar-live {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 11px; font-weight: 700; color: #22c55e;
    .dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 6px rgba(34,197,94,0.6); }
  }
`;

// — Risk Calculator —
const CalcGroup = styled.div`
  margin-bottom: 11px;

  .cg-label {
    font-size: 9.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #334155;
    margin-bottom: 5px;
    display: flex; align-items: center; gap: 6px;
    .cg-hint { font-size: 9px; font-weight: 400; opacity: 0.5; text-transform: none; }
  }

  .cg-wrap {
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    overflow: hidden;
    transition: border-color 0.2s;

    &:focus-within { border-color: rgba(56,189,248,0.3); box-shadow: 0 0 0 3px rgba(56,189,248,0.06); }

    .cg-pre {
      padding: 8px 10px;
      font-size: 11px;
      font-weight: 700;
      color: #334155;
      background: rgba(255,255,255,0.02);
      border-right: 1px solid rgba(255,255,255,0.04);
      min-width: 18px;
      text-align: center;
      font-family: monospace;
    }

    input {
      flex: 1; padding: 8px 10px;
      background: transparent; border: none;
      color: #94a3b8; font-size: 12.5px; font-weight: 600;
      outline: none; width: 100%; min-width: 0;
      &::placeholder { color: #1e2d42; font-weight: 400; }
      &::-webkit-inner-spin-button, &::-webkit-outer-spin-button { -webkit-appearance: none; }
      &[type="number"] { -moz-appearance: textfield; }
    }
  }
`;

const CalcGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
  margin-top: 8px;
  @media (max-width: 420px) { grid-template-columns: 1fr 1fr; }
`;

const CalcBox = styled.div`
  padding: 9px 10px;
  border-radius: 8px;
  text-align: center;
  background: ${p => p.t === 'risk' ? 'rgba(248,113,113,0.05)' : p.t === 'reward' ? 'rgba(34,197,94,0.05)' : 'rgba(56,189,248,0.05)'};
  border: 1px solid ${p => p.t === 'risk' ? 'rgba(248,113,113,0.12)' : p.t === 'reward' ? 'rgba(34,197,94,0.12)' : 'rgba(56,189,248,0.12)'};

  .cb-label { font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #334155; margin-bottom: 3px; }
  .cb-val { font-size: 14px; font-weight: 700; color: ${p => p.t === 'risk' ? '#f87171' : p.t === 'reward' ? '#22c55e' : '#38bdf8'}; }
  .cb-sub { font-size: 8px; color: #334155; margin-top: 2px; font-weight: 400; }
`;

const CalcSummary = styled.div`
  margin-top: 9px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.04);
  border-radius: 8px;

  .cs-row {
    display: flex;
    justify-content: space-between;
    padding: 3px 0;
    font-size: 11px;
    font-weight: 600;
    .cs-label { color: #334155; }
    .cs-val   { color: #94a3b8; }
  }
`;

const CalcRunBtn = styled.button`
  width: 100%;
  padding: 9px 0;
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(56,189,248,0.15), rgba(129,140,248,0.15));
  border: 1px solid rgba(56,189,248,0.25);
  color: #38bdf8;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background: linear-gradient(135deg, rgba(56,189,248,0.22), rgba(129,140,248,0.22));
    box-shadow: 0 4px 16px rgba(56,189,248,0.1);
  }
`;

// — How to Use steps —
const StepRow = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  &:last-child { border-bottom: none; }

  .step-num {
    width: 24px; height: 24px;
    border-radius: 50%;
    background: rgba(56,189,248,0.07);
    border: 1px solid rgba(56,189,248,0.18);
    color: #38bdf8;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-weight: 700;
    flex-shrink: 0;
  }

  .step-title { font-size: 12px; font-weight: 600; color: #94a3b8; margin-bottom: 2px; }
  .step-desc  { font-size: 11px; color: #334155; line-height: 1.5; font-weight: 400; }
`;

// — Terms —
const TermsBlk = styled.div`
  margin-bottom: 12px;

  .tb-title { font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 4px; }
  .tb-text  { font-size: 11px; line-height: 1.7; color: #334155; font-weight: 400; }
  .tb-bullet {
    display: flex; align-items: flex-start; gap: 6px;
    padding: 2px 0; font-size: 11px; line-height: 1.6; color: #334155; font-weight: 400;
    .tb-dot { color: #1e3a5f; font-weight: 700; flex-shrink: 0; margin-top: 2px; }
    .tb-hi  { color: #64748b; font-weight: 600; }
    .tb-red { color: #f87171; font-weight: 600; }
  }
`;

// ─────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────
const OptionSideBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('academy');
  const [rating, setRating]               = useState(0);
  const [hoverRating, setHoverRating]     = useState(0);
  const [feedbackText, setFeedbackText]   = useState('');
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [submitStatus, setSubmitStatus]   = useState('');
  const [hasNotifs, setHasNotifs]         = useState(true);

  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceVolume,  setVoiceVolume]  = useState(70);
  const [voiceEvents,  setVoiceEvents]  = useState({ trade: true, price: true, market: false, system: true });

  const [popup,      setPopup]      = useState(null);
  const [popupOpen,  setPopupOpen]  = useState(false);

  const [calcBal,  setCalcBal]  = useState(10000);
  const [calcRisk, setCalcRisk] = useState(2);
  const [calcSL,   setCalcSL]   = useState(50);
  const [calcTP,   setCalcTP]   = useState(150);
  const [calcDone, setCalcDone] = useState(false);

  const closeMobile = () => { if (window.innerWidth <= 768) onClose(); };

  const openPopup = (data) => { setPopup(data); setPopupOpen(true); };
  const closePopup = () => {
    setPopupOpen(false);
    setTimeout(() => setPopup(null), 300);
  };

  const nav = (item, path) => {
    setActiveItem(item);
    if (path) navigate(path);
    closeMobile();
  };

  // ── Risk maths ──
  const riskAmt   = calcBal * (calcRisk / 100);
  const rewardAmt = calcBal * ((calcTP / calcSL) * (calcRisk / 100));
  const rrRatio   = riskAmt > 0 ? rewardAmt / riskAmt : 0;
  const posSize   = calcSL  > 0 ? riskAmt / (calcSL / 100) : 0;

  // ── Popup openers ──
  const openNotifications = () => {
    setActiveItem('notifications');
    setHasNotifs(false);
    openPopup({
      title: 'Notifications',
      icon: <BellIcon />,
      badge: '2 new',
      content: (
        <>
          {[
            { read: false, type: 'trade', icon: '📈', title: 'Trade Executed',  desc: 'Buy order #TRX-7841 filled at $12,450.00', time: '2 min ago' },
            { read: false, type: 'alert', icon: '⚠️', title: 'Market Alert',    desc: 'Volatility 100 (1s) Index hit resistance', time: '15 min ago' },
            { read: true,  type: 'trade', icon: '📉', title: 'Position Closed', desc: 'Sell order #TRX-7839 closed at $5,670.00',  time: '1 hr ago' },
            { read: true,  type: 'alert', icon: '🔔', title: 'System Update',   desc: 'New features available in v2.1.0',          time: '3 hr ago' },
          ].map((n, i) => (
            <NotifItem key={i} read={n.read} type={n.type}>
              <div className="ni-icon">{n.icon}</div>
              <div className="ni-content">
                <div className="ni-title">{n.title}</div>
                <div className="ni-desc">{n.desc}</div>
                <div className="ni-time">{n.time}</div>
              </div>
              <div className="ni-dot" />
            </NotifItem>
          ))}
        </>
      )
    });
  };

  const openVoice = () => {
    setActiveItem('voice');
    openPopup({
      title: 'Voice Notifications',
      icon: voiceEnabled ? <VoiceIcon /> : <VoiceOffIcon />,
      badge: voiceEnabled ? 'active' : 'muted',
      content: (
        <>
          <VoiceRow active={voiceEnabled}>
            <span className="vr-label">Voice announcements</span>
            <div className="vr-right">
              <span className="vr-status">{voiceEnabled ? 'On' : 'Off'}</span>
              <Toggle on={voiceEnabled} onClick={() => setVoiceEnabled(v => !v)} />
            </div>
          </VoiceRow>
          <VolumeRow>
            <span className="vv-label">Vol</span>
            <input type="range" min="0" max="100" value={voiceVolume}
              onChange={e => setVoiceVolume(+e.target.value)} disabled={!voiceEnabled} />
            <span className="vv-val">{voiceVolume}%</span>
          </VolumeRow>
          {[
            { key: 'trade',  label: 'Trade execution' },
            { key: 'price',  label: 'Price alerts'    },
            { key: 'market', label: 'Market signals'  },
            { key: 'system', label: 'System updates'  },
          ].map(ev => (
            <VoiceEvent key={ev.key} on={voiceEvents[ev.key]}>
              <span className="ve-name"><span className="ve-dot" />{ev.label}</span>
              <span className="ve-toggle"
                onClick={() => setVoiceEvents(s => ({ ...s, [ev.key]: !s[ev.key] }))}>
                {voiceEvents[ev.key] ? 'Enabled' : 'Disabled'}
              </span>
            </VoiceEvent>
          ))}
        </>
      )
    });
  };

  const openAccount = () => {
    setActiveItem('account-info');
    openPopup({
      title: 'Account information',
      icon: <AccountIcon />,
      content: (
        <>
          {[
            { label: 'Account ID',   val: 'ACC-8472-001' },
            { label: 'Account type', val: 'Real trading'  },
            { label: 'Balance',      val: <span style={{ color: '#22c55e' }}>$7,110.00 USD</span> },
            { label: 'Status',       val: <span className="ar-live"><span className="dot" />Active</span> },
            { label: 'Joined',       val: 'January 2026' },
            { label: 'Last login',   val: 'Today, 14:32' },
          ].map((r, i) => (
            <AcctRow key={i}>
              <span className="ar-label">{r.label}</span>
              <span className="ar-val">{r.val}</span>
            </AcctRow>
          ))}
        </>
      )
    });
  };

  const openRiskCalc = () => {
    setActiveItem('risk-calculator');
    setCalcDone(false);
    openPopup({
      title: 'Risk calculator',
      icon: <RiskIcon />,
      content: (
        <>
          <CalcGroup>
            <span className="cg-label">Account balance <span className="cg-hint">(USD)</span></span>
            <div className="cg-wrap">
              <span className="cg-pre">$</span>
              <input type="number" value={calcBal} onChange={e => setCalcBal(+e.target.value || 0)} step="100" min="0" />
            </div>
          </CalcGroup>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <CalcGroup>
              <span className="cg-label">Risk % <span className="cg-hint">(per trade)</span></span>
              <div className="cg-wrap">
                <span className="cg-pre">%</span>
                <input type="number" value={calcRisk} onChange={e => setCalcRisk(+e.target.value || 0)} step="0.5" min="0" max="100" />
              </div>
            </CalcGroup>
            <CalcGroup>
              <span className="cg-label">Stop loss <span className="cg-hint">(pips)</span></span>
              <div className="cg-wrap">
                <span className="cg-pre">SL</span>
                <input type="number" value={calcSL} onChange={e => setCalcSL(+e.target.value || 0)} step="5" min="1" />
              </div>
            </CalcGroup>
          </div>
          <CalcGroup>
            <span className="cg-label">Take profit <span className="cg-hint">(pips)</span></span>
            <div className="cg-wrap">
              <span className="cg-pre">TP</span>
              <input type="number" value={calcTP} onChange={e => setCalcTP(+e.target.value || 0)} step="5" min="1" />
            </div>
          </CalcGroup>
          <CalcRunBtn onClick={() => setCalcDone(true)}>Calculate risk</CalcRunBtn>
          {calcDone && (
            <>
              <CalcGrid>
                <CalcBox t="risk">
                  <div className="cb-label">Risk</div>
                  <div className="cb-val">${riskAmt.toFixed(2)}</div>
                  <div className="cb-sub">{calcRisk}% of bal.</div>
                </CalcBox>
                <CalcBox t="reward">
                  <div className="cb-label">Reward</div>
                  <div className="cb-val">${rewardAmt.toFixed(2)}</div>
                  <div className="cb-sub">{((calcTP / calcSL) * calcRisk).toFixed(2)}%</div>
                </CalcBox>
                <CalcBox t="ratio">
                  <div className="cb-label">R:R</div>
                  <div className="cb-val">1:{rrRatio.toFixed(2)}</div>
                  <div className="cb-sub">{rrRatio.toFixed(2)}×</div>
                </CalcBox>
              </CalcGrid>
              <CalcSummary>
                <div className="cs-row"><span className="cs-label">Position size</span><span className="cs-val">{posSize.toFixed(2)} units</span></div>
                <div className="cs-row"><span className="cs-label">Max loss</span><span className="cs-val" style={{ color: '#f87171' }}>${riskAmt.toFixed(2)}</span></div>
                <div className="cs-row"><span className="cs-label">Max profit</span><span className="cs-val" style={{ color: '#22c55e' }}>${rewardAmt.toFixed(2)}</span></div>
              </CalcSummary>
            </>
          )}
        </>
      )
    });
  };

  const openHowTo = () => {
    setActiveItem('how-to-use');
    openPopup({
      title: 'How to use this tool',
      icon: <BookIcon />,
      content: (
        <>
          {[
            { n: 1, title: 'Connect your account', desc: 'Link your Deriv account for real-time data and direct trade execution.' },
            { n: 2, title: 'Select a market',       desc: 'Choose from volatility indices — 1s and standard — to begin trading.' },
            { n: 3, title: 'Choose your strategy',  desc: 'Switch between manual, auto, and bot-assisted execution modes.' },
            { n: 4, title: 'Monitor positions',     desc: 'Track open trades, performance metrics, and risk in real time.' },
            { n: 5, title: 'Customise',             desc: 'Set themes, voice alerts, and display preferences to suit your workflow.' },
          ].map(s => (
            <StepRow key={s.n}>
              <div className="step-num">{s.n}</div>
              <div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            </StepRow>
          ))}
        </>
      )
    });
  };

  const openTerms = () => {
    setActiveItem('terms');
    openPopup({
      title: 'Terms & conditions',
      icon: <TermsIcon />,
      badge: 'v2.0',
      content: (
        <>
          {[
            { title: '1. Introduction', text: 'Welcome to Voltix Traders. By using this application, you agree to be bound by these Terms.' },
            { title: '2. Acceptance', bullets: [
              { t: 'You must be at least', hi: '18 years old', rest: ' to use this app.' },
              { t: 'You are', hi: 'solely responsible', rest: ' for all trading decisions.' },
              { t: 'Trading involves', red: 'significant financial risk', rest: '.' },
            ]},
            { title: '3. Services', text: 'Voltix Traders provides automated trading, AI analysis, manual trading, bot deployment, and real-time Deriv API market data.' },
            { title: '4. Account responsibility', text: 'You are fully responsible for all trades executed through the app. We do not store your login credentials.' },
            { title: '5. Limitation of liability', text: 'Voltix Traders is provided "as is" without warranties. We are not liable for financial losses, technical issues, or damages from use of the app.' },
            { title: '6. Privacy', text: 'We do not store your Deriv credentials. We collect minimal data for functionality and never sell personal data.' },
            { title: '7. Contact', text: 'Questions? Reach us at support@voltixtraders.com' },
          ].map((blk, i) => (
            <TermsBlk key={i}>
              <div className="tb-title">{blk.title}</div>
              {blk.text && <div className="tb-text">{blk.text}</div>}
              {blk.bullets && blk.bullets.map((b, j) => (
                <div key={j} className="tb-bullet">
                  <span className="tb-dot">•</span>
                  <span>
                    {b.t}{' '}
                    {b.hi  && <span className="tb-hi">{b.hi}</span>}
                    {b.red && <span className="tb-red">{b.red}</span>}
                    {b.rest}
                  </span>
                </div>
              ))}
            </TermsBlk>
          ))}
        </>
      )
    });
  };

  const submitFeedback = async () => {
    if (!rating)           { setSubmitStatus('Please select a rating.');    setTimeout(() => setSubmitStatus(''), 3000); return; }
    if (!feedbackText.trim()) { setSubmitStatus('Please write your feedback.'); setTimeout(() => setSubmitStatus(''), 3000); return; }
    setIsSubmitting(true);
    setSubmitStatus('Sending…');
    await new Promise(r => setTimeout(r, 900));
    setSubmitStatus('Feedback sent — thank you!');
    setRating(0); setFeedbackText('');
    setIsSubmitting(false);
    setTimeout(() => setSubmitStatus(''), 5000);
  };

  const ratingLabels = { 1: 'Needs work', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent' };

  return (
    <>
      {/* ── MODAL ── */}
      <ModalOverlay isOpen={popupOpen} onClick={closePopup}>
        <ModalBox onClick={e => e.stopPropagation()}>
          <ModalHead>
            <div className="mh-left">
              <span className="mh-icon">{popup?.icon}</span>
              <span className="mh-title">{popup?.title}</span>
              {popup?.badge && <span className="mh-badge">{popup.badge}</span>}
            </div>
            <button className="mh-close" onClick={closePopup}><CloseIcon /></button>
          </ModalHead>
          <ModalBody>{popup?.content}</ModalBody>
        </ModalBox>
      </ModalOverlay>

      {/* ── OVERLAY ── */}
      <Overlay isOpen={isOpen} onClick={onClose} />

      {/* ── SIDEBAR ── */}
      <SidebarWrap isOpen={isOpen}>
        <CloseBtn isOpen={isOpen} onClick={onClose}><CloseIcon /></CloseBtn>

        <SidebarScroll>
          {/* Header */}
          <SideHead>
            <Avatar>MT</Avatar>
            <UserMeta>
              <div className="user-name">John Trader</div>
              <div className="user-email">john@voltixtraders.com</div>
            </UserMeta>
            <StatusDot title="Online" />
          </SideHead>

          {/* Updates */}
          <Section delay={0.28}>
            <SectionEyebrow>Updates</SectionEyebrow>
            <NavItem active={activeItem === 'notifications'} onClick={openNotifications}>
              <span className="ni-icon"><BellIcon /></span>
              <span className="ni-label">Notifications</span>
              {hasNotifs && <NotifDot />}
              <Badge variant="accent">2</Badge>
            </NavItem>
            <NavItem active={activeItem === 'voice'} onClick={openVoice}>
              <span className="ni-icon">{voiceEnabled ? <VoiceIcon /> : <VoiceOffIcon />}</span>
              <span className="ni-label">Voice alerts</span>
              <Badge variant={voiceEnabled ? 'on' : 'off'}>{voiceEnabled ? 'On' : 'Off'}</Badge>
            </NavItem>
          </Section>

          {/* Learning */}
          <Section delay={0.32}>
            <SectionEyebrow>Learning</SectionEyebrow>
            <NavItem active={activeItem === 'academy'} onClick={() => nav('academy', '/academy')}>
              <span className="ni-icon"><AcademyIcon /></span>
              <span className="ni-label">Voltix Academy</span>
              <Badge variant="new">New</Badge>
            </NavItem>
          </Section>

          {/* Account */}
          <Section delay={0.34}>
            <SectionEyebrow>Account</SectionEyebrow>
            <NavItem active={activeItem === 'account-info'} onClick={openAccount}>
              <span className="ni-icon"><AccountIcon /></span>
              <span className="ni-label">Account info</span>
            </NavItem>
          </Section>

          {/* Trading */}
          <Section delay={0.36}>
            <SectionEyebrow>Trading</SectionEyebrow>
            <NavItem active={activeItem === 'copy-trading'} onClick={() => nav('copy-trading', '/copy-trading')}>
              <span className="ni-icon"><CopyIcon /></span>
              <span className="ni-label">Copy trading</span>
              <Badge variant="beta">Beta</Badge>
            </NavItem>
            <NavItem active={activeItem === 'account-management'} onClick={() => nav('account-management', '/account-management')}>
              <span className="ni-icon"><ManagementIcon /></span>
              <span className="ni-label">Account management</span>
              <Badge variant="new">New</Badge>
            </NavItem>
            <NavItem active={activeItem === 'risk-calculator'} onClick={openRiskCalc}>
              <span className="ni-icon"><RiskIcon /></span>
              <span className="ni-label">Risk calculator</span>
            </NavItem>
          </Section>

          {/* Responsible trading */}
          <Section delay={0.38}>
            <SectionEyebrow>Wellness</SectionEyebrow>
            <InfoCard>
              <div className="ic-title"><ShieldIcon /> Responsible trading</div>
              <div className="ic-item"><span className="bullet">•</span><span>Set <span className="hi">deposit limits</span> to control capital exposure.</span></div>
              <div className="ic-item"><span className="bullet">•</span><span>Take regular <span className="hi">breaks</span> to maintain discipline.</span></div>
              <div className="ic-item"><span className="bullet">•</span><span>Only trade capital you can afford to lose.</span></div>
              <div className="ic-link" onClick={() => nav('responsible-trading', '/responsible-trading')}>Learn more →</div>
            </InfoCard>
          </Section>

          {/* Feedback */}
          <Section delay={0.40}>
            <SectionEyebrow>Feedback</SectionEyebrow>
            <FeedbackCard>
              <div className="fb-label">Rate your experience</div>
              <div className="stars">
                {[1,2,3,4,5].map(s => (
                  <button key={s} type="button"
                    className={`star ${s <= (hoverRating || rating) ? 'lit' : ''}`}
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}>
                    <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                  </button>
                ))}
              </div>
              <div className="star-label">{rating > 0 ? ratingLabels[rating] : 'Tap a star to rate'}</div>
              <textarea
                placeholder="Share your thoughts or suggestions…"
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                disabled={isSubmitting}
              />
              <button className="fb-submit" onClick={submitFeedback} disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Submit feedback'}
              </button>
              {submitStatus && <div className="fb-status">{submitStatus}</div>}
            </FeedbackCard>
          </Section>

          {/* Information */}
          <Section delay={0.42}>
            <SectionEyebrow>Information</SectionEyebrow>
            <NavItem active={activeItem === 'how-to-use'} onClick={openHowTo}>
              <span className="ni-icon"><BookIcon /></span>
              <span className="ni-label">How to use</span>
            </NavItem>
            <NavItem active={activeItem === 'terms'} onClick={openTerms}>
              <span className="ni-icon"><TermsIcon /></span>
              <span className="ni-label">Terms & conditions</span>
            </NavItem>
          </Section>

          {/* Company */}
          <Section delay={0.44}>
            <SectionEyebrow>Company</SectionEyebrow>
            <InfoCard>
              <div className="ic-title"><ManagementIcon /> About Voltix Traders</div>
              <div className="ic-item"><span className="bullet">•</span><span>Third-party trading app built on Deriv's platform.</span></div>
              <div className="ic-item"><span className="bullet">•</span><span>Real-time API market streams, bots, and automated execution.</span></div>
              <div className="ic-link" onClick={() => nav('about', '/about')}>About us →</div>
            </InfoCard>
          </Section>
        </SidebarScroll>

        {/* Footer */}
        <SideFooter>
          <FooterBtn onClick={() => nav('settings', '/settings')}>
            <span className="fi"><SettingsIcon /></span> Settings
          </FooterBtn>
          <FooterBtn onClick={() => nav('help', '/help')}>
            <span className="fi"><HelpIcon /></span> Help
          </FooterBtn>
        </SideFooter>
      </SidebarWrap>
    </>
  );
};

export default OptionSideBar;