// Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// ============================================
// STYLES (reuse from Dashboard)
// ============================================
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #050a18;
    color: #f1f5f9;
    min-height: 100vh;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar {
    width: 4px;
  }
  ::-webkit-scrollbar-track {
    background: #0a0f1f;
  }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #22c55e, #38bdf8);
    border-radius: 4px;
  }
`;

const floatIn = keyframes`
  0% { opacity: 0; transform: translateY(30px) scale(0.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulseRing = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
`;

const breathe = keyframes`
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.05); }
`;

const pulseGlow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.1); }
  50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.2); }
`;

// ============================================
// BACKGROUND
// ============================================
const BackgroundContainer = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const GradientOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: ${breathe} 8s ease-in-out infinite;

  &:nth-child(1) {
    width: 500px;
    height: 500px;
    top: -200px;
    right: -150px;
    background: radial-gradient(circle, rgba(34, 197, 94, 0.06), transparent 70%);
    animation-delay: 0s;
  }

  &:nth-child(2) {
    width: 400px;
    height: 400px;
    bottom: -150px;
    left: -100px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.05), transparent 70%);
    animation-delay: -2.5s;
  }

  &:nth-child(3) {
    width: 300px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(129, 140, 248, 0.03), transparent 70%);
    animation-delay: -5s;
  }
`;

const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(56, 189, 248, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56, 189, 248, 0.015) 1px, transparent 1px);
  background-size: 50px 50px;
  opacity: 0.3;
`;

