// Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Inter', -apple-system, sans-serif;
    background: #040810;
    color: #e2e8f0;
    min-height: 100vh;
    overflow-x: hidden;
    font-size: 13px;
  }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #040810; }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #22c55e 0%, #0ea5e9 100%);
    border-radius: 4px;
  }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const breathe = keyframes`
  0%,100% { opacity: 0.08; transform: scale(1); }
  50%      { opacity: 0.18; transform: scale(1.06); }
`;
const pulseRing = keyframes`
  0%   { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.4); opacity: 0; }
`;

const BG = styled.div`
  position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
`;
const Orb = styled.div`
  position: absolute; border-radius: 50%; filter: blur(110px);
  animation: ${breathe} 9s ease-in-out infinite;
  &:nth-child(1){width:520px;height:520px;top:-220px;right:-160px;background:radial-gradient(circle,rgba(34,197,94,.07),transparent 68%);animation-delay:0s;}
  &:nth-child(2){width:420px;height:420px;bottom:-160px;left:-110px;background:radial-gradient(circle,rgba(14,165,233,.06),transparent 68%);animation-delay:-3s;}
  &:nth-child(3){width:280px;height:280px;top:55%;left:50%;transform:translate(-50%,-50%);background:radial-gradient(circle,rgba(139,92,246,.04),transparent 68%);animation-delay:-6s;}
`;
const Grid = styled.div`
  position:absolute;inset:0;
  background-image:linear-gradient(rgba(14,165,233,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,.012) 1px,transparent 1px);
  background-size:44px 44px;opacity:.4;
`;

const Topbar = styled.div`
  display:flex;justify-content:space-between;align-items:center;
  padding:11px 28px;
  background:rgba(4,8,16,.85);backdrop-filter:blur(24px);
  border-bottom:1px solid rgba(255,255,255,.04);
  position:sticky;top:0;z-index:100;
  animation:${fadeUp} .5s ease;
  @media(max-width:768px){padding:10px 14px;flex-direction:column;gap:8px;}
`;
const Brand = styled(Link)`
  display:flex;align-items:center;gap:9px;font-family:'Syne',sans-serif;
  font-size:1.1rem;font-weight:800;text-decoration:none;
  .logo{font-size:1.3rem;}
  .name{background:linear-gradient(135deg,#f1f5f9,#94a3b8);-webkit-background-clip:text;background-clip:text;color:transparent;}
  .dot{width:7px;height:7px;border-radius:50%;background:#22c55e;position:relative;
    &::before{content:'';position:absolute;inset:-3px;border-radius:50%;background:#22c55e;animation:${pulseRing} 2.2s ease-out infinite;}}
`;
const ProfileArea = styled.div`
  display:flex;align-items:center;gap:12px;
  @media(max-width:768px){flex-wrap:wrap;justify-content:center;gap:7px;}
`;
const Greeting = styled.span`
  font-size:11.5px;font-weight:500;color:#64748b;
  .hi{color:#e2e8f0;font-weight:600;}
`;
const Avatar = styled.div`
  width:38px;height:38px;border-radius:50%;
  background:linear-gradient(135deg,#0f1c2e,#080d1a);
  border:1.5px solid rgba(34,197,94,.28);
  color:#22c55e;font-weight:700;font-size:13px;
  display:flex;align-items:center;justify-content:center;
  text-transform:uppercase;cursor:pointer;transition:all .3s ease;position:relative;
  &::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:1px solid rgba(34,197,94,.08);animation:${pulseRing} 2.2s ease-out infinite;}
  &:hover{border-color:#22c55e;transform:scale(1.07) rotate(-4deg);box-shadow:0 0 24px rgba(34,197,94,.14);}
`;
const LogoutBtn = styled.button`
  background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.14);
  color:#ef4444;padding:5px 12px;border-radius:20px;cursor:pointer;
  font-size:10.5px;font-weight:500;transition:all .3s ease;font-family:inherit;
  &:hover{background:#ef4444;color:#040810;transform:translateY(-1px);box-shadow:0 4px 16px rgba(239,68,68,.18);}
`;

