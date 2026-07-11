import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({
  loggedIn, setShowLogin, menuOpen, setMenuOpen,
  setStarted, setShowAbout, setShowSubmitSite, showAI, setShowAI, setActiveCategory, handleLogout
}) {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-primary bg-opacity-95 backdrop-blur-sm shadow-sm">
      <div className="text-xl font-bold text-accent tracking-tight flex items-center gap-3">
        <img src="/favicon.svg" alt="ATS Logo" className="w-8 h-8 rounded-lg shadow-md" />
        AroundTheSites.
      </div>
      <div className="flex items-center gap-4">
        {!loggedIn && (
          <button 
            onClick={() => setShowLogin(true)}
            className="px-5 py-1.5 bg-accent text-primary font-bold rounded-full text-sm hover:scale-105 transition-transform"
          >
            Login
          </button>
        )}
        <div className="flex items-center">
          {loggedIn && (
            <button 
              onClick={() => navigate('/bookmarks')}
              title="Bookmarks"
              className="w-10 h-10 flex items-center justify-center bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-primary rounded-full transition-colors mr-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
            </button>
          )}

          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 bg-accent rounded-md focus:outline-none shadow-md hover:bg-opacity-90 transition-colors"
          >
            <span className="block w-6 h-0.5 bg-primary"></span>
            <span className="block w-6 h-0.5 bg-primary"></span>
            <span className="block w-6 h-0.5 bg-primary"></span>
          </button>
          
          {menuOpen && (
            <div className="absolute top-14 right-0 w-48 bg-accent rounded-lg shadow-xl py-2 animate-fade-in border border-primary/10">
              {location.pathname !== '/explore' && (
                <button onClick={() => { navigate('/explore'); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-15 font-medium transition-colors">Home</button>
              )}
              <button onClick={() => { setShowAbout(true); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-15 font-medium transition-colors">About</button>
              <button 
                onClick={() => { 
                  if (loggedIn) {
                    setShowSubmitSite(true);
                  } else {
                    setShowLogin(true);
                  }
                  setMenuOpen(false); 
                }} 
                className="w-full text-left block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-15 font-medium transition-colors"
              >
                Submit a Site
              </button>
              
              {loggedIn && (
                <button onClick={() => { navigate('/profile'); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-15 font-medium transition-colors">
                  My Profile
                </button>
              )}
              
              <label className="w-full text-left flex items-center justify-between px-4 py-2 text-primary hover:bg-black hover:bg-opacity-15 font-medium transition-colors cursor-pointer">
                <span>Show AI Content</span>
                <input 
                  type="checkbox" 
                  checked={showAI} 
                  onChange={() => {
                    setShowAI(!showAI);
                    // If disabling AI and currently on AI category, reset to All
                    if (showAI) setActiveCategory("All");
                  }} 
                  className="accent-primary w-4 h-4 cursor-pointer"
                />
              </label>

              {loggedIn ? (
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-15 font-medium transition-colors border-t border-primary/10 mt-1 pt-2">Log Out</button>
              ) : (
                <button onClick={() => { setShowLogin(true); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-15 font-medium transition-colors border-t border-primary/10 mt-1 pt-2">Log In</button>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
}
