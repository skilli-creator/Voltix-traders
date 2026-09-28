// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import Index from './pages/Index';
import Academy from './pages/Academy';
import Derivdash from './pages/Derivdash';
import ForexDash from './pages/forexdash';

const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Index />} />
      <Route path="/academy" element={<Academy />} />

      {/* Deriv Trading Dashboard */}
      <Route path="/derivdash" element={<Derivdash />} />

      {/* Forex Trading Dashboard */}
      <Route path="/forexdash" element={<ForexDash />} />
    </Routes>
  );
};

export default App;