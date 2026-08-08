import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Instagram, Music, Film } from 'lucide-react';
import { useSection, usePageVisibility } from '../../context/ContentContext';
import { PUBLIC_PAGES } from '../../lib/pages';
import { cn } from '../../lib/utils';

const Navigation = () => {
  const composerInfo = useSection('settings');
  const visible = usePageVisibility();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setScrolled]);

  useEffect(() => {
    setIsOpen(false);
  }, [location, setIsOpen]);

  // Home is always present; the rest follow whatever the client left switched
  // on, so the menu can never offer a page that no longer has a route.
  const navLinks = [
    { path: '/', label: 'Home' },
    ...PUBLIC_PAGES.filter(({ key }) => visible[key]),
  ];

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md py-4' : 'bg-transparent py-6'
        )}
      >
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link 
              to="/" 
              className="group flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <Music className="w-5 h-5 text-[#0a0a0a]" />
              </div>
              <span className="font-display text-xl tracking-wider text-[#f5f5f0] group-hover:text-amber-500 transition-colors">
                {(composerInfo.name || '').split(' ')[0].toUpperCase()}
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative font-mono text-xs tracking-[0.15em] uppercase transition-colors',
                    location.pathname === link.path
                      ? 'text-amber-500'
                      : 'text-[#f5f5f0]/70 hover:text-[#f5f5f0]'
                  )}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-amber-500" />
                  )}
                </Link>
              ))}
            </div>

            {/* Social + Menu Button */}
            <div className="flex items-center gap-4">
              <a
                href={composerInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex w-10 h-10 rounded-full border border-[#f5f5f0]/20 items-center justify-center text-[#f5f5f0]/70 hover:text-amber-500 hover:border-amber-500 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden w-10 h-10 rounded-full border border-[#f5f5f0]/20 flex items-center justify-center text-[#f5f5f0] hover:border-amber-500 hover:text-amber-500 transition-all"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-[#0a0a0a] transition-all duration-500 lg:hidden',
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <nav className="flex flex-col items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'font-display text-4xl tracking-wider transition-all',
                  'hover:text-amber-500 hover:translate-x-2',
                  location.pathname === link.path
                    ? 'text-amber-500'
                    : 'text-[#f5f5f0]'
                )}
                style={{ 
                  transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isOpen ? 1 : 0
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="absolute bottom-12 flex items-center gap-6">
            <a
              href={composerInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f5f5f0]/50 hover:text-amber-500 transition-colors"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
