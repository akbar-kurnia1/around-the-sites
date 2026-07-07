import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { INITIAL_SITES, CATEGORIES } from '../data';

export function useSites(showToast, loggedIn, userVotes, setUserVotes) {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState("");
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("Top");
  const [showAI, setShowAI] = useState(false);

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

  useEffect(() => {
    fetchSites();
  }, []);

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

  return {
    loading,
    dbError,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    showAI, setShowAI,
    sortedSites,
    visibleCategories,
    handleVote,
    fetchSites,
    setSites
  };
}
