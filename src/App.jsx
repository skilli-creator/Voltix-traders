import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

// Import Pages ONLY
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Authentication from './pages/Authentication';
import Forgotpass from './pages/Forgotpass';
import Verifyresetcode from './pages/Verifyresetcode';
import Resetpass from './pages/Resetpass';
import Marketsdash from './pages/Marketsdash';
import Derivhome from './pages/Derivhome';
import Derivdash from './pages/Derivdash';
import Binancehome from './pages/Binancehome';
import Forexhome from './pages/Forexhome';

// ============================================
// DASHBOARD LAYOUT
// ============================================

const DashboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0a0f1f;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// ============================================
// APP COMPONENT
// ============================================

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Authentication />} />
        <Route path="/forgotpass" element={<Forgotpass />} />
        <Route path="/verifyresetcode" element={<Verifyresetcode />} />
        <Route path="/resetpass" element={<Resetpass />} />

        {/* Dashboard Pages */}
        <Route path="/marketsdash" element={<Marketsdash />} />
        <Route path="/derivhome" element={<Derivhome />} />
        <Route path="/binancehome" element={<Binancehome />} />
        <Route path="/forexhome" element={<Forexhome />} />

        {/* Deriv Trading Dashboard */}
        <Route path="/derivdash" element={<Derivdash />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;