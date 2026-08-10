import React, { useState, useMemo, useEffect } from 'react';
import { Film, Filter, Grid, List, Music, Play } from 'lucide-react';
import { useSection, useCollection } from '../context/ContentContext';
import { ALL, filterOptions, matchesFilter } from '../lib/filters';
import AccentHeading from '../components/AccentHeading';
import ProjectCard from '../components/cards/ProjectCard';
import { cn } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { imageUrl, youtubeEmbedUrl } from '../lib/media';

const FilmsPage = () => {
  const page = useSection('filmsPage');
  const filmProjects = useCollection('films');
  const [selectedProject, setSelectedProject] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState(ALL);

  // Built from the films themselves, so a type the client invents in the admin
  // panel gets a button without anyone editing this file.
  const filters = useMemo(
    () => [ALL, ...filterOptions(filmProjects, 'type')],
    [filmProjects]
  );

  // The selected type can stop existing while someone is looking at the page -
  // renamed or deleted in the admin panel, or its last film unpublished. Fall
  // back to All rather than leaving an empty grid with no button lit up.
  useEffect(() => {
    if (filter !== ALL && !filters.some((f) => matchesFilter(f, filter))) {
      setFilter(ALL);
    }
  }, [filters, filter]);

  const filteredProjects = filmProjects.filter((p) =>
    matchesFilter(p.type, filter)
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24">
      {/* Page Header */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Film className="w-6 h-6 text-amber-500" />
              </div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500">{page.kicker}</p>
            </div>
            <h1 className="font-display text-5xl lg:text-7xl text-[#f5f5f0] mb-6">
              <AccentHeading text={page.heading} accent={page.accentWord} />
            </h1>
            <p className="text-[#f5f5f0]/60 text-lg lg:text-xl leading-relaxed">
              {page.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Filters & View Toggle */}
      <section className="border-y border-[#f5f5f0]/10">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Filter className="w-4 h-4 text-[#f5f5f0]/50 mr-2 hidden sm:block" />
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    'px-4 py-2 rounded-full font-mono text-xs tracking-wider uppercase whitespace-nowrap transition-all',
                    filter === f
                      ? 'bg-amber-500 text-[#0a0a0a]'
                      : 'bg-[#151515] text-[#f5f5f0]/70 hover:text-[#f5f5f0]'
                  )}
                >
                  {f === ALL ? 'All Projects' : f}
                </button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-2 border border-[#f5f5f0]/10 rounded-full p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                  viewMode === 'grid' ? 'bg-amber-500 text-[#0a0a0a]' : 'text-[#f5f5f0]/50 hover:text-[#f5f5f0]'
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                  viewMode === 'list' ? 'bg-amber-500 text-[#0a0a0a]' : 'text-[#f5f5f0]/50 hover:text-[#f5f5f0]'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  type="film"
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="group flex flex-col sm:flex-row gap-6 p-4 rounded-xl bg-[#151515] hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                >
                  <div className="w-full sm:w-48 h-64 sm:h-64 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={imageUrl(project.coverImage)}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-mono text-[10px] tracking-wider uppercase">
                        {project.type}
                      </span>
                      <span className="text-[#f5f5f0]/40 font-mono text-xs">{project.year}</span>
                    </div>
                    <h3 className="font-display text-xl text-[#f5f5f0] mb-1 group-hover:text-amber-500 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-[#f5f5f0]/50 text-sm line-clamp-2 mb-3">
                      {project.description}
                    </p>
                    <p className="text-[#f5f5f0]/30 text-xs">
                      Director: {project.director} • {project.genre}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:justify-center gap-4">
                    <span className="font-mono text-sm text-[#f5f5f0]/50">{project.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                    {selectedProject.type}
                  </span>
                  <span className="text-[#f5f5f0]/50 font-mono text-xs">{selectedProject.year}</span>
                  <span className="text-[#f5f5f0]/50 font-mono text-xs">• {selectedProject.genre}</span>
                </div>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl lg:text-4xl text-[#f5f5f0]">
                    {selectedProject.title}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-[#f5f5f0]/70 mt-4 mb-2">Director: {selectedProject.director}</p>
                <p className="text-[#f5f5f0]/60">{selectedProject.description}</p>

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
                          data-testid={`track-${index}`}
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
                              : selectedProject.soundcloudEmbed
                                ? `${selectedProject.soundcloudEmbed}&color=%23d97706&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`
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
                        data-testid="soundcloud-link"
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

export default FilmsPage;
