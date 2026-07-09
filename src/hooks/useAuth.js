import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export function useAuth(showToast) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [userBookmarks, setUserBookmarks] = useState(new Set());
  const [dbError, setDbError] = useState("");
  const navigate = useNavigate();

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

  const fetchUserBookmarks = async (userId) => {
    const { data, error } = await supabase.from('bookmarks').select('site_id').eq('user_id', userId);
    if (data) {
      const bookmarks = new Set(data.map(b => b.site_id));
      setUserBookmarks(bookmarks);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setLoggedIn(true);
        fetchUserVotes(session.user.id);
        fetchUserBookmarks(session.user.id);
      } else {
        setLoggedIn(false);
        setUserVotes({});
        setUserBookmarks(new Set());
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setLoggedIn(true);
        fetchUserVotes(session.user.id);
        fetchUserBookmarks(session.user.id);
      } else {
        setLoggedIn(false);
        setUserVotes({});
        setUserBookmarks(new Set());
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSubmit = async (e, isRegistering, email, password, setAuthError) => {
    e.preventDefault();
    setAuthError("");

    if (isRegistering) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setAuthError(error.message);
      } else if (!data.session) {
        showToast("Registration successful! Check your email to confirm.", "success");
      } else {
        navigate('/explore');
        showToast("Welcome to AroundTheSites!", "success");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
      } else {
        navigate('/explore');
        showToast("Logged in successfully!", "success");
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    showToast("Logged out safely.", "success");
  };

  const toggleBookmark = async (siteId) => {
    if (!loggedIn) {
      showToast("Please login first to bookmark!", "error");
      return;
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const userId = session.user.id;
    const isBookmarked = userBookmarks.has(siteId);

    const newBookmarks = new Set(userBookmarks);
    if (isBookmarked) {
      newBookmarks.delete(siteId);
      await supabase.from('bookmarks').delete().eq('user_id', userId).eq('site_id', siteId);
      showToast("Removed from bookmarks");
    } else {
      newBookmarks.add(siteId);
      await supabase.from('bookmarks').insert({ user_id: userId, site_id: siteId });
      showToast("Added to bookmarks!", "success");
    }
    setUserBookmarks(newBookmarks);
  };

  return {
    loggedIn,
    userVotes,
    setUserVotes,
    userBookmarks,
    toggleBookmark,
    dbError,
    handleAuthSubmit,
    handleLogout
  };
}
