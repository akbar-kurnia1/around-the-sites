import React from 'react';

export default function SiteCard({ site, userVote, onVote, auth }) {
  const isBookmarked = auth?.userBookmarks?.has(site.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (auth && auth.toggleBookmark) {
      auth.toggleBookmark(site.id);
    }
  };

  return (
    <div className="group relative w-full aspect-[3/4] cursor-pointer">
      <a 
        href={site.url || "#"} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-full h-full rounded-xl overflow-hidden shadow-md border-2 border-transparent group-hover:border-accent transition-all duration-300 relative block"
      >
        <img src={site.cover_url} alt={site.title} className="w-full h-full object-cover" />
        
        {/* Bookmark Button */}
        {auth?.loggedIn && (
          <button
            onClick={handleBookmark}
            className={`absolute top-2 left-2 p-2 rounded-full z-40 shadow-md pointer-events-auto transition-colors ${isBookmarked ? 'bg-accent text-primary' : 'bg-primary/80 text-accent hover:bg-accent hover:text-primary'}`}
            title="Bookmark this site"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </button>
        )}

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
            <p className="text-primary text-[10px] leading-tight opacity-90 line-clamp-2">{site.description || site.desc}</p>
            {site.tags && site.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {site.tags.map(tag => (
                  <span key={tag} className="text-[8px] font-bold px-1.5 py-0.5 rounded-sm bg-primary/20 text-primary">#{tag}</span>
                ))}
              </div>
            )}
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
