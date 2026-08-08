import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Music, Headphones, Mic2, Piano, Waves } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useSection, usePageVisibility } from '../context/ContentContext';

const AboutPage = () => {
  const composerInfo = useSection('settings');
  const aboutData = useSection('about');
  const visible = usePageVisibility();

  // Icons stay in code, keyed by skill name: they are design, not content. A
  // skill the client adds later simply gets the default note icon.
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
          <div className="max-w-3xl">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-6">
                {aboutData.kicker}
              </p>
              <h1 className="font-display text-5xl lg:text-7xl text-[#f5f5f0] mb-8">
                {(composerInfo.name || '').split(' ').map((word) => (
                  <span key={word} className="block">
                    {word.toUpperCase()}
                  </span>
                ))}
              </h1>

              <div className="space-y-6 text-[#f5f5f0]/70 leading-relaxed">
                {(aboutData.fullBio || '').split('\n\n').map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                {visible.contact && (
                  <Link to="/contact">
                    <Button className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] rounded-full px-8 py-6 font-mono text-xs tracking-wider uppercase">
                      Get in Touch
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
                {visible.credits && (
                  <Link to="/credits">
                    <Button variant="outline" className="border-[#f5f5f0]/30 text-[#f5f5f0] hover:bg-[#f5f5f0]/10 rounded-full px-8 py-6 font-mono text-xs tracking-wider uppercase">
                      View Credits
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-24 bg-[#0d0d0d]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-4">{aboutData.skillsKicker}</p>
            <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0]">{aboutData.skillsHeading}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(aboutData.skills || []).map((skill) => {
              const Icon = skillIcons[skill.title] || Music;
              return (
                <div
                  key={skill.title}
                  className="group p-8 rounded-xl bg-[#151515] border border-[#f5f5f0]/5 hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-amber-500" />
                  </div>
                  <h3 className="font-display text-xl text-[#f5f5f0] mb-3">{skill.title}</h3>
                  <p className="text-[#f5f5f0]/50 text-sm">{skill.description}</p>
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
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-4">{aboutData.processKicker}</p>
            <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0]">{aboutData.processHeading}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(aboutData.process || []).map((item, index) => (
              <div key={item.step} className="relative">
                <div className="p-8 rounded-xl bg-gradient-to-br from-[#151515] to-[#1a1a1a] border border-[#f5f5f0]/5 h-full">
                  <span className="font-display text-6xl text-amber-500/20">{item.step}</span>
                  <h3 className="font-display text-xl text-[#f5f5f0] mt-4 mb-3">{item.title}</h3>
                  <p className="text-[#f5f5f0]/50 text-sm">{item.description}</p>
                </div>
                {index < (aboutData.process || []).length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-amber-500/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA. Nothing here but a push to /contact, so it goes with that page. */}
      {visible.contact && (
        <section className="py-24 bg-gradient-to-br from-amber-500/10 to-[#0a0a0a]">
          <div className="max-w-[1920px] mx-auto px-6 lg:px-12 text-center">
            <h2 className="font-display text-4xl lg:text-6xl text-[#f5f5f0] mb-6">
              {aboutData.ctaHeadingLine1}
              <span className="block text-amber-500">{aboutData.ctaHeadingLine2}</span>
            </h2>
            <p className="text-[#f5f5f0]/60 text-lg max-w-2xl mx-auto mb-10">
              {aboutData.ctaBody}
            </p>
            <Link to="/contact">
              <Button className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] rounded-full px-10 py-6 font-mono text-sm tracking-wider uppercase">
                {aboutData.ctaButtonLabel}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;
