import React, { useState, useEffect } from 'react';

const INITIAL_SITES = [
  {
    id: 1,
    title: "Space Journey",
    desc: "Explore the vastness of the universe, planets, and galaxies.",
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
    category: "Space",
    score: 0
  },
  {
    id: 2,
    title: "Scale of the Universe",
    desc: "Zoom from the smallest quantum particles to the observable universe.",
    cover: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    category: "Physics",
    score: 0
  },
  {
    id: 3,
    title: "World Radio",
    desc: "Listen to live radio stations from across the globe in real-time.",
    cover: "https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=600&auto=format&fit=crop",
    category: "Audio",
    score: 0
  },
  {
    id: 4,
    title: "Nuke Simulator",
    desc: "Simulate the effects of nuclear detonations on any location on Earth.",
    cover: "https://images.unsplash.com/photo-1506452586616-65481d6f4e24?q=80&w=600&auto=format&fit=crop",
    category: "Simulation",
    score: 0
  },
  {
    id: 5,
    title: "Fluid Simulator",
    desc: "An interactive WebGL fluid simulation that responds to your touch.",
    cover: "https://images.unsplash.com/photo-1550859491-1f0f3531fb17?q=80&w=600&auto=format&fit=crop",
    category: "Simulation",
    score: 0
  },
  {
    id: 6,
    title: "The Deep Sea",
    desc: "Scroll down to explore the ocean depths and the creatures that live there.",
    cover: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?q=80&w=600&auto=format&fit=crop",
    category: "Nature",
    score: 0
  },
  {
    id: 7,
    title: "Virtual Museum",
    desc: "Walk through historical artifacts from around the globe in 3D.",
    cover: "https://images.unsplash.com/photo-1518998053401-a41490196236?q=80&w=600&auto=format&fit=crop",
    category: "Education",
    score: 0
  },
  {
    id: 8,
    title: "Asteroid Tracker",
    desc: "Live tracking of near-Earth objects and their trajectories.",
    cover: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=600&auto=format&fit=crop",
    category: "Space",
    score: 0
  }
];

const CATEGORIES = ["All", "Space", "Physics", "Simulation", "Nature", "Audio", "Education"];

function App() {
  const [started, setStarted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sites, setSites] = useState([...INITIAL_SITES].sort((a, b) => b.score - a.score));
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (started) {
      setTimeout(() => setVisible(true), 100);
    }
  }, [started]);

  const handleVote = (e, id, delta) => {
    e.stopPropagation();
    setSites(prev => {
      const newSites = prev.map(s => s.id === id ? { ...s, score: s.score + delta } : s);
      return newSites.sort((a, b) => b.score - a.score);
    });
  };

  const filteredSites = sites.filter(s => activeCategory === "All" || s.category === activeCategory);

  if (!started) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 text-center transition-all duration-700">
        <main className="max-w-3xl space-y-6">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-primary uppercase bg-accent rounded-full">
            All-in-One Directory
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-accent tracking-tight">
            AroundTheSites.
          </h1>
          <p className="text-lg md:text-xl text-accent leading-relaxed max-w-2xl mx-auto font-medium">
            One place for the most unique websites on the internet.
          </p>
          
          <div className="pt-8">
            <button 
              onClick={() => setStarted(true)}
              className="px-8 py-3 bg-accent text-primary font-bold rounded-lg hover:bg-opacity-90 transition-all duration-200 shadow-lg transform hover:scale-105"
            >
              Start
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary relative pb-20">
      <nav className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-primary bg-opacity-95 backdrop-blur-sm shadow-sm">
        <div className="text-xl font-bold text-accent tracking-tight">AroundTheSites.</div>
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 bg-accent rounded-md focus:outline-none"
          >
            <span className="block w-6 h-0.5 bg-primary"></span>
            <span className="block w-6 h-0.5 bg-primary"></span>
            <span className="block w-6 h-0.5 bg-primary"></span>
          </button>
          
          {menuOpen && (
            <div className="absolute top-14 right-0 w-48 bg-accent rounded-lg shadow-xl py-2 animate-fade-in">
              <a href="#" className="block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-20 font-medium transition-colors">Home</a>
              <a href="#" className="block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-20 font-medium transition-colors">Categories</a>
              <a href="#" className="block px-4 py-2 text-primary hover:bg-black hover:bg-opacity-20 font-medium transition-colors">About</a>
            </div>
          )}
        </div>
      </nav>

      <main className={`pt-28 px-6 md:px-12 max-w-[1400px] mx-auto transition-all duration-1000 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h2 className="text-3xl font-bold text-accent">Curated Collection</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${activeCategory === cat ? 'bg-accent text-primary' : 'bg-transparent text-accent border-2 border-accent hover:bg-accent hover:text-primary'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {filteredSites.map((site) => (
            <div key={site.id} className="group relative w-full aspect-[3/4] cursor-pointer">
              <div className="w-full h-full rounded-xl overflow-hidden shadow-md border-2 border-transparent group-hover:border-accent transition-all duration-300 relative">
                <img src={site.cover} alt={site.title} className="w-full h-full object-cover" />
                
                <div className="absolute top-2 right-2 flex flex-col items-center bg-accent bg-opacity-95 rounded-md p-1 shadow-lg z-40 pointer-events-auto opacity-90 hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleVote(e, site.id, 1)}
                    className="p-0.5 text-primary hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7"></path></svg>
                  </button>
                  <span className="text-primary font-bold text-[10px] py-1">{site.score}</span>
                  <button 
                    onClick={(e) => handleVote(e, site.id, -1)}
                    className="p-0.5 text-primary hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                </div>

                <div className="absolute inset-0 z-30 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none pb-2 px-2">
                  <div className="bg-accent w-full p-2.5 rounded-lg shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="text-primary font-bold text-xs mb-1">{site.title}</h4>
                    <p className="text-primary text-[10px] leading-tight opacity-90">{site.desc}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-center px-1">
                <h3 className="text-xs font-bold text-accent line-clamp-1">{site.title}</h3>
                <p className="text-[10px] text-accent opacity-70 uppercase tracking-wider mt-0.5">{site.category}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
