import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export function useAuth(showToast) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userVotes, setUserVotes] = useState({});
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

  useEffect(() => {
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

  return {
    loggedIn,
    userVotes,
    setUserVotes,
    dbError,
    handleAuthSubmit,
    handleLogout
  };
}
