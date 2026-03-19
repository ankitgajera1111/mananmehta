import React, { useState } from 'react';
import { Film, Filter, Grid, List } from 'lucide-react';
import { filmProjects } from '../data/mock';
import ProjectCard from '../components/cards/ProjectCard';
import { cn } from '../lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

const FilmsPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');

  const filters = ['all', 'Feature Film', 'Documentary', 'Short Film'];

  const filteredProjects = filter === 'all' 
    ? filmProjects 
    : filmProjects.filter(p => p.type === filter);

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
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-amber-500">Film Compositions</p>
            </div>
            <h1 className="font-display text-5xl lg:text-7xl text-[#f5f5f0] mb-6">
              FILM <span className="text-amber-500">&</span> TV
            </h1>
            <p className="text-[#f5f5f0]/60 text-lg lg:text-xl leading-relaxed">
              Original scores for feature films, documentaries, and television. Each composition is crafted to serve the unique emotional landscape of the story.
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
                  {f === 'all' ? 'All Projects' : f}
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
                      src={project.coverImage}
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
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl bg-[#0a0a0a] border-[#f5f5f0]/10 p-0 overflow-hidden">
          {selectedProject && (
            <>
              <div className="relative h-64 lg:h-96">
                <img
                  src={selectedProject.coverImage}
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
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilmsPage;
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
