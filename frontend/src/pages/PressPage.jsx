import React from 'react';
import { Quote, ExternalLink, Star } from 'lucide-react';
import { pressItems } from '../data/mock';

const PressPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24">
      {/* Page Header */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Quote className="w-6 h-6 text-amber-500" />
              </div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500">Reviews & Features</p>
            </div>
            <h1 className="font-display text-5xl lg:text-7xl text-[#f5f5f0] mb-6">
              PRESS
            </h1>
            <p className="text-[#f5f5f0]/60 text-lg lg:text-xl leading-relaxed">
              Critical acclaim and industry recognition. Read what critics and publications are saying about the music.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="py-16 bg-gradient-to-r from-amber-500/10 to-[#0a0a0a]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="w-12 h-12 text-amber-500/50 mx-auto mb-8" />
            <blockquote className="font-display text-2xl lg:text-4xl text-[#f5f5f0] leading-relaxed mb-8">
              "{pressItems[0].quote}"
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <span className="font-mono text-amber-500 text-sm tracking-wider uppercase">{pressItems[0].source}</span>
              <span className="text-[#f5f5f0]/30">•</span>
              <span className="text-[#f5f5f0]/50 text-sm">{pressItems[0].date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Press Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {pressItems.slice(1).map((item) => (
              <article
                key={item.id}
                className="group p-8 rounded-xl bg-[#151515] border border-[#f5f5f0]/5 hover:border-amber-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="font-display text-xl text-amber-500 mb-1">{item.source}</h3>
                    <p className="text-[#f5f5f0]/50 font-mono text-xs">{item.date}</p>
                  </div>
                  <a
                    href={item.link}
                    className="w-10 h-10 rounded-full border border-[#f5f5f0]/10 flex items-center justify-center text-[#f5f5f0]/50 hover:text-amber-500 hover:border-amber-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <blockquote className="text-[#f5f5f0]/80 text-lg leading-relaxed">
                  "{item.quote}"
                </blockquote>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Logos */}
      <section className="py-16 border-t border-[#f5f5f0]/10">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#f5f5f0]/30 text-center mb-12">Featured In</p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {['Variety', 'The Hollywood Reporter', 'Film Score Monthly', 'AdAge', 'IndieWire', 'Soundtrack Magazine'].map((pub) => (
              <span key={pub} className="font-display text-lg lg:text-xl text-[#f5f5f0]/30 hover:text-[#f5f5f0]/50 transition-colors">
                {pub.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials from Directors */}
      <section className="py-16 lg:py-24 bg-[#0d0d0d]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-4">Collaborators</p>
            <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0]">DIRECTOR TESTIMONIALS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Chen',
                role: 'Director, Echoes of Tomorrow',
                quote: 'Manank has an extraordinary ability to understand the emotional core of a scene. His score for Echoes of Tomorrow elevated every moment.'
              },
              {
                name: 'Marcus Rivera',
                role: 'Director, Desert Wind',
                quote: 'Working with Manank was a dream. He brought such depth and authenticity to the Western genre while making it feel completely fresh.'
              },
              {
                name: 'Kim Jong-ho',
                role: 'Director, Neon Shadows',
                quote: 'The synth-driven score Manank created perfectly captured the cyberpunk atmosphere I envisioned. A true collaborative partner.'
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 rounded-xl bg-[#151515] border border-[#f5f5f0]/5"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>
                <blockquote className="text-[#f5f5f0]/70 leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <p className="font-display text-[#f5f5f0]">{testimonial.name}</p>
                  <p className="text-[#f5f5f0]/50 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PressPage;
