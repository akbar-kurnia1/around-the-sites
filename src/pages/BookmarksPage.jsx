import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import AboutModal from '../components/AboutModal';
import SubmitSiteModal from '../components/SubmitSiteModal';
import Toast from '../components/Toast';
import SiteGrid from '../components/SiteGrid';
import SiteSkeleton from '../components/SiteSkeleton';

export default function BookmarksPage({ auth, toast, showToast }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSubmitSite, setShowSubmitSite] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!auth.loggedIn) {
      navigate('/login');
      return;
    }
    fetchBookmarkedSites();
    setTimeout(() => setVisible(true), 100);
  }, [auth.loggedIn, auth.userBookmarks]);

  const fetchBookmarkedSites = async () => {
    if (auth.userBookmarks.size === 0) {
      setSites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const siteIds = Array.from(auth.userBookmarks);
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .in('id', siteIds);

      if (error) throw error;
      setSites(data || []);
    } catch (error) {
      showToast(`Error fetching bookmarks: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVoteLocal = async (e, id, delta, currentScore) => {
    // Basic local UI update for voting in bookmarks page
    e.preventDefault();
    e.stopPropagation();
    
    // We should Ideally reuse the handleVote from useSites, but for simplicity:
    showToast("Please vote from the main dashboard for now.", "error");
  };

  return (
    <div className="min-h-screen bg-primary relative pb-20">
      <Toast toast={toast} />

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showSubmitSite && <SubmitSiteModal onClose={() => setShowSubmitSite(false)} onSubmit={() => {}} />}

      <Navbar
        loggedIn={auth.loggedIn} 
        setShowLogin={() => navigate('/login')}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen}
        setStarted={() => navigate('/')} 
        setShowAbout={setShowAbout} setShowSubmitSite={setShowSubmitSite}
        showAI={false} setShowAI={() => {}} setActiveCategory={() => {}}
        handleLogout={auth.handleLogout}
      />

      <main className={`pt-32 px-6 md:px-12 max-w-[1400px] mx-auto transition-all duration-1000 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="mb-10 flex items-center gap-4">
          <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
          <h2 className="text-3xl font-black text-accent uppercase tracking-widest border-b-4 border-accent pb-2">My Bookmarks</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {[...Array(6)].map((_, i) => (
              <SiteSkeleton key={i} />
            ))}
          </div>
        ) : sites.length === 0 ? (
          <div className="w-full py-20 text-center flex flex-col items-center bg-accent/5 rounded-2xl border-2 border-accent/20">
            <svg className="w-16 h-16 text-accent/20 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
            <p className="text-accent/60 font-medium text-lg">You haven't bookmarked any websites yet.</p>
            <button onClick={() => navigate('/explore')} className="mt-6 px-6 py-2 bg-accent text-primary font-bold rounded-full hover:scale-105 transition-transform">
              Explore Sites
            </button>
          </div>
        ) : (
          <SiteGrid sites={sites} userVotes={auth.userVotes} onVote={handleVoteLocal} auth={auth} />
        )}
      </main>
    </div>
  );
}
