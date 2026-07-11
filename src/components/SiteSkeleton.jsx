import React from 'react';

export default function SiteSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full aspect-[3/4] rounded-xl bg-accent/5 animate-pulse border border-accent/10"></div>
      <div className="w-3/4 h-3 bg-accent/10 rounded mx-auto animate-pulse mt-2"></div>
      <div className="w-1/2 h-2 bg-accent/5 rounded mx-auto animate-pulse"></div>
    </div>
  );
}
