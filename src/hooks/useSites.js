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
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 48;

  // Reset to page 1 if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy, showAI]);

  const handleFallback = () => {
    let filtered = INITIAL_SITES.filter(s => {
      if (s.category === "AI" && !showAI) return false;
      const matchCat = activeCategory === "All" || s.category === activeCategory;
      const descText = s.description || s.desc || "";
      const tagsText = s.tags ? s.tags.join(" ") : "";
      const matchSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        descText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tagsText.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    let sorted = [...filtered].sort((a, b) => {
      if (sortBy === "Top") return b.score - a.score;
      if (sortBy === "Newest") return b.id - a.id;
      if (sortBy === "A-Z") return a.title.localeCompare(b.title);
      if (sortBy === "Z-A") return b.title.localeCompare(a.title);
      return 0;
    });

    setTotalPages(Math.ceil(sorted.length / itemsPerPage) || 1);
    
    const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    setSites(paginated);
  };

  const fetchSites = async () => {
    setLoading(true);
    
    let query = supabase.from('sites').select('*', { count: 'exact' });

    if (activeCategory !== "All") {
      query = query.eq('category', activeCategory);
    } else if (!showAI) {
      query = query.neq('category', 'AI');
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    if (sortBy === "Top") {
      query = query.order('score', { ascending: false }).order('id', { ascending: false });
    } else if (sortBy === "Newest") {
      query = query.order('id', { ascending: false });
    } else if (sortBy === "A-Z") {
      query = query.order('title', { ascending: true });
    } else if (sortBy === "Z-A") {
      query = query.order('title', { ascending: false });
    }

    const from = (currentPage - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      setDbError(`Error fetching data: ${error.message}`);
      handleFallback();
    } else if (data && data.length === 0 && currentPage === 1 && !searchQuery && activeCategory === "All") {
      setDbError("Database is empty. Please check your Supabase SQL Editor and ensure you ran the INSERT query.");
      handleFallback();
    } else if (data) {
      setDbError("");
      setSites(data);
      if (count !== null) {
        setTotalPages(Math.ceil(count / itemsPerPage));
      } else {
        // Fallback if count is null
        setTotalPages(data.length === itemsPerPage ? currentPage + 1 : currentPage);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSites();
  }, [currentPage, activeCategory, searchQuery, sortBy, showAI]);

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

  const visibleCategories = CATEGORIES.filter(c => showAI ? true : c !== "AI");

  return {
    loading,
    dbError,
    activeCategory, setActiveCategory,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    showAI, setShowAI,
    currentPage, setCurrentPage,
    totalPages,
    sites, // returns paginated and sorted sites directly
    visibleCategories,
    handleVote,
    fetchSites
  };
}
