'use client';

import { useEffect, useState } from 'react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background/95 backdrop-blur transition-shadow ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="container flex h-14 items-center px-4">
        <h1 className="text-lg font-bold">UK Student Loan Study</h1>
      </div>
    </header>
  );
}
