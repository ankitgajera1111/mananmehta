import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Music, ArrowUpRight } from 'lucide-react';
import { composerInfo } from '../../data/mock';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#f5f5f0]/10">
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <Music className="w-6 h-6 text-[#0a0a0a]" />
              </div>
              <span className="font-display text-2xl tracking-wider text-[#f5f5f0]">
                {composerInfo.name.toUpperCase()}
              </span>
            </Link>
            <p className="text-[#f5f5f0]/50 text-sm leading-relaxed max-w-sm">
              {composerInfo.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs tracking-[0.15em] uppercase text-amber-500 mb-6">
              Navigation
            </h4>
            <nav className="flex flex-col gap-3">
              {['Films', 'Ads', 'About', 'Credits', 'Contact'].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-[#f5f5f0]/70 hover:text-[#f5f5f0] transition-colors text-sm"
                >
                  {item}
                </Link>
              ))}
            </nav>
          </div>

          {/* Work */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs tracking-[0.15em] uppercase text-amber-500 mb-6">
              Work
            </h4>
            <nav className="flex flex-col gap-3">
              <Link to="/films" className="text-[#f5f5f0]/70 hover:text-[#f5f5f0] transition-colors text-sm">
                Feature Films
              </Link>
              <Link to="/films" className="text-[#f5f5f0]/70 hover:text-[#f5f5f0] transition-colors text-sm">
                Documentaries
              </Link>
              <Link to="/ads" className="text-[#f5f5f0]/70 hover:text-[#f5f5f0] transition-colors text-sm">
                Commercials
              </Link>
              <Link to="/ads" className="text-[#f5f5f0]/70 hover:text-[#f5f5f0] transition-colors text-sm">
                Brand Campaigns
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h4 className="font-mono text-xs tracking-[0.15em] uppercase text-amber-500 mb-6">
              Get in Touch
            </h4>
            <a
              href={`mailto:${composerInfo.email}`}
              className="inline-flex items-center gap-2 text-[#f5f5f0] hover:text-amber-500 transition-colors mb-6"
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">{composerInfo.email}</span>
            </a>
            
            <div className="flex items-center gap-4 mt-4">
              <a
                href={`https://instagram.com/${composerInfo.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#f5f5f0]/20 flex items-center justify-center text-[#f5f5f0]/70 hover:text-amber-500 hover:border-amber-500 transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={composerInfo.imdb}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-[#f5f5f0]/20 flex items-center justify-center text-[#f5f5f0]/70 hover:text-amber-500 hover:border-amber-500 transition-all"
              >
                <span className="text-xs font-bold">IMDb</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#f5f5f0]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#f5f5f0]/40 text-xs">
            © {currentYear} {composerInfo.name}. All rights reserved.
          </p>
          <p className="text-[#f5f5f0]/40 text-xs">
            Film & Television Composer
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
