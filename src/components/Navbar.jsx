import React from 'react';

export default function Navbar({
  loggedIn, setShowLogin, menuOpen, setMenuOpen,
  setStarted, setShowAbout, setShowSubmitSite, showAI, setShowAI, setActiveCategory, handleLogout
}) {
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
              <button onClick={() => { setStarted(false); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-15 font-medium transition-colors">Home</button>
              <button onClick={() => { setShowAbout(true); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-15 font-medium transition-colors">About</button>
              <button onClick={() => { setShowSubmitSite(true); setMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-15 font-medium transition-colors">Submit a Site</button>
              
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
    </nav>
  );
}
