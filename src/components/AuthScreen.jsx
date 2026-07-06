import React from 'react';

export default function AuthScreen({
  isRegistering, setIsRegistering,
  email, setEmail,
  password, setPassword,
  handleAuthSubmit, authError, setAuthError, setShowLogin
}) {
  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6 text-center transition-all duration-700">
      <main className="w-full max-w-md space-y-6 bg-black/20 p-8 rounded-2xl border border-white/5 shadow-2xl">
        <h2 className="text-3xl font-bold text-accent tracking-tight">{isRegistering ? "Create Account" : "Login"}</h2>
        <form className="space-y-4" onSubmit={handleAuthSubmit}>
          {authError && <p className="text-red-400 text-sm font-medium bg-red-900/20 p-2 rounded">{authError}</p>}
          
          <div className="text-left">
            <label className="block text-sm font-medium text-accent mb-1">Email</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-accent/50 rounded-lg text-accent focus:outline-none focus:border-accent transition-colors" 
            />
          </div>
          <div className="text-left">
            <label className="block text-sm font-medium text-accent mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-primary border border-accent/50 rounded-lg text-accent focus:outline-none focus:border-accent transition-colors" 
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3 mt-4 bg-accent text-primary font-bold rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-lg transform hover:scale-[1.02]"
          >
            {isRegistering ? "Register" : "Log In"}
          </button>
          
          <div className="pt-4 border-t border-accent/20 mt-4 flex flex-col gap-2">
            <button 
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setAuthError(""); }}
              className="w-full py-2 text-accent hover:text-white text-sm font-medium transition-colors"
            >
              {isRegistering ? "Already have an account? Log In" : "Don't have an account? Register"}
            </button>
            <button 
              type="button"
              onClick={() => { setShowLogin(false); setIsRegistering(false); setAuthError(""); }}
              className="w-full py-2 text-accent/70 hover:text-accent text-sm transition-colors"
            >
              Back
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
