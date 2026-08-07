import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Music, Play } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useSection, useCollection } from '../context/ContentContext';
import ProjectCard from '../components/cards/ProjectCard';
import { cn } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { imageUrl, youtubeEmbedUrl } from '../lib/media';

const HomePage = () => {
  const composerInfo = useSection('settings');
  const home = useSection('home');
  const filmProjects = useCollection('films');
  const adProjects = useCollection('ads');

  const [activeProject, setActiveProject] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);

  /**
   * The hero rotation the client picked in the admin panel.
   *
   * home.featuredWork holds {kind, projectId} references rather than copies, so
   * editing a project updates its slide automatically. References to a deleted
   * or unpublished project are dropped here; if that leaves nothing, we fall
   * back to the first few films so the hero is never blank.
   */
  const featuredWork = useMemo(() => {
    const byId = {
      film: new Map(filmProjects.map((p) => [p.id, p])),
      ad: new Map(adProjects.map((p) => [p.id, p])),
    };
    const picked = (home.featuredWork || [])
      .map((ref) => byId[ref.kind]?.get(ref.projectId))
      .filter(Boolean);
    return picked.length ? picked : filmProjects.slice(0, 5);
  }, [home.featuredWork, filmProjects, adProjects]);

  // Auto-rotate the hero. The final slide is held slightly shorter so the loop
  // back to the first does not feel like a stall.
  useEffect(() => {
    if (featuredWork.length < 2) return undefined;
    const base = home.rotationMs || 5000;
    const isLast = activeProject === featuredWork.length - 1;
    const interval = setInterval(
      () => setActiveProject((prev) => (prev + 1) % featuredWork.length),
      isLast ? Math.round(base * 0.7) : base
    );
    return () => clearInterval(interval);
  }, [activeProject, featuredWork.length, home.rotationMs]);

  // A shortened rotation list must never leave the index out of bounds.
  useEffect(() => {
    if (activeProject >= featuredWork.length) setActiveProject(0);
  }, [activeProject, featuredWork.length]);

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
              src={imageUrl(project.coverImage)}
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
              {home.heroKicker}
            </p>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl text-[#f5f5f0] leading-[0.9] mb-6">
              {(composerInfo.name || '').split(' ').map((word) => (
                <span key={word} className="block">
                  {word.toUpperCase()}
                </span>
              ))}
            </h1>
            <p className="text-[#f5f5f0]/70 text-lg lg:text-xl max-w-lg mb-16">
              {home.heroTagline || composerInfo.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-24">
              <Link to="/films">
                <Button className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] rounded-full px-8 py-6 font-mono text-xs tracking-wider uppercase">
                  {home.heroPrimaryCta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-[#f5f5f0]/30 text-[#f5f5f0] hover:bg-[#f5f5f0]/10 rounded-full px-8 py-6 font-mono text-xs tracking-wider uppercase">
                  {home.heroSecondaryCta}
                </Button>
              </Link>
            </div>
          </div>

          {/* Project Title Indicator */}
          {featuredWork[activeProject] && (
            <div className="absolute bottom-12 right-6 lg:right-12 hidden lg:block">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-[#0a0a0a]/80 backdrop-blur-sm border border-[#f5f5f0]/10">
                <div>
                  <p className="text-[#f5f5f0] text-sm font-medium">{featuredWork[activeProject].title}</p>
                  <p className="text-[#f5f5f0]/50 text-xs">{featuredWork[activeProject].type || featuredWork[activeProject].brand}</p>
                </div>
              </div>
            </div>
          )}

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
                {home.introHeadingLine1}
                <span className="block text-amber-500">{home.introHeadingLine2}</span>
              </h2>
              <p className="text-[#f5f5f0]/50 leading-relaxed mb-8">
                {home.introBody}
              </p>
              <Link to="/about">
                <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-[#0a0a0a] rounded-full px-6 py-5 font-mono text-xs tracking-wider uppercase">
                  {home.introCtaLabel}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Services */}
            <div className="grid grid-cols-2 gap-6">
              {(home.services || []).map((service) => (
                <div
                  key={service.title}
                  className="p-6 lg:p-8 rounded-xl bg-gradient-to-br from-[#151515] to-[#1a1a1a] border border-[#f5f5f0]/5"
                >
                  <p className="font-display text-xl lg:text-2xl text-amber-500 mb-2">{service.title}</p>
                  <p className="text-[#f5f5f0]/50 text-sm leading-relaxed">{service.description}</p>
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
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-4">{home.filmsKicker}</p>
              <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0]">{home.filmsHeading}</h2>
            </div>
            <Link to="/films" className="hidden sm:inline-flex items-center gap-2 text-[#f5f5f0]/70 hover:text-amber-500 transition-colors font-mono text-xs tracking-wider uppercase">
              View All Films
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filmProjects.map((project) => (
              <ProjectCard key={project.id} project={project} type="film" onClick={() => setSelectedProject(project)} />
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
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-4">{home.adsKicker}</p>
              <h2 className="font-display text-3xl lg:text-5xl text-[#f5f5f0]">{home.adsHeading}</h2>
            </div>
            <Link to="/ads" className="hidden sm:inline-flex items-center gap-2 text-[#f5f5f0]/70 hover:text-amber-500 transition-colors font-mono text-xs tracking-wider uppercase">
              View All Ads
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {adProjects.map((project) => (
              <ProjectCard key={project.id} project={project} type="ad" onClick={() => setSelectedProject(project)} />
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
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500 mb-6">{home.ctaKicker}</p>
          <h2 className="font-display text-4xl lg:text-6xl xl:text-7xl text-[#f5f5f0] mb-6">
            {home.ctaHeadingLine1}
            <span className="block text-amber-500">{home.ctaHeadingLine2}</span>
          </h2>
          <p className="text-[#f5f5f0]/60 text-lg max-w-2xl mx-auto mb-10">
            {home.ctaBody}
          </p>
          <Link to="/contact">
            <Button className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] rounded-full px-10 py-6 font-mono text-sm tracking-wider uppercase">
              {home.ctaButtonLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => { setSelectedProject(null); setPlayingTrack(null); }}>
        <DialogContent className="max-w-4xl bg-[#0a0a0a] border-[#f5f5f0]/10 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <div className="relative h-64 lg:h-96">
                <img
                  src={imageUrl(selectedProject.coverImage)}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
              </div>
              <div className="p-6 lg:p-8 -mt-20 relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 font-mono text-xs tracking-wider uppercase">
                    {selectedProject.type || selectedProject.brand}
                  </span>
                  <span className="text-[#f5f5f0]/50 font-mono text-xs">{selectedProject.year}</span>
                  {selectedProject.genre && (
                    <span className="text-[#f5f5f0]/50 font-mono text-xs">• {selectedProject.genre}</span>
                  )}
                </div>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl lg:text-4xl text-[#f5f5f0]">
                    {selectedProject.title}
                  </DialogTitle>
                </DialogHeader>
                {selectedProject.director && (
                  <p className="text-[#f5f5f0]/70 mt-4 mb-2">Director: {selectedProject.director}</p>
                )}
                <p className="text-[#f5f5f0]/60">{selectedProject.description}</p>

                {/* YouTube Embed for Ads */}
                {selectedProject.youtubeId && (
                  <div className="mt-6 rounded-lg overflow-hidden aspect-video">
                    <iframe
                      width="100%"
                      height="100%"
                      src={youtubeEmbedUrl(selectedProject.youtubeId)}
                      title={selectedProject.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                {/* Original Song - YouTube Embed */}
                {selectedProject.originalSong && (
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Music className="w-4 h-4 text-amber-500" />
                      <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-amber-500">
                        Original Song
                      </h3>
                    </div>
                    <div className="rounded-lg overflow-hidden aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={youtubeEmbedUrl(selectedProject.originalSong.youtubeId)}
                        title={selectedProject.originalSong.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Tracklist */}
                {selectedProject.tracks && selectedProject.tracks.length > 0 && (
                  <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Music className="w-4 h-4 text-amber-500" />
                      <h3 className="font-mono text-xs tracking-[0.15em] uppercase text-amber-500">
                        Original Score
                      </h3>
                    </div>
                    <div className="space-y-1">
                      {selectedProject.tracks.map((track, index) => (
                        <button
                          key={track.title}
                          onClick={() => setPlayingTrack(playingTrack === index ? null : index)}
                          data-testid={`home-track-${index}`}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left",
                            playingTrack === index
                              ? "bg-amber-500/15 border border-amber-500/30"
                              : "bg-[#151515] hover:bg-[#1a1a1a] border border-transparent"
                          )}
                        >
                          <span className="w-6 text-center font-mono text-xs text-[#f5f5f0]/40">
                            {playingTrack === index ? (
                              <Play className="w-3.5 h-3.5 text-amber-500 mx-auto" />
                            ) : (
                              index + 1
                            )}
                          </span>
                          <span className={cn(
                            "text-sm flex-1",
                            playingTrack === index ? "text-amber-500" : "text-[#f5f5f0]/80"
                          )}>
                            {track.title}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* SoundCloud Embed Player */}
                    {playingTrack !== null && (
                      <div className="mt-4 rounded-lg overflow-hidden">
                        <iframe
                          title={selectedProject.tracks[playingTrack].title}
                          width="100%"
                          height="166"
                          scrolling="no"
                          frameBorder="no"
                          allow="autoplay"
                          src={
                            selectedProject.tracks[playingTrack].embedUrl
                              ? `${selectedProject.tracks[playingTrack].embedUrl}&color=%23d97706&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`
                              : `https://w.soundcloud.com/player/?url=${encodeURIComponent(selectedProject.tracks[playingTrack].url)}&color=%23d97706&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`
                          }
                        />
                      </div>
                    )}

                    {/* Full Album Link */}
                    {selectedProject.soundcloudPlaylist && (
                      <a
                        href={selectedProject.soundcloudPlaylist}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-amber-500 hover:text-amber-400 font-mono text-xs tracking-wider uppercase transition-colors"
                      >
                        Listen on SoundCloud
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HomePage;
