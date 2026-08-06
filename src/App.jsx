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
import Derivdash from './pages/Derivdash';
import PaymentAgentDashboard from './pages/PaymentAgentDashboard';

// Import Components
import Academy from './pages/Academy';


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
      
      {/* Trading Tools */}
      <Route path="/payment-dashboard" element={<PaymentAgentDashboard />} />

      {/* Deriv Trading Dashboard */}
      <Route path="/derivdash" element={<Derivdash />} />
    </Routes>
  );
};

export default App;