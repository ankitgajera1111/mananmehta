import React, { useState } from 'react';
import { FileText, Film, Tv, Megaphone, ChevronDown } from 'lucide-react';
import { credits } from '../data/mock';
import { cn } from '../lib/utils';

const CreditsPage = () => {
  const [filter, setFilter] = useState('all');
  const [expandedYear, setExpandedYear] = useState(null);

  const types = ['all', 'Feature Film', 'Documentary', 'Short Film', 'TV Series', 'Commercial'];

  const filteredCredits = filter === 'all'
    ? credits
    : credits.filter(c => c.type === filter);

  // Group by year
  const creditsByYear = filteredCredits.reduce((acc, credit) => {
    if (!acc[credit.year]) acc[credit.year] = [];
    acc[credit.year].push(credit);
    return acc;
  }, {});

  const years = Object.keys(creditsByYear).sort((a, b) => b - a);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Feature Film':
      case 'Short Film':
      case 'Documentary':
        return Film;
      case 'TV Series':
        return Tv;
      case 'Commercial':
        return Megaphone;
      default:
        return FileText;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24">
      {/* Page Header */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-amber-500" />
              </div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500">Filmography</p>
            </div>
            <h1 className="font-display text-5xl lg:text-7xl text-[#f5f5f0] mb-6">
              CREDITS
            </h1>
            <p className="text-[#f5f5f0]/60 text-lg lg:text-xl leading-relaxed">
              A comprehensive list of film, television, and commercial projects. Each score represents a unique collaboration and creative journey.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-[#f5f5f0]/10 py-8">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="font-display text-4xl text-amber-500">{credits.length}</p>
              <p className="text-[#f5f5f0]/50 font-mono text-xs tracking-wider uppercase mt-1">Total Credits</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl text-amber-500">
                {credits.filter(c => c.type === 'Feature Film').length}
              </p>
              <p className="text-[#f5f5f0]/50 font-mono text-xs tracking-wider uppercase mt-1">Feature Films</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl text-amber-500">
                {credits.filter(c => c.type === 'Commercial').length}
              </p>
              <p className="text-[#f5f5f0]/50 font-mono text-xs tracking-wider uppercase mt-1">Commercials</p>
            </div>
            <div className="text-center">
              <p className="font-display text-4xl text-amber-500">
                {new Set(credits.map(c => c.year)).size}
              </p>
              <p className="text-[#f5f5f0]/50 font-mono text-xs tracking-wider uppercase mt-1">Active Years</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-[#f5f5f0]/10">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={cn(
                  'px-4 py-2 rounded-full font-mono text-xs tracking-wider uppercase whitespace-nowrap transition-all',
                  filter === type
                    ? 'bg-amber-500 text-[#0a0a0a]'
                    : 'bg-[#151515] text-[#f5f5f0]/70 hover:text-[#f5f5f0]'
                )}
              >
                {type === 'all' ? 'All Credits' : type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Credits List */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="space-y-8">
            {years.map((year) => (
              <div key={year} className="border border-[#f5f5f0]/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedYear(expandedYear === year ? null : year)}
                  className="w-full flex items-center justify-between p-6 bg-[#151515] hover:bg-[#1a1a1a] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display text-3xl lg:text-4xl text-amber-500">{year}</span>
                    <span className="text-[#f5f5f0]/50 font-mono text-sm">
                      {creditsByYear[year].length} {creditsByYear[year].length === 1 ? 'credit' : 'credits'}
                    </span>
                  </div>
                  <ChevronDown className={cn(
                    'w-5 h-5 text-[#f5f5f0]/50 transition-transform',
                    expandedYear === year && 'rotate-180'
                  )} />
                </button>

                <div className={cn(
                  'overflow-hidden transition-all duration-300',
                  expandedYear === year ? 'max-h-[2000px]' : 'max-h-0'
                )}>
                  <div className="p-6 space-y-4">
                    {creditsByYear[year].map((credit) => {
                      const Icon = getTypeIcon(credit.type);
                      return (
                        <div
                          key={credit.title}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#0a0a0a] hover:bg-[#0d0d0d] transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-4 h-4 text-amber-500" />
                            </div>
                            <div>
                              <h3 className="font-display text-lg text-[#f5f5f0]">{credit.title}</h3>
                              <p className="text-[#f5f5f0]/50 text-sm">Director: {credit.director}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 sm:text-right">
                            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 font-mono text-[10px] tracking-wider uppercase">
                              {credit.type}
                            </span>
                            <span className="text-[#f5f5f0]/40 font-mono text-xs">{credit.role}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreditsPage;
