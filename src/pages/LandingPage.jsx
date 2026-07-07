import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <HeroSection 
      setStarted={() => navigate('/explore')} 
      setShowLogin={() => navigate('/login')} 
    />
  );
}
