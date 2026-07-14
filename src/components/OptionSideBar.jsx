// src/components/OptionSideBar.jsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ============================================
// KEYFRAMES
// ============================================
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

// ============================================
// STYLED COMPONENTS - UPDATED WITH THEME
// ============================================

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-right: 2px solid ${props => props.theme.colors.border};
  transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 99;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-weight: 700;

  @media (max-width: 768px) {
    width: 100%;
    top: 0;
    height: 100vh;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
`;

// ===== SCROLLABLE CONTENT =====
const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 76px 16px 8px 16px;
  -webkit-overflow-scrolling: touch;
  font-weight: 700;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.scrollbar};
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    padding: 80px 16px 8px 16px;
  }

  @media (max-width: 480px) {
    padding: 74px 14px 6px 14px;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: ${props => props.theme.colors.shadow};
  z-index: 98;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

// ===== SIDEBAR HEADER =====
const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 4px 16px 4px;
  border-bottom: 2px solid ${props => props.theme.colors.border};
  margin-bottom: 16px;
  animation: ${slideIn} 0.4s ease;
  flex-shrink: 0;
  font-weight: 700;

  .avatar {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: ${props => `linear-gradient(135deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)`};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    box-shadow: 0 4px 20px ${props => props.theme.colors.accent + '40'};
    flex-shrink: 0;
  }

  .user-info {
    flex: 1;
    min-width: 0;
  }

  .user-name {
    font-size: 14px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    letter-spacing: 0.3px;
  }

  .user-email {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    margin-top: 2px;
    letter-spacing: 0.2px;
    word-break: break-all;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    padding: 10px 4px 12px 4px;
    margin-bottom: 12px;
    
    .avatar {
      width: 40px;
      height: 40px;
      font-size: 17px;
    }
    .user-name {
      font-size: 14px;
    }
    .user-email {
      font-size: 11px;
    }
  }

  @media (max-width: 480px) {
    padding: 8px 4px 10px 4px;
    margin-bottom: 10px;
    gap: 10px;
    
    .avatar {
      width: 36px;
      height: 36px;
      font-size: 15px;
      border-radius: 10px;
    }
    .user-name {
      font-size: 13px;
    }
    .user-email {
      font-size: 10px;
    }
  }
`;

// ===== NAVIGATION ITEMS =====
const NavSection = styled.div`
  margin-bottom: 20px;
  animation: ${slideIn} 0.5s ease;
  font-weight: 700;

  @media (max-width: 768px) {
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
`;

const SectionLabel = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 1.2px;
  padding: 0 4px;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    font-size: 9px;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }

  @media (max-width: 480px) {
    font-size: 8px;
    letter-spacing: 0.8px;
    margin-bottom: 3px;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  margin-bottom: 2px;
  color: ${props => props.active ? props.theme.colors.text : props.theme.colors.textSecondary};
  font-weight: 700;

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.accent};
  }

  &.active {
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.text};

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 24px;
      background: ${props => `linear-gradient(180deg, ${props.theme.colors.accent}, ${props.theme.colors.accent}dd)`};
      border-radius: 0 3px 3px 0;
    }

    .nav-icon {
      color: ${props => props.theme.colors.accent};
    }

    .badge {
      background: ${props => props.theme.colors.accentActive};
      color: ${props => props.theme.colors.accent};
    }
  }

  .nav-icon {
    font-size: 18px;
    width: 24px;
    text-align: center;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .nav-label {
    flex: 1;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.2px;
  }

  .badge {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 20px;
    background: ${props => props.theme.colors.backgroundSecondary};
    color: ${props => props.theme.colors.textMuted};
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .notification-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.theme.colors.danger};
    animation: ${pulse} 2s ease-in-out infinite;
    flex-shrink: 0;
    margin-left: auto;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 12px;
    border-radius: 8px;
    
    .nav-icon {
      font-size: 16px;
      width: 20px;
    }
    .nav-label {
      font-size: 12px;
    }
    .badge {
      font-size: 8px;
      padding: 1px 8px;
    }
    .notification-dot {
      width: 6px;
      height: 6px;
    }
  }

  @media (max-width: 480px) {
    padding: 6px 10px;
    gap: 10px;
    border-radius: 6px;
    margin-bottom: 1px;
    
    .nav-icon {
      font-size: 14px;
      width: 18px;
    }
    .nav-label {
      font-size: 11px;
    }
    .badge {
      font-size: 7px;
      padding: 1px 6px;
    }
    .notification-dot {
      width: 5px;
      height: 5px;
    }
  }
