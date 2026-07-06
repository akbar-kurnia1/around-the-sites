import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { INITIAL_SITES, CATEGORIES } from './data';

import Toast from './components/Toast';
import AboutModal from './components/AboutModal';
import SubmitSiteModal from './components/SubmitSiteModal';
import HeroSection from './components/HeroSection';
import SiteCard from './components/SiteCard';
import SiteGrid from './components/SiteGrid';
import AuthScreen from './components/AuthScreen';
import Navbar from './components/Navbar';

function App() {
  const [started, setStarted] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const [sites, setSites] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Top");

  const [showAbout, setShowAbout] = useState(false);
  const [showSubmitSite, setShowSubmitSite] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [dbError, setDbError] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  const handleSiteSubmit = async (data) => {
    const { error } = await supabase.from('submissions').insert([
      {
        title: data.title,
        url: data.url,
        category: data.category,
        description: data.description
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

  const fetchSites = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('sites').select('*');

    if (error) {
      setDbError(`Error fetching data: ${error.message}`);
      setSites([...INITIAL_SITES]);
    } else if (data && data.length === 0) {
      setDbError("Database is empty. Please check your Supabase SQL Editor and ensure you ran the INSERT query.");
      setSites([...INITIAL_SITES]);
    } else if (data) {
      setDbError("");
      const uniqueSites = Array.from(new Map(data.map(item => [item.title, item])).values());
      setSites(uniqueSites);
    }
    setLoading(false);
  };

  const fetchUserVotes = async (userId) => {
    const { data, error } = await supabase.from('user_votes').select('site_id, vote_value').eq('user_id', userId);
    if (data) {
      const votes = {};
      data.forEach(v => { votes[v.site_id] = v.vote_value; });
      setUserVotes(votes);
    } else if (error) {
      setDbError("User votes table missing. Did you run the latest SQL query?");
    }
  };

  useEffect(() => {
    fetchSites();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setLoggedIn(true);
        fetchUserVotes(session.user.id);
      } else {
        setLoggedIn(false);
        setUserVotes({});
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setLoggedIn(true);
        fetchUserVotes(session.user.id);
      } else {
        setLoggedIn(false);
        setUserVotes({});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (started) {
      setTimeout(() => setVisible(true), 100);
    }
  }, [started]);

  const handleVote = async (e, id, delta, currentScore) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loggedIn) {
      showToast("Please login first to vote!", "error");
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const userId = session.user.id;
    const currentVote = userVotes[id] || 0;

    let newVoteValue = 0;
    let scoreChange = 0;

    if (currentVote === delta) {
      newVoteValue = 0;
      scoreChange = -delta;
      showToast("Vote cancelled");
    } else {
      newVoteValue = delta;
      scoreChange = delta - currentVote;
      showToast(delta === 1 ? "Upvoted!" : "Downvoted!");
    }

    const newScore = currentScore + scoreChange;

    setSites(prev => prev.map(s => s.id === id ? { ...s, score: newScore } : s));
    setUserVotes(prev => ({ ...prev, [id]: newVoteValue }));

    if (newVoteValue === 0) {
      await supabase.from('user_votes').delete().eq('user_id', userId).eq('site_id', id);
    } else {
      const { error: upsertError } = await supabase
        .from('user_votes')
        .upsert({ user_id: userId, site_id: id, vote_value: newVoteValue }, { onConflict: 'user_id,site_id' });

      if (upsertError) {
        console.error("Upsert Error:", upsertError);
        showToast(`Vote sync failed: ${upsertError.message}`, "error");
      }
    }

    const { error: updateError } = await supabase.from('sites').update({ score: newScore }).eq('id', id);
    if (updateError) {
      showToast(`Score update failed: ${updateError.message}`, "error");
      fetchSites();
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    if (isRegistering) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setAuthError(error.message);
      } else if (!data.session) {
        showToast("Registration successful! Check your email to confirm.", "success");
      } else {
        setShowLogin(false);
        setStarted(true);
        showToast("Welcome to AroundTheSites!", "success");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
      } else {
        setShowLogin(false);
        setStarted(true);
        showToast("Logged in successfully!", "success");
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast("Logged out safely.", "success");
  };

  const filteredSites = sites.filter(s => {
    if (s.category === "AI" && !showAI) return false;
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const descText = s.description || "";
    const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const sortedSites = [...filteredSites].sort((a, b) => {
    if (sortBy === "Top") return b.score - a.score;
    if (sortBy === "Newest") return b.id - a.id;
    if (sortBy === "A-Z") return a.title.localeCompare(b.title);
    if (sortBy === "Z-A") return b.title.localeCompare(a.title);
    return 0;
  });

  const visibleCategories = CATEGORIES.filter(c => showAI ? true : c !== "AI");

  if (showLogin) {
    return (
      <div className="relative">
        <AuthScreen
          isRegistering={isRegistering} setIsRegistering={setIsRegistering}
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          handleAuthSubmit={handleAuthSubmit} authError={authError} setAuthError={setAuthError}
          setShowLogin={setShowLogin}
        />
        <Toast toast={toast} />
      </div>
    );
  }

  if (!started) {
    return (
      <HeroSection setStarted={setStarted} setShowLogin={setShowLogin} />
    );
  }

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
        loggedIn={loggedIn} setShowLogin={setShowLogin}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen}
        setStarted={setStarted} setShowAbout={setShowAbout} setShowSubmitSite={setShowSubmitSite}
        showAI={showAI} setShowAI={setShowAI} setActiveCategory={setActiveCategory}
        handleLogout={handleLogout}
      />

      <main className={`pt-28 px-6 md:px-12 max-w-[1400px] mx-auto transition-all duration-1000 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

        {dbError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
            <strong>Database Alert:</strong> {dbError}
          </div>
        )}

        {!loggedIn && (
          <div className="mb-8 p-4 bg-accent/10 border border-accent/20 rounded-lg text-accent text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <span>We recommend logging in for the optimal experience and voting capabilities.</span>
            <button
              onClick={() => { setShowLogin(true); setMenuOpen(false); }}
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
        ) : sortedSites.length === 0 ? (
          <div className="w-full py-20 text-center flex flex-col items-center">
            <svg className="w-16 h-16 text-accent/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-accent/60 font-medium text-lg">No websites found matching your criteria.</p>
          </div>
        ) : (
          <SiteGrid sites={sortedSites} userVotes={userVotes} onVote={handleVote} />
        )}
      </main>
    </div>
  );
}

export default App;
