import React, { useState } from 'react';
import { Megaphone, Filter, Grid, List } from 'lucide-react';
import { adProjects } from '../data/mock';
import ProjectCard from '../components/cards/ProjectCard';
import AudioPlayer from '../components/audio/AudioPlayer';
import { cn } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const AdsPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');

  const brands = ['all', ...new Set(adProjects.map(p => p.brand))];

  const filteredProjects = filter === 'all' 
    ? adProjects 
    : adProjects.filter(p => p.brand === filter);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-24">
      {/* Page Header */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Megaphone className="w-6 h-6 text-amber-500" />
              </div>
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500">Commercial Work</p>
            </div>
            <h1 className="font-display text-5xl lg:text-7xl text-[#f5f5f0] mb-6">
              ADVERTISING
            </h1>
            <p className="text-[#f5f5f0]/60 text-lg lg:text-xl leading-relaxed">
              Music for global brands and advertising campaigns. From product launches to brand anthems, creating memorable sonic identities that resonate with audiences.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Logos Showcase */}
      <section className="border-y border-[#f5f5f0]/10 py-8">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-center gap-8 lg:gap-16 opacity-50 flex-wrap">
            {['Tropicana', 'Lakmé', 'Volvo', 'Samsung', 'Squarespace', 'Lay\'s', 'Durex'].map((brand) => (
              <span key={brand} className="font-display text-lg lg:text-2xl text-[#f5f5f0] tracking-wider">
                {brand.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Filters & View Toggle */}
      <section className="border-b border-[#f5f5f0]/10">
        <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Filter className="w-4 h-4 text-[#f5f5f0]/50 mr-2 hidden sm:block" />
              {brands.slice(0, 6).map((b) => (
                <button
                  key={b}
                  onClick={() => setFilter(b)}
                  className={cn(
                    'px-4 py-2 rounded-full font-mono text-xs tracking-wider uppercase whitespace-nowrap transition-all',
                    filter === b
                      ? 'bg-amber-500 text-[#0a0a0a]'
                      : 'bg-[#151515] text-[#f5f5f0]/70 hover:text-[#f5f5f0]'
                  )}
                >
                  {b === 'all' ? 'All Brands' : b}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  type="ad"
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
                  <div className="w-full sm:w-64 h-36 sm:h-36 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-mono text-[10px] tracking-wider uppercase">
                        {project.brand}
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
                      {project.type}
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:justify-center gap-4">
                    <span className="font-mono text-sm text-[#f5f5f0]/50">{project.duration}s</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl bg-[#0a0a0a] border-[#f5f5f0]/10 p-0 overflow-hidden">
          {selectedProject && (
            <>
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 font-mono text-xs tracking-wider uppercase">
                    {selectedProject.brand}
                  </span>
                  <span className="text-[#f5f5f0]/50 font-mono text-xs">{selectedProject.year}</span>
                  <span className="text-[#f5f5f0]/50 font-mono text-xs">• {selectedProject.type}</span>
                </div>
                <DialogHeader>
                  <DialogTitle className="font-display text-3xl text-[#f5f5f0]">
                    {selectedProject.title}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-[#f5f5f0]/60 mt-4 mb-6">{selectedProject.description}</p>

                {/* YouTube Video Embed */}
                {selectedProject.youtubeId && (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedProject.youtubeId}?autoplay=1`}
                      title={selectedProject.title}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
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

export default AdsPage;
