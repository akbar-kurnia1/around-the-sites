import React from 'react';

export default function AboutModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-primary border border-accent/20 p-8 rounded-2xl max-w-md w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-accent hover:text-white transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h3 className="text-2xl font-bold text-accent mb-4">About ATS.</h3>
        <p className="text-accent/80 leading-relaxed mb-6 text-sm">
          AroundTheSites (ATS) is a curated directory built to gather the most unique, interesting, and interactive websites from all over the world, making them easily accessible for everyone to explore and enjoy.
        </p>
        <div className="pt-4 border-t border-accent/20 text-accent/60 text-sm">
          Created by <a href="https://github.com/akbar-kurnia1" target="_blank" rel="noopener noreferrer" className="text-accent font-bold hover:underline">akbar-kurnia1</a>
        </div>
      </div>
    </div>
  );
}
