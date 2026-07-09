import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../components/Navbar';
import AboutModal from '../components/AboutModal';
import SubmitSiteModal from '../components/SubmitSiteModal';
import Toast from '../components/Toast';

export default function ProfilePage({ auth, toast, showToast }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    avatar_url: '',
    username: '',
    bio: '',
    job: '',
    likes: ''
  });
  const [originalUsername, setOriginalUsername] = useState('');

  const [menuOpen, setMenuOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSubmitSite, setShowSubmitSite] = useState(false);
  const [visible, setVisible] = useState(false);

  // Password Confirmation State
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!auth.loggedIn) {
      navigate('/login');
      return;
    }
    fetchProfile();
    setTimeout(() => setVisible(true), 100);
  }, [auth.loggedIn, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          avatar_url: data.avatar_url || '',
          username: data.username || '',
          bio: data.bio || '',
          job: data.job || '',
          likes: data.likes || ''
        });
        setOriginalUsername(data.username || '');
      }
    } catch (error) {
      showToast(`Error fetching profile: ${error.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      
      setSaving(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));
      showToast("Avatar uploaded! Don't forget to save.", "success");
    } catch (error) {
      showToast(`Error uploading avatar: ${error.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    
    // If username changed, require password verification
    if (profile.username !== originalUsername) {
      if (!profile.username) {
        showToast("Username cannot be empty.", "error");
        return;
      }
      setShowPasswordPrompt(true);
      return;
    }

    await executeSave();
  };

  const verifyPasswordAndSave = async (e) => {
    e.preventDefault();
    if (!password) {
      showToast("Please enter your password.", "error");
      return;
    }

    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      // Reauthenticate user to verify password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: password
      });

      if (authError) {
        throw new Error("Incorrect password. Username change denied.");
      }

      // Check if username is already taken
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', profile.username)
        .neq('id', session.user.id);

      if (existingUsers && existingUsers.length > 0) {
        throw new Error("Username is already taken by someone else.");
      }

      setShowPasswordPrompt(false);
      setPassword('');
      await executeSave();
      setOriginalUsername(profile.username);
    } catch (error) {
      showToast(error.message, "error");
      setSaving(false);
    }
  };

  const executeSave = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const updates = {
        id: session.user.id,
        avatar_url: profile.avatar_url,
        username: profile.username || null, // Ensure empty strings are null for uniqueness
        bio: profile.bio,
        job: profile.job,
        likes: profile.likes,
        updated_at: new Date()
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
           throw new Error("Username is already taken by someone else.");
        }
        throw error;
      }
      showToast("Profile saved successfully!", "success");
    } catch (error) {
      showToast(`Error saving profile: ${error.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-primary relative pb-20">
      <Toast toast={toast} />

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showSubmitSite && <SubmitSiteModal onClose={() => setShowSubmitSite(false)} onSubmit={() => {}} />}

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-primary border-4 border-accent p-8 rounded-2xl w-full max-w-md shadow-[8px_8px_0px_0px_rgba(255,200,87,1)]">
            <h3 className="text-2xl font-black text-accent mb-4 uppercase tracking-wider">Confirm Identity</h3>
            <p className="text-accent mb-6 font-medium opacity-90">
              You are changing your username from <strong className="bg-accent text-primary px-1">{originalUsername || 'None'}</strong> to <strong className="bg-accent text-primary px-1">{profile.username}</strong>. Please enter your password to confirm.
            </p>
            <form onSubmit={verifyPasswordAndSave}>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border-2 border-accent p-3 rounded-lg text-accent focus:outline-none focus:border-white transition-colors mb-6"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => { setShowPasswordPrompt(false); setPassword(''); }}
                  className="px-6 py-2 text-accent font-bold hover:underline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-accent text-primary font-black uppercase tracking-wider py-2 px-6 rounded-lg hover:translate-y-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50"
                >
                  {saving ? 'Verifying...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Navbar
        loggedIn={auth.loggedIn} 
        setShowLogin={() => navigate('/login')}
        menuOpen={menuOpen} setMenuOpen={setMenuOpen}
        setStarted={() => navigate('/')} 
        setShowAbout={setShowAbout} setShowSubmitSite={setShowSubmitSite}
        showAI={false} setShowAI={() => {}} setActiveCategory={() => {}}
        handleLogout={auth.handleLogout}
      />

      <main className={`pt-32 px-6 md:px-12 max-w-4xl mx-auto transition-all duration-1000 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="bg-accent/10 border-2 border-accent rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(255,200,87,1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-bl-full pointer-events-none"></div>
          
          <h2 className="text-3xl font-black text-accent mb-8 uppercase tracking-widest border-b-4 border-accent pb-4 inline-block">My Profile</h2>

          {loading ? (
            <div className="text-accent animate-pulse font-bold">Loading your data...</div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                <div className="relative group w-48 h-48 rounded-full border-4 border-accent overflow-hidden bg-primary flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,200,87,1)] cursor-pointer">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-accent/50 font-bold uppercase tracking-wider text-sm text-center px-4">Upload<br/>Avatar</span>
                  )}
                  
                  {/* Upload Overlay */}
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-accent font-bold uppercase tracking-widest text-sm">Upload</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarUpload} 
                      className="hidden" 
                      disabled={saving}
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-5 w-full md:w-2/3">
                <div>
                  <label className="block text-accent font-bold text-sm mb-1 uppercase tracking-wide">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={(e) => {
                      // Prevent spaces in username
                      const val = e.target.value.replace(/\s+/g, '');
                      setProfile(prev => ({ ...prev, username: val }));
                    }}
                    placeholder="e.g. johndoe (No spaces allowed)"
                    className="w-full bg-primary border-2 border-accent rounded-lg p-3 text-accent focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                  />
                  {profile.username !== originalUsername && (
                    <p className="text-[10px] text-accent mt-1 opacity-70 uppercase tracking-wider">* Password verification required to save</p>
                  )}
                </div>
                <div>
                  <label className="block text-accent font-bold text-sm mb-1 uppercase tracking-wide">Job / Occupation</label>
                  <input
                    type="text"
                    name="job"
                    value={profile.job}
                    onChange={handleChange}
                    placeholder="e.g. Web Developer, Student..."
                    className="w-full bg-primary border-2 border-accent rounded-lg p-3 text-accent focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-accent font-bold text-sm mb-1 uppercase tracking-wide">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Tell us a little bit about yourself..."
                    rows="3"
                    className="w-full bg-primary border-2 border-accent rounded-lg p-3 text-accent focus:outline-none focus:ring-2 focus:ring-accent transition-shadow resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-accent font-bold text-sm mb-1 uppercase tracking-wide">Things You Like</label>
                  <input
                    type="text"
                    name="likes"
                    value={profile.likes}
                    onChange={handleChange}
                    placeholder="e.g. Design, Reading, Space, Cats"
                    className="w-full bg-primary border-2 border-accent rounded-lg p-3 text-accent focus:outline-none focus:ring-2 focus:ring-accent transition-shadow"
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-accent text-primary font-black uppercase tracking-wider py-3 px-8 rounded-lg shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
