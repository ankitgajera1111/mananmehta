import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { composerInfo, featuredWork, filmProjects, adProjects } from '../data/mock';
import ProjectCard from '../components/cards/ProjectCard';
import { cn } from '../lib/utils';

const HomePage = () => {
  const [activeProject, setActiveProject] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-rotate featured projects
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying) {
        setActiveProject((prev) => (prev + 1) % featuredWork.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images */}
        {featuredWork.map((project, index) => (
          <div
            key={project.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-1000',
              index === activeProject ? 'opacity-100' : 'opacity-0'
            )}
          >
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1920px] mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-3xl">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-6 animate-fade-in">
              Film & Television Composer
            </p>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-[#f5f5f0] leading-[0.9] mb-6">
              {composerInfo.name.split(' ').map((word, i) => (
                <span key={i} className="block">
                  {word.toUpperCase()}
                </span>
              ))}
            </h1>
            <p className="text-[#f5f5f0]/70 text-lg lg:text-xl max-w-lg mb-10">
              {composerInfo.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/films">
                <Button className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] rounded-full px-8 py-6 font-mono text-xs tracking-wider uppercase">
                  Explore Work
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-[#f5f5f0]/30 text-[#f5f5f0] hover:bg-[#f5f5f0]/10 rounded-full px-8 py-6 font-mono text-xs tracking-wider uppercase">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>

          {/* Now Playing Indicator */}
          <div className="absolute bottom-12 right-6 lg:right-12 hidden lg:block">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#f5f5f0]/10">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-400 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-[#0a0a0a]" />
                ) : (
                  <Play className="w-5 h-5 text-[#0a0a0a] ml-0.5" />
                )}
              </button>
              <div>
                <p className="text-[#f5f5f0] text-sm font-medium">{featuredWork[activeProject].title}</p>
                <p className="text-[#f5f5f0]/50 text-xs">{featuredWork[activeProject].type || featuredWork[activeProject].brand}</p>
              </div>
              <Volume2 className="w-4 h-4 text-[#f5f5f0]/50" />
            </div>
          </div>

          {/* Project Indicators */}
          <div className="absolute bottom-12 left-6 lg:left-12 flex gap-2">
            {featuredWork.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveProject(index)}
                className={cn(
                  'h-1 rounded-full transition-all duration-300',
                  index === activeProject ? 'w-12 bg-amber-500' : 'w-6 bg-[#f5f5f0]/30 hover:bg-[#f5f5f0]/50'
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div>
              <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0] mb-6">
                CRAFTING SONIC
                <span className="block text-amber-500">LANDSCAPES</span>
              </h2>
              <p className="text-[#f5f5f0]/70 text-lg leading-relaxed mb-6">
                {composerInfo.shortBio}
              </p>
              <p className="text-[#f5f5f0]/50 leading-relaxed mb-8">
                From intimate indie dramas to major advertising campaigns, my music serves the story. Every composition is tailored to enhance the emotional journey of your project.
              </p>
              <Link to="/about">
                <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-[#0a0a0a] rounded-full px-6 py-5 font-mono text-xs tracking-wider uppercase">
                  Learn More About Me
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { number: '50+', label: 'Projects Completed' },
                { number: '12', label: 'Awards & Nominations' },
                { number: '8+', label: 'Years Experience' },
                { number: '30+', label: 'Brand Partnerships' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-6 lg:p-8 rounded-xl bg-gradient-to-br from-[#151515] to-[#1a1a1a] border border-[#f5f5f0]/5"
                >
                  <p className="font-display text-4xl lg:text-5xl text-amber-500 mb-2">{stat.number}</p>
                  <p className="text-[#f5f5f0]/50 font-mono text-xs tracking-wider uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Films */}
      <section className="py-24 lg:py-32 bg-[#0d0d0d]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-4">Featured Work</p>
              <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0]">FILM SCORES</h2>
            </div>
            <Link to="/films" className="hidden sm:inline-flex items-center gap-2 text-[#f5f5f0]/70 hover:text-amber-500 transition-colors font-mono text-xs tracking-wider uppercase">
              View All Films
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filmProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} type="film" />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link to="/films">
              <Button className="w-full bg-transparent border border-[#f5f5f0]/20 text-[#f5f5f0] hover:bg-[#f5f5f0]/10 rounded-full py-6 font-mono text-xs tracking-wider uppercase">
                View All Films
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Ads */}
      <section className="py-24 lg:py-32 bg-[#0a0a0a]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-4">Commercial Work</p>
              <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0]">ADVERTISING</h2>
            </div>
            <Link to="/ads" className="hidden sm:inline-flex items-center gap-2 text-[#f5f5f0]/70 hover:text-amber-500 transition-colors font-mono text-xs tracking-wider uppercase">
              View All Ads
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adProjects.slice(0, 4).map((project) => (
              <ProjectCard key={project.id} project={project} type="ad" />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link to="/ads">
              <Button className="w-full bg-transparent border border-[#f5f5f0]/20 text-[#f5f5f0] hover:bg-[#f5f5f0]/10 rounded-full py-6 font-mono text-xs tracking-wider uppercase">
                View All Ads
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-br from-[#151515] to-[#0a0a0a]">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 text-center">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-6">Let's Create Together</p>
          <h2 className="font-display text-4xl lg:text-6xl xl:text-7xl text-[#f5f5f0] mb-6">
            HAVE A PROJECT
            <span className="block text-amber-500">IN MIND?</span>
          </h2>
          <p className="text-[#f5f5f0]/60 text-lg max-w-2xl mx-auto mb-10">
            I'm always excited to collaborate on new projects. Whether it's a feature film, documentary, or advertising campaign, let's discuss how we can bring your vision to life through music.
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

export default HomePage;