`;

// ===== RESPONSIBLE TRADING CARD =====
const ResponsibleTradingCard = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: ${props => props.theme.colors.accentActive};
  border: 2px solid ${props => props.theme.colors.border};
  animation: ${fadeIn} 0.6s ease;
  margin-top: 4px;
  font-weight: 700;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent};
  }

  .card-title {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      font-size: 16px;
    }
  }

  .fact-item {
    font-size: 10px;
    color: ${props => props.theme.colors.textSecondary};
    padding: 4px 0;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.4;

    .bullet {
      color: ${props => props.theme.colors.accent};
      font-weight: 700;
      flex-shrink: 0;
    }

    .highlight {
      color: ${props => props.theme.colors.accent};
      font-weight: 700;
    }
  }

  .learn-more {
    margin-top: 8px;
    font-size: 10px;
    color: ${props => props.theme.colors.accent};
    cursor: pointer;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;

    &:hover {
      gap: 8px;
      color: ${props => props.theme.colors.accentHover};
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
    
    .card-title {
      font-size: 10px;
      .icon { font-size: 14px; }
    }
    .fact-item {
      font-size: 9px;
      padding: 3px 0;
    }
    .learn-more {
      font-size: 9px;
    }
  }

  @media (max-width: 480px) {
    padding: 10px;
    
    .card-title {
      font-size: 9px;
      .icon { font-size: 12px; }
    }
    .fact-item {
      font-size: 8px;
      padding: 2px 0;
    }
    .learn-more {
      font-size: 8px;
    }
  }
`;

