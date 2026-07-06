import React from 'react';

export default function SiteCard({ site, userVote, onVote }) {
  return (
    <div className="group relative w-full aspect-[3/4] cursor-pointer">
      <a 
        href={site.url || "#"} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-full h-full rounded-xl overflow-hidden shadow-md border-2 border-transparent group-hover:border-accent transition-all duration-300 relative block"
      >
        <img src={site.cover_url} alt={site.title} className="w-full h-full object-cover" />
        
        <div className="absolute top-2 right-2 flex flex-col items-center bg-accent bg-opacity-95 rounded-md p-1 shadow-lg z-40 pointer-events-auto opacity-90 hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => onVote(e, site.id, 1, site.score)}
            className={`p-0.5 transition-colors ${userVote === 1 ? 'text-green-500 font-black scale-125' : 'text-primary hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 15l7-7 7 7"></path></svg>
          </button>
          <span className={`font-bold text-[10px] py-1 ${userVote ? 'text-white' : 'text-primary'}`}>{site.score}</span>
          <button 
            onClick={(e) => onVote(e, site.id, -1, site.score)}
            className={`p-0.5 transition-colors ${userVote === -1 ? 'text-red-500 font-black scale-125' : 'text-primary hover:text-white'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 9l-7 7-7-7"></path></svg>
          </button>
        </div>

        <div className="absolute inset-0 z-30 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none pb-2 px-2">
          <div className="bg-accent w-full p-2.5 rounded-lg shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <h4 className="text-primary font-bold text-xs mb-1">{site.title}</h4>
            <p className="text-primary text-[10px] leading-tight opacity-90">{site.description || site.desc}</p>
          </div>
        </div>
      </a>
      
      <div className="mt-2 text-center px-1">
        <h3 className="text-xs font-bold text-accent line-clamp-1">{site.title}</h3>
        <p className="text-[10px] text-accent opacity-70 uppercase tracking-wider mt-0.5">{site.category}</p>
      </div>
    </div>
  );
}
