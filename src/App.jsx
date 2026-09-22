// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Pages ONLY
import Index from './pages/Index';
import Derivdash from './pages/Derivdash';

// Import Components
import Academy from './pages/Academy';


const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Index />} />
           <Route path="/academy" element={<Academy />} />

  
      {/* Deriv Trading Dashboard */}
      <Route path="/derivdash" element={<Derivdash />} />
    </Routes>
  );
};

export default App;