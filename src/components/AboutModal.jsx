import React from 'react';

export default function AboutModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-primary/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="bg-primary border-4 border-accent p-8 sm:p-10 rounded-[2rem] max-w-md w-full shadow-[12px_12px_0_0] shadow-accent relative transform transition-all" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-accent hover:scale-110 transition-transform bg-primary border-2 border-accent rounded-full p-1 z-10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <div className="mb-6">
          <h3 className="text-3xl md:text-4xl font-black text-accent mb-3 tracking-tight uppercase">About ATS</h3>
          <div className="h-1.5 w-16 bg-accent mb-4"></div>
        </div>

        <p className="text-accent/90 font-medium text-base md:text-lg leading-relaxed mb-8">
          AroundTheSites (ATS) is a curated directory built to gather the most unique, interesting, and interactive websites from all over the world, making them easily accessible for everyone to explore and enjoy.
        </p>
        
        <div className="pt-6 border-t-4 border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-accent/70 font-bold uppercase tracking-wider text-sm">Created By</span>
          <a href="https://github.com/akbar-kurnia1" target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-accent text-primary font-black uppercase tracking-wider rounded-xl hover:bg-primary hover:text-accent border-4 border-accent hover:shadow-[4px_4px_0_0] hover:shadow-accent transition-all duration-200 text-sm">
            @akbar-kurnia1
          </a>
        </div>
      </div>
    </div>
  );
}
