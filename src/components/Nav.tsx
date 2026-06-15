"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/subject-overview', label: 'Curriculum' },
  { href: '/modules', label: 'Modules' },
  { href: '/virtual-lab', label: 'Virtual Lab' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/question-bank', label: 'Assessment' },
];

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-primary transition-colors ${pathname === link.href ? 'text-primary' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden relative w-8 h-8 flex items-center justify-center"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      >
        <div className="flex flex-col gap-1.5">
          <span className={`block w-5 h-0.5 bg-foreground rounded transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
          <span className={`block w-5 h-0.5 bg-foreground rounded transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-foreground rounded transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} />
        </div>
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
          <nav className="relative flex flex-col items-center gap-6 pt-12 pb-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-lg font-bold transition-colors hover:text-primary ${pathname === link.href ? 'text-primary' : 'text-foreground'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