// ===== ABOUT VOLTIX TRADERS CARD =====
const AboutCard = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: ${props => props.theme.colors.accentActive};
  border: 2px solid ${props => props.theme.colors.border};
  animation: ${fadeIn} 0.6s ease;
  margin-top: 4px;
  font-weight: 700;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent};
  }

  .card-title {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      font-size: 16px;
    }
  }

  .about-item {
    font-size: 10px;
    color: ${props => props.theme.colors.textSecondary};
    padding: 4px 0;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.4;

    .bullet {
      color: ${props => props.theme.colors.accent};
      font-weight: 700;
      flex-shrink: 0;
    }

    .highlight {
      color: ${props => props.theme.colors.accent};
      font-weight: 700;
    }
  }

  .learn-more {
    margin-top: 8px;
    font-size: 10px;
    color: ${props => props.theme.colors.accent};
    cursor: pointer;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;

    &:hover {
      gap: 8px;
      color: ${props => props.theme.colors.accentHover};
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
    
    .card-title {
      font-size: 10px;
      .icon { font-size: 14px; }
    }
    .about-item {
      font-size: 9px;
      padding: 3px 0;
    }
    .learn-more {
      font-size: 9px;
    }
  }

  @media (max-width: 480px) {
    padding: 10px;
    
    .card-title {
      font-size: 9px;
      .icon { font-size: 12px; }
    }
    .about-item {
      font-size: 8px;
      padding: 2px 0;
    }
    .learn-more {
      font-size: 8px;
    }
  }
`;

// ===== HOW TO USE CARD =====
const HowToUseCard = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: ${props => props.theme.colors.accentActive};
  border: 2px solid ${props => props.theme.colors.border};
  animation: ${fadeIn} 0.6s ease;
  margin-top: 4px;
  font-weight: 700;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.colors.accent};
  }

  .card-title {
    font-size: 11px;
    font-weight: 700;
    color: ${props => props.theme.colors.text};
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      font-size: 16px;
    }
  }

  .step-item {
    font-size: 10px;
    color: ${props => props.theme.colors.textSecondary};
    padding: 4px 0;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    line-height: 1.4;

    .step-number {
      color: ${props => props.theme.colors.accent};
      font-weight: 700;
      flex-shrink: 0;
      min-width: 16px;
    }

    .highlight {
      color: ${props => props.theme.colors.accent};
      font-weight: 700;
    }
  }

  .learn-more {
    margin-top: 8px;
    font-size: 10px;
    color: ${props => props.theme.colors.accent};
    cursor: pointer;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.2s ease;

    &:hover {
      gap: 8px;
      color: ${props => props.theme.colors.accentHover};
    }
  }

  @media (max-width: 768px) {
    padding: 12px;
    
    .card-title {
      font-size: 10px;
      .icon { font-size: 14px; }
    }
    .step-item {
      font-size: 9px;
      padding: 3px 0;
    }
    .learn-more {
      font-size: 9px;
    }
  }

  @media (max-width: 480px) {
    padding: 10px;
    
    .card-title {
      font-size: 9px;
      .icon { font-size: 12px; }
    }
    .step-item {
      font-size: 8px;
      padding: 2px 0;
    }
    .learn-more {
      font-size: 8px;
    }
  }
`;

// ===== FEEDBACK SECTION - ENHANCED STAR VISIBILITY =====
const FeedbackSection = styled.div`
  padding: 14px;
  border-radius: 12px;
  background: ${props => props.theme.colors.accentActive};
  border: 2px solid ${props => props.theme.colors.border};
  animation: ${fadeIn} 0.6s ease;
  font-weight: 700;

  .feedback-label {
    font-size: 11px;
    color: ${props => props.theme.colors.textMuted};
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: 0.3px;
  }

  .stars {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
    justify-content: center;
    padding: 4px 0;
  }

  .star-wrapper {
    position: relative;
    display: inline-block;
    cursor: pointer;
    transition: transform 0.2s ease;
    
    &:hover {
      transform: scale(1.3);
    }
  }

  .star {
    font-size: 32px;
    line-height: 1;
    color: ${props => props.theme.colors.border};
    transition: all 0.2s ease;
    display: block;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);

    &.active {
      color: #fbbf24;
      text-shadow: 
        0 0 20px rgba(251, 191, 36, 0.6),
        0 0 40px rgba(251, 191, 36, 0.3),
        0 2px 8px rgba(0, 0, 0, 0.4);
    }

    &.hover {
      color: #fbbf24;
      text-shadow: 
        0 0 20px rgba(251, 191, 36, 0.4),
        0 2px 8px rgba(0, 0, 0, 0.4);
    }
  }

  .star-rating-text {
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    margin-bottom: 10px;
    min-height: 20px;
    color: ${props => props.theme.colors.textSecondary};
    letter-spacing: 0.3px;
  }

  .feedback-textarea {
    width: 100%;
    min-height: 70px;
    padding: 10px 12px;
    background: ${props => props.theme.colors.background};
    border: 2px solid ${props => props.theme.colors.border};
    border-radius: 8px;
    color: ${props => props.theme.colors.text};
    font-size: 12px;
    font-family: inherit;
    font-weight: 700;
    resize: vertical;
    outline: none;
    transition: all 0.2s ease;
    margin-bottom: 10px;

    &::placeholder {
      color: ${props => props.theme.colors.textMuted + '60'};
    }

    &:focus {
      border-color: ${props => props.theme.colors.accent};
      box-shadow: 0 0 0 3px ${props => props.theme.colors.accent + '30'};
    }
  }

  .feedback-submit {
    width: 100%;
    padding: 8px 0;
    border: 2px solid ${props => props.theme.colors.accent};
    border-radius: 8px;
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.text};
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 20px ${props => props.theme.colors.accent + '50'};
      border-color: ${props => props.theme.colors.accent};
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .feedback-status {
    margin-top: 8px;
    font-size: 11px;
    text-align: center;
    color: ${props => props.theme.colors.success};
    font-weight: 700;
  }

  @media (max-width: 768px) {
    padding: 12px;
    
    .feedback-label {
      font-size: 10px;
      margin-bottom: 6px;
    }
    .star {
      font-size: 28px;
    }
    .stars {
      gap: 8px;
    }
    .feedback-textarea {
      min-height: 60px;
      font-size: 11px;
    }
    .feedback-submit {
      font-size: 11px;
      padding: 7px 0;
    }
  }

  @media (max-width: 480px) {
    padding: 10px;
    
    .feedback-label {
      font-size: 9px;
      margin-bottom: 4px;
    }
    .star {
      font-size: 24px;
    }
    .stars {
      gap: 6px;
    }
    .feedback-textarea {
      min-height: 50px;
      font-size: 10px;
      padding: 8px 10px;
    }
    .feedback-submit {
      font-size: 10px;
      padding: 6px 0;
    }
  }
`;

// ===== FOOTER - STICKY AT BOTTOM =====
const SidebarFooter = styled.div`
  flex-shrink: 0;
  padding: 12px 16px 20px 16px;
  border-top: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.backgroundSecondary};
  animation: ${fadeIn} 0.7s ease;
  font-weight: 700;

  .footer-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: ${props => props.theme.colors.textSecondary};
    font-size: 13px;
    font-weight: 700;

    &:hover {
      background: ${props => props.theme.colors.accentActive};
      color: ${props => props.theme.colors.text};
    }

    .footer-icon {
      font-size: 16px;
    }
  }

  @media (max-width: 768px) {
    padding: 8px 14px 14px 14px;
    
    .footer-item {
      padding: 8px 10px;
      font-size: 12px;
      gap: 10px;
      
      .footer-icon {
        font-size: 14px;
      }
    }
  }

  @media (max-width: 480px) {
    padding: 6px 12px 12px 12px;
    
    .footer-item {
      padding: 6px 10px;
      font-size: 11px;
      gap: 8px;
      border-radius: 6px;
      
      .footer-icon {
        font-size: 13px;
      }
    }
  }
`;

// ===== CLOSE BUTTON FOR MOBILE =====
const CloseButton = styled.button`
  display: none;
  position: fixed;
  top: 12px;
  right: 16px;
  z-index: 100;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textMuted};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  align-items: center;
  justify-content: center;
  font-weight: 700;

  &:hover {
    background: ${props => props.theme.colors.accentActive};
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.accent};
  }

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    top: 14px;
    right: 16px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
    top: 12px;
    right: 12px;
  }
`;

// ============================================
// MAIN COMPONENT
// ============================================

const OptionSideBar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('academy');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);

  const handleNavClick = (item, path) => {
    setActiveItem(item);
    if (path) {
      navigate(path);
    }
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleSettingsNavigation = () => {
    navigate('/settings');
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleNotificationsClick = () => {
    setActiveItem('notifications');
    setHasNotifications(false);
    navigate('/notifications');
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleResponsibleTradingClick = () => {
    navigate('/responsible-trading');
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleAboutClick = () => {
    setActiveItem('about');
    navigate('/about');
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleAccountManagementClick = () => {
    setActiveItem('account-management');
    navigate('/account-management');
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleHowToUseClick = () => {
    setActiveItem('how-to-use');
    navigate('/how-to-use');
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      setSubmitStatus('Please select a rating');
      setTimeout(() => setSubmitStatus(''), 3000);
      return;
    }

    if (!feedbackText.trim()) {
      setSubmitStatus('Please write your feedback');
      setTimeout(() => setSubmitStatus(''), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('Sending feedback...');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          feedback: feedbackText.trim(),
          user: 'John Trader',
          email: 'john@voltixtraders.com'
        }),
      });

      if (response.ok) {
        setSubmitStatus('Thank you for your feedback!');
        setRating(0);
        setFeedbackText('');
        setTimeout(() => setSubmitStatus(''), 5000);
      } else {
        setSubmitStatus('Failed to send. Please try again.');
        setTimeout(() => setSubmitStatus(''), 3000);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      setSubmitStatus('Connection error. Please try again.');
      setTimeout(() => setSubmitStatus(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (value) => {
    const texts = {
      1: 'Needs Improvement ⭐',
      2: 'Fair ⭐⭐',
      3: 'Good ⭐⭐⭐',
      4: 'Great ⭐⭐⭐⭐',
      5: 'Excellent ⭐⭐⭐⭐⭐'
    };
    return texts[value] || '';
  };

  return (
    <>
      <Overlay isOpen={isOpen} onClick={onClose} />
      
      <SidebarContainer isOpen={isOpen}>
        <CloseButton isOpen={isOpen} onClick={onClose}>
          ✕
        </CloseButton>

        <SidebarContent>
          <SidebarHeader>
            <div className="avatar">VT</div>
            <div className="user-info">
              <div className="user-name">John Trader</div>
              <div className="user-email">john@voltixtraders.com</div>
            </div>
          </SidebarHeader>

          {/* NOTIFICATIONS SECTION */}
          <NavSection>
            <SectionLabel>Updates</SectionLabel>
            
            <NavItem 
              active={activeItem === 'notifications'}
              onClick={handleNotificationsClick}
            >
              <span className="nav-icon">🔔</span>
              <span className="nav-label">Notifications</span>
              {hasNotifications && <span className="notification-dot" />}
              <span className="badge">2</span>
            </NavItem>
          </NavSection>

          {/* MAIN NAVIGATION - Learning */}
          <NavSection>
            <SectionLabel>Learning</SectionLabel>
            
            <NavItem 
              active={activeItem === 'academy'}
              onClick={() => handleNavClick('academy', '/academy')}
            >
              <span className="nav-icon">📚</span>
              <span className="nav-label">Voltix Traders Academy</span>
              <span className="badge">NEW</span>
            </NavItem>
          </NavSection>

          {/* ACCOUNT SECTION */}
          <NavSection>
            <SectionLabel>Account</SectionLabel>
            
            <NavItem 
              active={activeItem === 'account-info'}
              onClick={() => handleNavClick('account-info', '/account-info')}
            >
              <span className="nav-icon">👤</span>
              <span className="nav-label">Your Linked Deriv Account Information</span>
            </NavItem>
          </NavSection>

          {/* TRADING SECTION */}
          <NavSection>
            <SectionLabel>Trading</SectionLabel>
            
            <NavItem 
              active={activeItem === 'switch-to-forex'}
              onClick={() => handleNavClick('switch-to-forex', '/switch-to-forex')}
            >
              <span className="nav-icon">💱</span>
              <span className="nav-label">Switch to Forex</span>
              <span className="badge">HOT</span>
            </NavItem>

            <NavItem 
              active={activeItem === 'copy-trading'}
              onClick={() => handleNavClick('copy-trading', '/copy-trading')}
            >
              <span className="nav-icon">🔄</span>
              <span className="nav-label">Copy Trading</span>
              <span className="badge">BETA</span>
            </NavItem>

            <NavItem 
              active={activeItem === 'account-management'}
              onClick={handleAccountManagementClick}
            >
              <span className="nav-icon">📋</span>
              <span className="nav-label">Need Account Management</span>
              <span className="badge">NEW</span>
            </NavItem>

            <NavItem 
              active={activeItem === 'risk-calculator'}
              onClick={() => handleNavClick('risk-calculator', '/risk-calculator')}
            >
              <span className="nav-icon">🧮</span>
              <span className="nav-label">Risk Calculator</span>
            </NavItem>
          </NavSection>

          {/* RESPONSIBLE TRADING SECTION */}
          <NavSection>
            <SectionLabel>Wellness</SectionLabel>
            
            <ResponsibleTradingCard>
              <div className="card-title">
                <span className="icon">🛡️</span>
                Responsible Trading
              </div>
              <div className="fact-item">
                <span className="bullet">•</span>
                <span>Set <span className="highlight">deposit limits</span> to manage your trading budget effectively</span>
              </div>
              <div className="fact-item">
                <span className="bullet">•</span>
                <span>Take regular <span className="highlight">trading breaks</span> to maintain clarity and focus</span>
              </div>
              <div className="fact-item">
                <span className="bullet">•</span>
                <span>Only trade with <span className="highlight">risk capital</span> you can afford to lose</span>
              </div>
              <div className="fact-item">
                <span className="bullet">•</span>
                <span><span className="highlight">90%</span> of successful traders keep a trading journal</span>
              </div>
              <div 
                className="learn-more" 
                onClick={handleResponsibleTradingClick}
              >
                Learn more about responsible trading →
              </div>
            </ResponsibleTradingCard>
          </NavSection>

          {/* FEEDBACK SECTION */}
          <NavSection>
            <SectionLabel>Feedback</SectionLabel>
            
            <FeedbackSection>
              <div className="feedback-label">Rate your experience</div>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className="star-wrapper"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <span 
                      className={`star ${
                        star <= (hoverRating || rating) ? 'active' : ''
                      } ${star <= hoverRating && star > rating ? 'hover' : ''}`}
                    >
                      ★
                    </span>
                  </span>
                ))}
              </div>
              <div className="star-rating-text">
                {rating > 0 ? getRatingText(rating) : 'Tap a star to rate'}
              </div>
              <textarea
                className="feedback-textarea"
                placeholder="Share your thoughts, suggestions, or issues..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                disabled={isSubmitting}
              />
              <button 
                className="feedback-submit" 
                onClick={handleSubmitFeedback}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Submit Feedback'}
              </button>
              {submitStatus && (
                <div className="feedback-status">{submitStatus}</div>
              )}
            </FeedbackSection>
          </NavSection>

          {/* HOW TO USE SECTION */}
          <NavSection>
            <SectionLabel>Guide</SectionLabel>
            
            <HowToUseCard>
              <div className="card-title">
                <span className="icon">📖</span>
                How to Use This Tool
              </div>
              <div className="step-item">
                <span className="step-number">1.</span>
                <span>Connect your <span className="highlight">Deriv account</span> to access real-time trading data</span>
              </div>
              <div className="step-item">
                <span className="step-number">2.</span>
                <span>Explore the <span className="highlight">chart panel</span> to analyze market trends and patterns</span>
              </div>
              <div className="step-item">
                <span className="step-number">3.</span>
                <span>Use the <span className="highlight">trading panel</span> to execute trades with precision</span>
              </div>
              <div className="step-item">
                <span className="step-number">4.</span>
                <span>Monitor your <span className="highlight">open positions</span> and track performance in real-time</span>
              </div>
              <div className="step-item">
                <span className="step-number">5.</span>
                <span>Customize your <span className="highlight">experience</span> with themes and sound settings</span>
              </div>
              <div 
                className="learn-more" 
                onClick={handleHowToUseClick}
              >
                View full guide →
              </div>
            </HowToUseCard>
          </NavSection>

          {/* ABOUT VOLTIX TRADERS SECTION */}
          <NavSection>
            <SectionLabel>Company</SectionLabel>
            
            <AboutCard>
              <div className="card-title">
                <span className="icon">🏢</span>
                About Voltix Traders
              </div>
              <div className="about-item">
                <span className="bullet">•</span>
                <span><span className="highlight">Voltix Traders</span> is a third-party app for trading on Deriv and Forex.</span>
              </div>
              <div className="about-item">
                <span className="bullet">•</span>
                <span>It supports automated trading, AI-assisted manual trading, <span className="highlight">and bot trading</span>.</span>
              </div>
              <div className="about-item">
                <span className="bullet">•</span>
                <span><span className="highlight">It</span> provides live, real-time data from Deriv and Forex via APIs.</span>
              </div>
              <div className="about-item">
                <span className="bullet">•</span>
                <span>Empowering traders with <span className="highlight">cutting-edge tools</span></span>
              </div>
              <div 
                className="learn-more" 
                onClick={handleAboutClick}
              >
                Learn more about us →
              </div>
            </AboutCard>
          </NavSection>
        </SidebarContent>

        {/* FOOTER - Now always visible at bottom */}
        <SidebarFooter>
          <div className="footer-item" onClick={handleSettingsNavigation}>
            <span className="footer-icon">⚙️</span>
            Settings
          </div>
          <div className="footer-item" onClick={handleSettingsNavigation}>
            <span className="footer-icon">❓</span>
            Help & Support
          </div>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default OptionSideBar;