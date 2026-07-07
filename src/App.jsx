import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useToast } from './hooks/useToast';
import { useAuth } from './hooks/useAuth';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

function App() {
  const { toast, showToast } = useToast();
  const auth = useAuth(showToast);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage toast={toast} showToast={showToast} auth={auth} />} />
      <Route path="/explore" element={<Dashboard toast={toast} showToast={showToast} auth={auth} />} />
    </Routes>
  );
}

export default App;
