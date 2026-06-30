// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
import Settings from './pages/Settings';
import RiskCalculator from './components/RiskCalculator';
import Academy from './pages/Academy';
import AccountInfo from './pages/AccountInfo';  // ✅ CORRECTED: './pages/AccountInfo'

const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<Authentication />} />
      <Route path="/forgotpass" element={<Forgotpass />} />
      <Route path="/verifyresetcode" element={<Verifyresetcode />} />
      <Route path="/resetpass" element={<Resetpass />} />
      <Route path="/academy" element={<Academy />} />

      {/* Dashboard Pages */}
      <Route path="/marketsdash" element={<Marketsdash />} />
      <Route path="/derivhome" element={<Derivhome />} />
      <Route path="/binancehome" element={<Binancehome />} />
      <Route path="/forexhome" element={<Forexhome />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/risk-calculator" element={<RiskCalculator />} />
      <Route path="/account-info" element={<AccountInfo />} />  {/* ✅ ROUTE ADDED */}

      {/* Deriv Trading Dashboard */}
      <Route path="/derivdash" element={<Derivdash />} />
    </Routes>
  );
};

export default App;