// ============================================
// TOPBAR
// ============================================
const Topbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 32px;
  background: rgba(5, 10, 24, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(56, 189, 248, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  animation: ${floatIn} 0.6s ease;

  @media (max-width: 768px) {
    padding: 12px 16px;
    flex-direction: column;
    gap: 10px;
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.4rem;
  font-weight: 800;
  text-decoration: none;

  .logo-icon {
    font-size: 1.6rem;
  }

  .logo-text {
    background: linear-gradient(135deg, #f1f5f9, #94a3b8);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .live-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: #22c55e;
      animation: ${pulseRing} 2s ease-out infinite;
    }
  }
`;

const ProfileArea = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }
`;

const Greeting = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: #94a3b8;

  .highlight {
    color: #f1f5f9;
    font-weight: 600;
  }
`;

const ProfileAvatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  background: linear-gradient(135deg, #1a2332, #0a0f1f);
  border: 2px solid rgba(34, 197, 94, 0.3);
  color: #22c55e;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.05);

  &:hover {
    border-color: #22c55e;
    transform: scale(1.08) rotate(-3deg);
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.15);
  }

  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    border: 1px solid rgba(34, 197, 94, 0.1);
    animation: ${pulseRing} 2s ease-out infinite;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
`;

const LogoutButton = styled.button`
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.15);
  color: #ef4444;
  padding: 6px 14px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #ef4444;
    color: #0a0f1f;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
  }
`;

// ============================================
// SETTINGS CONTENT
// ============================================
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 30px 24px 60px;
  position: relative;
  z-index: 2;

  @media (max-width: 768px) {
    padding: 20px 16px 40px;
  }
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  animation: ${floatIn} 0.7s ease;

  .back-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    padding: 6px 14px;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.03);

    &:hover {
      color: #f1f5f9;
      background: rgba(255, 255, 255, 0.04);
      transform: translateX(-4px);
    }
  }

  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 12px;

    .icon {
      font-size: 1.5rem;
    }

    .gradient {
      background: linear-gradient(135deg, #f1f5f9, #94a3b8);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    h1 { font-size: 1.4rem; }
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  animation: ${floatIn} 0.9s ease;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsCard = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(34, 197, 94, 0.05);
    background: rgba(255, 255, 255, 0.03);
  }

  .card-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #f1f5f9;
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);

    .title-icon {
      font-size: 1.2rem;
    }
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 18px;

  label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: #94a3b8;
    margin-bottom: 5px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  .field-value {
    font-size: 0.95rem;
    color: #f1f5f9;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.03);
    min-height: 44px;
    display: flex;
    align-items: center;
  }

  .field-input {
    width: 100%;
    padding: 10px 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 10px;
    color: #f1f5f9;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    font-family: 'Inter', sans-serif;

    &:focus {
      outline: none;
      border-color: rgba(34, 197, 94, 0.3);
      box-shadow: 0 0 20px rgba(34, 197, 94, 0.05);
      background: rgba(255, 255, 255, 0.05);
    }

    &::placeholder {
      color: #4b5563;
    }
  }

  select.field-input {
    appearance: none;
    cursor: pointer;

    option {
      background: #0a0f1f;
      color: #f1f5f9;
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const SettingsButton = styled.button`
  padding: 8px 22px;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;

  &.primary {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #0a0f1f;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(34, 197, 94, 0.2);
    }
  }

  &.secondary {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: #f1f5f9;

    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }

  &.danger {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.15);
    color: #ef4444;

    &:hover {
      background: rgba(239, 68, 68, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.1);
    }
  }

  @media (max-width: 768px) {
    padding: 6px 16px;
    font-size: 0.75rem;
  }
`;

const DangerZone = styled.div`
  margin-top: 24px;
  padding: 18px 20px;
  border-radius: 14px;
  background: rgba(239, 68, 68, 0.03);
  border: 1px solid rgba(239, 68, 68, 0.06);

  .danger-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ef4444;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .danger-desc {
    font-size: 0.75rem;
    color: #94a3b8;
    margin-bottom: 12px;
  }
`;

const SuccessMessage = styled.div`
  background: rgba(34, 197, 94, 0.06);
  border: 1px solid rgba(34, 197, 94, 0.1);
  color: #4ade80;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${floatIn} 0.4s ease;
`;

// ============================================
// MAIN COMPONENT
// ============================================

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('Trader');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    email: ''
  });

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

    setFormData({
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      phone: userData.phone || '',
      date_of_birth: userData.date_of_birth || '',
      gender: userData.gender || '',
      email: userData.email || ''
    });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    const fullName = `${formData.first_name} ${formData.last_name}`.trim() || 'Trader';
    setGreeting(fullName);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChangePassword = () => {
    alert('Password change functionality will be implemented here.');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`;
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'T';
  };

  return (
    <>
      <GlobalStyle />

      <BackgroundContainer>
        <GradientOrb />
        <GradientOrb />
        <GradientOrb />
        <GridOverlay />
      </BackgroundContainer>

      <Topbar>
        <Brand to="/dashboard">
          <span className="logo-icon">🔷</span>
          <span className="logo-text">Voltix Traders</span>
          <span className="live-dot" />
        </Brand>
        <ProfileArea>
          <Greeting>
            👋 <span className="highlight">{greeting}</span>
          </Greeting>
          <ProfileAvatar>{getInitials()}</ProfileAvatar>
          <LogoutButton onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }}>🚪 Logout</LogoutButton>
        </ProfileArea>
      </Topbar>

      <Container>
        <SettingsHeader>
          <Link to="/marketsdash" className="back-link">
            ← Back to Dashboard
          </Link>
          <h1>
            <span className="icon">⚙️</span>
            <span className="gradient">Account Settings</span>
          </h1>
        </SettingsHeader>

        {showSuccess && (
          <SuccessMessage>
            ✅ Profile updated successfully!
          </SuccessMessage>
        )}

        <SettingsGrid>
          {/* Personal Information Card */}
          <SettingsCard>
            <div className="card-title">
              <span className="title-icon">👤</span>
              Personal Information
            </div>

            <FormGroup>
              <label>First Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="first_name"
                  className="field-input"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                />
              ) : (
                <div className="field-value">{formData.first_name || 'Not set'}</div>
              )}
            </FormGroup>

            <FormGroup>
              <label>Last Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="last_name"
                  className="field-input"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                />
              ) : (
                <div className="field-value">{formData.last_name || 'Not set'}</div>
              )}
            </FormGroup>

            <FormGroup>
              <label>Email Address</label>
              <div className="field-value" style={{ color: '#94a3b8' }}>
                {formData.email || 'Not set'}
              </div>
            </FormGroup>

            <FormGroup>
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  className="field-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="field-value">{formData.phone || 'Not set'}</div>
              )}
            </FormGroup>

            <FormGroup>
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="date_of_birth"
                  className="field-input"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="field-value">{formData.date_of_birth || 'Not set'}</div>
              )}
            </FormGroup>

            <FormGroup>
              <label>Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  className="field-input"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              ) : (
                <div className="field-value">
                  {formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 'Not set'}
                </div>
              )}
            </FormGroup>

            <ButtonRow>
              {isEditing ? (
                <>
                  <SettingsButton className="primary" onClick={handleSaveProfile}>
                    💾 Save Changes
                  </SettingsButton>
                  <SettingsButton className="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </SettingsButton>
                </>
              ) : (
                <SettingsButton className="primary" onClick={() => setIsEditing(true)}>
                  ✏️ Edit Profile
                </SettingsButton>
              )}
            </ButtonRow>
          </SettingsCard>

          {/* Security Card */}
          <SettingsCard>
            <div className="card-title">
              <span className="title-icon">🔒</span>
              Security & Privacy
            </div>

            <FormGroup>
              <label>Password</label>
              <div className="field-value" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>••••••••</span>
                <SettingsButton className="secondary" onClick={handleChangePassword}>
                  Change Password
                </SettingsButton>
              </div>
            </FormGroup>

            <FormGroup>
              <label>Account Created</label>
              <div className="field-value" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </FormGroup>

            <DangerZone>
              <div className="danger-title">
                ⚠️ Danger Zone
              </div>
              <div className="danger-desc">
                Permanently delete your account and all associated data. This action cannot be undone.
              </div>
              <SettingsButton className="danger" onClick={handleDeleteAccount}>
                🗑️ Delete Account
              </SettingsButton>
            </DangerZone>
          </SettingsCard>
        </SettingsGrid>
      </Container>
    </>
  );
};

export default Settings;