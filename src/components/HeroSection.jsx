import React from 'react';

export default function HeroSection({ setStarted, setShowLogin }) {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 text-center transition-all duration-700">
      <main className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold text-accent tracking-tight">
          AroundTheSites.
        </h1>
        <p className="text-lg md:text-xl text-accent leading-relaxed max-w-2xl mx-auto font-medium">
          One place for the most unique websites on the internet.
        </p>
        
        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <button 
              onClick={() => setStarted(true)}
              className="px-8 py-3 bg-accent border-4 border-accent text-primary font-bold rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Start without login
            </button>
            <button 
              onClick={() => setShowLogin(true)}
              className="px-8 py-3 bg-accent border-4 border-accent text-primary font-bold rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
