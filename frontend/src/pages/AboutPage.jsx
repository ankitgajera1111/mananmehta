import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Music, Headphones, Mic2, Piano, Waves } from 'lucide-react';
import { Button } from '../components/ui/button';
import { composerInfo, aboutData } from '../data/mock';

const AboutPage = () => {
  const skillIcons = {
    'Orchestral Composition': Piano,
    'Electronic & Hybrid Scoring': Waves,
    'Sound Design': Headphones,
    'Music Production': Music,
    'Live Recording Sessions': Mic2,
    'Music for Ads & Jingles': Headphones
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24">
      {/* Hero Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            {/* Text Content */}
            <div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-6">
                About the Composer
              </p>
              <h1 className="font-display text-5xl lg:text-7xl text-[#f5f5f0] mb-8">
                {composerInfo.name.split(' ').map((word, i) => (
                  <span key={i} className="block">
                    {word.toUpperCase()}
                  </span>
                ))}
              </h1>
              
              <div className="space-y-6 text-[#f5f5f0]/70 leading-relaxed">
                {aboutData.fullBio.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/contact">
                  <Button className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] rounded-full px-8 py-6 font-mono text-xs tracking-wider uppercase">
                    Get in Touch
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/credits">
                  <Button variant="outline" className="border-[#f5f5f0]/30 text-[#f5f5f0] hover:bg-[#f5f5f0]/10 rounded-full px-8 py-6 font-mono text-xs tracking-wider uppercase">
                    View Credits
                  </Button>
                </Link>
              </div>
            </div>

            {/* Creative Right Column */}
            <div className="space-y-8">
              {/* Cinematic Quote */}
              <div className="p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-[#151515] to-[#0d0d0d] border border-[#f5f5f0]/5 relative overflow-hidden">
                <div className="absolute top-4 left-6 font-display text-[120px] leading-none text-amber-500/10 select-none">"</div>
                <blockquote className="relative z-10 pt-12">
                  <p className="font-display text-xl lg:text-2xl text-[#f5f5f0]/90 leading-relaxed italic">
                    Every frame has a heartbeat. My job is to find it and let it sing.
                  </p>
                  <footer className="mt-6 font-mono text-xs tracking-[0.15em] uppercase text-amber-500">
                    — Manan Mehta
                  </footer>
                </blockquote>
              </div>

              {/* Genres & Sonic Palette */}
              <div className="p-6 lg:p-8 rounded-2xl bg-[#151515] border border-[#f5f5f0]/5">
                <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-amber-500 mb-6">
                  Sonic Palette
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Orchestral', 'Ambient', 'Electronic', 'Cinematic', 'Hybrid', 'World Music', 'Lo-Fi', 'Synthwave', 'Acoustic', 'Experimental'].map((genre) => (
                    <span
                      key={genre}
                      className="px-4 py-2 rounded-full bg-[#0a0a0a] border border-[#f5f5f0]/10 text-[#f5f5f0]/70 text-sm hover:border-amber-500/40 hover:text-amber-500 transition-all cursor-default"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools of the Trade */}
              <div className="p-6 lg:p-8 rounded-2xl bg-[#151515] border border-[#f5f5f0]/5">
                <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-amber-500 mb-6">
                  Tools of the Trade
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'DAW', value: 'Logic Pro / Ableton' },
                    { label: 'Keys', value: 'Native Instruments' },
                    { label: 'Strings', value: 'Spitfire Audio' },
                    { label: 'Guitar', value: 'Live Recording' }
                  ].map((tool) => (
                    <div key={tool.label} className="space-y-1">
                      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#f5f5f0]/40">{tool.label}</p>
                      <p className="text-[#f5f5f0]/80 text-sm">{tool.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 bg-[#0d0d0d]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-4">Expertise</p>
            <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0]">SKILLS & SERVICES</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.skills.map((skill, index) => {
              const Icon = skillIcons[skill] || Music;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-xl bg-[#151515] border border-[#f5f5f0]/5 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-display text-xl text-[#f5f5f0] mb-3">{skill}</h3>
                  <p className="text-[#f5f5f0]/50 text-sm">
                    Bringing depth and emotion to every project through expert {skill.toLowerCase()}.
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-4">How I Work</p>
            <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0]">THE PROCESS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Discovery', description: 'Understanding your vision, story, and emotional goals for the project.' },
              { step: '02', title: 'Concept', description: 'Developing themes, motifs, and the overall sonic palette.' },
              { step: '03', title: 'Creation', description: 'Composing, recording, and producing the score with meticulous attention to detail.' },
              { step: '04', title: 'Delivery', description: 'Final mixing, mastering, and delivery in all required formats.' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="p-8 rounded-xl bg-gradient-to-br from-[#151515] to-[#1a1a1a] border border-[#f5f5f0]/5 h-full">
                  <span className="font-display text-6xl text-amber-500/20">{item.step}</span>
                  <h3 className="font-display text-xl text-[#f5f5f0] mt-4 mb-3">{item.title}</h3>
                  <p className="text-[#f5f5f0]/50 text-sm">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-amber-500/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-amber-500/10 to-[#0a0a0a]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 text-center">
          <h2 className="font-display text-4xl lg:text-6xl text-[#f5f5f0] mb-6">
            LET'S CREATE
            <span className="block text-amber-500">SOMETHING AMAZING</span>
          </h2>
          <p className="text-[#f5f5f0]/60 text-lg max-w-2xl mx-auto mb-10">
            Ready to discuss your project? I'd love to hear about your vision and explore how we can bring it to life through music.
          </p>
          <Link to="/contact">
            <Button className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] rounded-full px-10 py-6 font-mono text-sm tracking-wider uppercase">
              Start a Conversation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
