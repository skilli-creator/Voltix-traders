// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Index from './pages/Index';
import Academy from './pages/Academy';
import Derivdash from './pages/Derivdash';
import ForexDash from './pages/forexdash';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/academy" element={<Academy />} />

      <Route path="/derivdash" element={<Derivdash />} />

      {/* Forex dashboards — parent + sub-routes */}
      <Route path="/forexdash" element={<ForexDash />} />
      <Route path="/forexdash/:view" element={<ForexDash />} />
    </Routes>
  );
};

export default App;