const Container = styled.div`
  max-width:880px;margin:0 auto;padding:26px 20px 56px;
  position:relative;z-index:2;
  @media(max-width:768px){padding:16px 13px 36px;}
`;
const PageHeader = styled.div`
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:26px;animation:${fadeUp} .6s ease;
  .back{display:flex;align-items:center;gap:6px;color:#64748b;text-decoration:none;
    font-size:11px;transition:all .3s ease;padding:5px 12px;border-radius:20px;
    background:rgba(255,255,255,.015);border:1px solid rgba(255,255,255,.025);
    &:hover{color:#e2e8f0;transform:translateX(-3px);background:rgba(255,255,255,.03);}
  }
  h1{font-family:'Syne',sans-serif;font-size:1.45rem;font-weight:800;
    display:flex;align-items:center;gap:10px;
    span.grad{background:linear-gradient(135deg,#f1f5f9 30%,#64748b);
      -webkit-background-clip:text;background-clip:text;color:transparent;}
  }
  @media(max-width:768px){flex-direction:column;align-items:stretch;gap:10px;h1{font-size:1.2rem;}}
`;
const Grid2 = styled.div`
  display:grid;grid-template-columns:1fr 1fr;gap:18px;
  animation:${fadeUp} .8s ease;
  @media(max-width:860px){grid-template-columns:1fr;}
`;

const Card = styled.div`
  background:rgba(255,255,255,.018);backdrop-filter:blur(16px);
  border-radius:18px;padding:22px;
  border:1px solid rgba(255,255,255,.03);
  transition:border-color .3s ease,background .3s ease;
  &:hover{border-color:rgba(34,197,94,.06);background:rgba(255,255,255,.025);}
  .card-head{display:flex;align-items:center;gap:8px;font-size:11.5px;font-weight:600;
    color:#e2e8f0;margin-bottom:18px;padding-bottom:12px;
    border-bottom:1px solid rgba(255,255,255,.03);
    .icon{font-size:1rem;}
  }
`;

const Field = styled.div`
  margin-bottom:14px;
  label{display:block;font-size:9.5px;font-weight:600;color:#475569;
    margin-bottom:4px;letter-spacing:.6px;text-transform:uppercase;}
  .val{font-size:12px;color:#e2e8f0;padding:8px 12px;
    background:rgba(255,255,255,.025);border-radius:9px;
    border:1px solid rgba(255,255,255,.028);min-height:38px;
    display:flex;align-items:center;justify-content:space-between;}
  input.inp,select.inp{
    width:100%;padding:8px 12px;background:rgba(255,255,255,.025);
    border:1px solid rgba(255,255,255,.05);border-radius:9px;color:#e2e8f0;
    font-size:12px;transition:all .3s ease;font-family:inherit;
    &:focus{outline:none;border-color:rgba(34,197,94,.28);
      box-shadow:0 0 16px rgba(34,197,94,.05);background:rgba(255,255,255,.04);}
    &::placeholder{color:#374151;}
    &.err{border-color:rgba(239,68,68,.3);}
  }
  select.inp{appearance:none;cursor:pointer;
    option{background:#040810;color:#e2e8f0;}}
  .err-msg{font-size:9.5px;color:#ef4444;margin-top:3px;display:flex;align-items:center;gap:4px;}
  .age-badge{font-size:9px;color:#4ade80;background:rgba(34,197,94,.06);
    padding:2px 10px;border-radius:20px;border:1px solid rgba(34,197,94,.06);
    font-weight:500;margin-left:10px;white-space:nowrap;}
`;

