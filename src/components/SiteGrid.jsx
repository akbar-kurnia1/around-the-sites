import React, { useEffect, useRef, useState } from 'react';
import SiteCard from './SiteCard';

function RevealWrapper({ children, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const delay = Math.min((index % 6) * 100, 500);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
      }`}
    >
      {children}
    </div>
  );
}

export default function SiteGrid({ sites, userVotes, onVote, auth }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
      {sites.map((site, index) => (
        <RevealWrapper key={site.id} index={index}>
          <SiteCard
            site={site}
            userVote={userVotes[site.id]}
            onVote={onVote}
            auth={auth}
          />
        </RevealWrapper>
      ))}
    </div>
  );
}
