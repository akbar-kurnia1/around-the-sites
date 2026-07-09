import React, { useState, useEffect } from 'react';
import { useSites } from '../hooks/useSites';
import Navbar from '../components/Navbar';
import AboutModal from '../components/AboutModal';
import SubmitSiteModal from '../components/SubmitSiteModal';
import Toast from '../components/Toast';
import SiteGrid from '../components/SiteGrid';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ auth, toast, showToast }) {
  const navigate = useNavigate();
  const {
    loading, dbError,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    showAI, setShowAI,
    currentPage, setCurrentPage,
    totalPages,
    sites,
    visibleCategories,
    handleVote
  } = useSites(showToast, auth.loggedIn, auth.userVotes, auth.setUserVotes);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSubmitSite, setShowSubmitSite] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleSiteSubmit = async (data) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      showToast("You must be logged in to submit a site.", "error");
      return;
    }

    const { error } = await supabase.from('submissions').insert([
      {
        title: data.title,
        url: data.url,
        category: data.category,
        description: data.description,
        submitter_name: data.submitter_name || null,
        submitter_email: session.user.email
      }
    ]);

    if (error) {
      console.error("Submission Error:", error);
      showToast(`Submission failed: ${error.message}`, "error");
    } else {
      setShowSubmitSite(false);
      showToast("Website submitted for review! Thank you.", "success");
    }
  };


  return (
    <div className="min-h-screen bg-primary relative pb-20">
      <Toast toast={toast} />

      {showAbout && (
        <AboutModal onClose={() => setShowAbout(false)} />
      )}

      {showSubmitSite && (
        <SubmitSiteModal onClose={() => setShowSubmitSite(false)} onSubmit={handleSiteSubmit} />
      )}

      <Navbar
        loggedIn={auth.loggedIn} 
        setShowLogin={() => navigate('/login')}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen}
        setStarted={(val) => { if (!val) navigate('/'); }} 
        setShowAbout={setShowAbout} setShowSubmitSite={setShowSubmitSite}
        showAI={showAI} setShowAI={setShowAI} setActiveCategory={setActiveCategory}
        handleLogout={auth.handleLogout}
      />

      <main className={`pt-28 px-6 md:px-12 max-w-[1400px] mx-auto transition-all duration-1000 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

        {dbError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            <strong>Database Alert:</strong> {dbError}
          </div>
        )}

        {!auth.loggedIn && (
          <div className="mb-8 p-4 bg-accent/10 border border-accent/20 rounded-lg text-accent text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <span>We recommend logging in for the optimal experience and voting capabilities.</span>
            <button
              onClick={() => { navigate('/login'); setMenuOpen(false); }}
              className="px-6 py-2 bg-accent text-primary font-bold rounded-full hover:scale-105 transition-transform whitespace-nowrap"
            >
              Log In Now
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <h2 className="text-3xl font-bold text-accent whitespace-nowrap">Curated Collection</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-start sm:items-center">

            <div className="flex gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search unique sites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-black/20 border border-accent/30 rounded-full text-accent text-sm focus:outline-none focus:border-accent transition-colors placeholder-accent/40"
                />
                <svg className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>

              <div className="relative flex items-center bg-black/20 border border-accent/30 rounded-full px-3 focus-within:border-accent hover:border-accent transition-colors">
                <svg className="w-4 h-4 text-accent/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent pl-2 pr-6 py-2 text-accent text-sm font-bold focus:outline-none appearance-none cursor-pointer w-full"
                >
                  <option value="Top" className="bg-primary">Top (Best)</option>
                  <option value="Newest" className="bg-primary">Newest</option>
                  <option value="A-Z" className="bg-primary">A-Z</option>
                  <option value="Z-A" className="bg-primary">Z-A</option>
                </select>
                <svg className="w-4 h-4 absolute right-3 text-accent/50 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {visibleCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${activeCategory === cat ? 'bg-accent text-primary' : 'bg-transparent text-accent border-2 border-accent hover:bg-accent hover:text-primary'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="w-full aspect-[3/4] rounded-xl bg-accent/5 animate-pulse border border-accent/10"></div>
                <div className="w-3/4 h-3 bg-accent/10 rounded mx-auto animate-pulse mt-2"></div>
                <div className="w-1/2 h-2 bg-accent/5 rounded mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        ) : sites.length === 0 ? (
          <div className="w-full py-20 text-center flex flex-col items-center">
            <svg className="w-16 h-16 text-accent/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-accent/60 font-medium text-lg">No websites found matching your criteria.</p>
          </div>
        ) : (
          <>
            <SiteGrid sites={sites} userVotes={auth.userVotes} onVote={handleVote} auth={auth} />
            
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-black/20 border border-accent/30 rounded-lg text-accent disabled:opacity-50 hover:bg-accent/10 transition-colors"
                >
                  Previous
                </button>
                <span className="text-accent font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-black/20 border border-accent/30 rounded-lg text-accent disabled:opacity-50 hover:bg-accent/10 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