const BtnRow = styled.div`
  display:flex;gap:8px;margin-top:18px;flex-wrap:wrap;
`;
const Btn = styled.button`
  padding:7px 18px;border-radius:20px;font-size:10.5px;font-weight:600;
  cursor:pointer;transition:all .3s ease;border:none;
  display:inline-flex;align-items:center;gap:5px;font-family:inherit;
  &.primary{background:linear-gradient(135deg,#22c55e,#16a34a);color:#040810;
    &:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(34,197,94,.22);}
  }
  &.secondary{background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.055);color:#e2e8f0;
    &:hover{background:rgba(255,255,255,.06);}
  }
  &.danger{background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.14);color:#ef4444;
    &:hover{background:rgba(239,68,68,.14);transform:translateY(-2px);box-shadow:0 8px 20px rgba(239,68,68,.1);}
  }
  &.whatsapp{background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;
    &:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(37,211,102,.3);}
  }
  &.admin{background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);color:#a78bfa;
    &:hover{background:rgba(139,92,246,.18);transform:translateY(-2px);box-shadow:0 8px 20px rgba(139,92,246,.12);}
  }
  &:disabled{opacity:.45;cursor:not-allowed;transform:none!important;}
  @media(max-width:768px){padding:6px 13px;font-size:9.5px;}
`;

const DangerZone = styled.div`
  margin-top:20px;padding:16px 18px;border-radius:12px;
  background:rgba(239,68,68,.025);border:1px solid rgba(239,68,68,.055);
  .dtitle{display:flex;align-items:center;gap:6px;color:#ef4444;font-size:11px;font-weight:600;margin-bottom:3px;}
  .ddesc{font-size:10px;color:#64748b;margin-bottom:10px;}
`;
const SupportSection = styled.div`
  margin-top:20px;padding:16px 18px;border-radius:12px;
  background:rgba(139,92,246,.03);border:1px solid rgba(139,92,246,.08);
  .stitle{display:flex;align-items:center;gap:6px;color:#a78bfa;font-size:11px;font-weight:600;margin-bottom:3px;}
  .sdesc{font-size:10px;color:#64748b;margin-bottom:12px;}
`;
const ContactRow = styled.div`display:flex;gap:8px;flex-wrap:wrap;`;
const Success = styled.div`
  background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.1);
  color:#4ade80;padding:8px 14px;border-radius:9px;font-size:11px;
  margin-bottom:14px;display:flex;align-items:center;gap:7px;
  animation:${fadeUp} .4s ease;
`;
const AdminModal = styled.div`
  position:fixed;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;
  background:rgba(4,8,16,.85);backdrop-filter:blur(8px);animation:${fadeUp} .3s ease;
`;
const ModalBox = styled.div`
  background:#0a1120;border:1px solid rgba(139,92,246,.18);border-radius:20px;
  padding:28px;width:100%;max-width:420px;margin:0 16px;position:relative;
  h2{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;
    background:linear-gradient(135deg,#a78bfa,#818cf8);-webkit-background-clip:text;background-clip:text;color:transparent;
    margin-bottom:6px;}
  p{font-size:11px;color:#64748b;margin-bottom:18px;}
  textarea{width:100%;min-height:110px;background:rgba(255,255,255,.025);
    border:1px solid rgba(255,255,255,.06);border-radius:10px;color:#e2e8f0;
    font-size:12px;padding:10px 13px;resize:vertical;font-family:inherit;
    &:focus{outline:none;border-color:rgba(139,92,246,.3);background:rgba(255,255,255,.04);}
    &::placeholder{color:#374151;}}
  .close{position:absolute;top:14px;right:16px;background:none;border:none;
    color:#64748b;font-size:18px;cursor:pointer;transition:color .2s;
    &:hover{color:#e2e8f0;}}
`;

