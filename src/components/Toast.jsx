import React from 'react';

export default function Toast({ toast }) {
  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <div className={`px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2 border ${toast.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 'bg-accent/95 text-primary border-accent'}`}>
        {toast.type === 'error' ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        )}
        {toast.message}
      </div>
    </div>
  );
}