const Settings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState('Trader');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dobError, setDobError] = useState('');
  const [calculatedAge, setCalculatedAge] = useState(null);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [adminSent, setAdminSent] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', phone: '',
    date_of_birth: '', gender: '', email: ''
  });

  const calculateAge = (dob) => {
    if (!dob) return null;
    const b = new Date(dob), t = new Date();
    let age = t.getFullYear() - b.getFullYear();
    const m = t.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < b.getDate())) age--;
    return age;
  };

  const getMaxDate = () => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 10);
    return d.toISOString().split('T')[0];
  };

  const validateDob = (dob) => {
    if (!dob) { setDobError(''); setCalculatedAge(null); return true; }
    const birthDate = new Date(dob);
    const maxDate = new Date(getMaxDate());
    if (birthDate > maxDate) {
      setDobError('You must be at least 10 years old');
      setCalculatedAge(null); return false;
    }
    setCalculatedAge(calculateAge(dob));
    setDobError(''); return true;
  };

  const handleDobChange = (e) => {
    const v = e.target.value;
    setFormData(p => ({ ...p, date_of_birth: v }));
    validateDob(v);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token) { navigate('/login'); return; }
    setUser(userData);
    const full = `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Trader';
    setGreeting(full);
    const dob = userData.date_of_birth || '';
    setFormData({
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      phone: userData.phone || '',
      date_of_birth: dob,
      gender: userData.gender || '',
      email: userData.email || ''
    });
    if (dob) { setCalculatedAge(calculateAge(dob)); validateDob(dob); }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSave = () => {
    if (formData.date_of_birth && !validateDob(formData.date_of_birth)) return;
    const updated = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
    setGreeting(`${formData.first_name} ${formData.last_name}`.trim() || 'Trader');
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = () => {
    if (window.confirm('Delete your account? This cannot be undone.')) {
      localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login');
    }
  };

  const handleSendAdmin = () => {
    if (!adminMessage.trim()) return;
    // Wire this to your backend API
    setAdminSent(true);
    setTimeout(() => { setShowAdminModal(false); setAdminSent(false); setAdminMessage(''); }, 2000);
  };

  const openWhatsApp = () => {
    const phone = '254704182603';
    const msg = encodeURIComponent(`Hello Voltix Traders Support, I need assistance. My account: ${formData.email || 'N/A'}`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) return `${user.first_name[0]}${user.last_name[0]}`;
    if (user?.email) return user.email[0].toUpperCase();
    return 'T';
  };

  return (
    <>
      <GlobalStyle />
      <BG><Orb /><Orb /><Orb /><Grid /></BG>

      <Topbar>
        <Brand to="/dashboard">
          <span className="logo">🔷</span>
          <span className="name">Voltix Traders</span>
          <span className="dot" />
        </Brand>
        <ProfileArea>
          <Greeting>👋 <span className="hi">{greeting}</span></Greeting>
          <Avatar>{getInitials()}</Avatar>
          <LogoutBtn onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }}>
            🚪 Logout
          </LogoutBtn>
        </ProfileArea>
      </Topbar>

      <Container>
        <PageHeader>
          <Link to="/marketsdash" className="back">← Dashboard</Link>
          <h1>⚙️ <span className="grad">Account Settings</span></h1>
        </PageHeader>

        {showSuccess && <Success>✅ Profile updated successfully!</Success>}

        <Grid2>
          <Card>
            <div className="card-head"><span className="icon">👤</span> Personal Information</div>
            {[
              { label: 'First Name', name: 'first_name', type: 'text', placeholder: 'First name' },
              { label: 'Last Name', name: 'last_name', type: 'text', placeholder: 'Last name' },
              { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: 'Phone number' },
            ].map(f => (
              <Field key={f.name}>
                <label>{f.label}</label>
                {isEditing
                  ? <input type={f.type} name={f.name} className="inp" value={formData[f.name]} onChange={handleInputChange} placeholder={f.placeholder} />
                  : <div className="val">{formData[f.name] || 'Not set'}</div>
                }
              </Field>
            ))}
            <Field>
              <label>Email Address</label>
              <div className="val" style={{ color: '#64748b' }}>{formData.email || 'Not set'}</div>
            </Field>
            <Field>
              <label>Date of Birth</label>
              {isEditing ? (
                <>
                  <input type="date" name="date_of_birth" className={`inp${dobError ? ' err' : ''}`}
                    value={formData.date_of_birth} onChange={handleDobChange} max={getMaxDate()} />
                  {dobError && <div className="err-msg">⚠️ {dobError}</div>}
                  {formData.date_of_birth && !dobError && calculatedAge !== null && (
                    <div style={{ fontSize: '10px', color: '#4ade80', marginTop: '4px' }}>
                      ✓ Age: <strong>{calculatedAge}</strong> yrs
                    </div>
                  )}
                </>
              ) : (
                <div className="val">
                  <span>{formData.date_of_birth || 'Not set'}</span>
                  {formData.date_of_birth && calculatedAge !== null && (
                    <span className="age-badge">🎂 {calculatedAge} yrs</span>
                  )}
                </div>
              )}
            </Field>
            <Field>
              <label>Gender</label>
              {isEditing ? (
                <select name="gender" className="inp" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not">Prefer not to say</option>
                </select>
              ) : (
                <div className="val">
                  {formData.gender ? formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1) : 'Not set'}
                </div>
              )}
            </Field>
            <BtnRow>
              {isEditing ? (
                <>
                  <Btn className="primary" onClick={handleSave} disabled={!!dobError}>💾 Save</Btn>
                  <Btn className="secondary" onClick={() => {
                    setIsEditing(false); setDobError('');
                    setFormData(p => ({ ...p, date_of_birth: user?.date_of_birth || '' }));
                    if (user?.date_of_birth) setCalculatedAge(calculateAge(user.date_of_birth));
                  }}>Cancel</Btn>
                </>
              ) : (
                <Btn className="primary" onClick={() => setIsEditing(true)}>✏️ Edit Profile</Btn>
              )}
            </BtnRow>
          </Card>

          <Card>
            <div className="card-head"><span className="icon">🔒</span> Security & Privacy</div>
            <Field>
              <label>Password</label>
              <div className="val" style={{ justifyContent: 'space-between' }}>
                <span>••••••••</span>
                <Btn className="secondary" style={{ padding: '4px 11px', fontSize: '10px' }}
                  onClick={() => alert('Password change coming soon.')}>Change</Btn>
              </div>
            </Field>
            <Field>
              <label>Account Created</label>
              <div className="val" style={{ color: '#64748b', fontSize: '11px' }}>
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </Field>
            <SupportSection>
              <div className="stitle">💬 Need Help?</div>
              <div className="sdesc">Reach our support team via WhatsApp or message the admin directly.</div>
              <ContactRow>
                <Btn className="whatsapp" onClick={openWhatsApp}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Support
                </Btn>
                <Btn className="admin" onClick={() => setShowAdminModal(true)}>📨 Talk to Admin</Btn>
              </ContactRow>
            </SupportSection>
            <DangerZone>
              <div className="dtitle">⚠️ Danger Zone</div>
              <div className="ddesc">Permanently delete your account and all data. Cannot be undone.</div>
              <Btn className="danger" onClick={handleDelete}>🗑️ Delete Account</Btn>
            </DangerZone>
          </Card>
        </Grid2>
      </Container>

      {showAdminModal && (
        <AdminModal onClick={(e) => { if (e.target === e.currentTarget) setShowAdminModal(false); }}>
          <ModalBox>
            <button className="close" onClick={() => setShowAdminModal(false)}>×</button>
            <h2>📨 Message Admin</h2>
            <p>Describe your issue and our team will respond as soon as possible.</p>
            {adminSent ? (
              <Success>✅ Message sent! We'll get back to you shortly.</Success>
            ) : (
              <>
                <textarea value={adminMessage} onChange={e => setAdminMessage(e.target.value)} placeholder="Type your message here…" />
                <BtnRow style={{ marginTop: '12px' }}>
                  <Btn className="admin" onClick={handleSendAdmin} disabled={!adminMessage.trim()}>📨 Send Message</Btn>
                  <Btn className="secondary" onClick={() => setShowAdminModal(false)}>Cancel</Btn>
                </BtnRow>
              </>
            )}
          </ModalBox>
        </AdminModal>
      )}
    </>
  );
};

export default Settings;