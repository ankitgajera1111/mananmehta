import React, { useState } from 'react';
import { Play, Pause, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { imageUrl } from '../../lib/media';

const ProjectCard = ({ 
  project, 
  type = 'film',
  variant = 'default',
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  // Check if this is an ad (has youtubeId) - only ads are playable
  const isPlayable = type === 'ad' && project.youtubeId;

  if (variant === 'featured') {
    return (
      <div
        className="group relative overflow-hidden rounded-xl cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Background Image */}
        <div className="aspect-[16/9] relative overflow-hidden">
          <img
            src={imageUrl(project.coverImage)}
            alt={project.title}
            className={cn(
              'w-full h-full object-cover transition-transform duration-700',
              isHovered && 'scale-105'
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-end">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-500 font-mono text-xs tracking-wider uppercase">
                  {type === 'film' ? project.genre : project.type}
                </span>
                <span className="text-[#f5f5f0]/50 font-mono text-xs">
                  {project.year}
                </span>
              </div>
              <h3 className="font-display text-2xl lg:text-4xl text-[#f5f5f0] mb-2">
                {project.title}
              </h3>
              <p className="text-[#f5f5f0]/60 text-sm lg:text-base max-w-lg line-clamp-2">
                {project.description}
              </p>
            </div>

            {/* Play Button - Only for ads */}
            {isPlayable && (
              <button
                onClick={handlePlayClick}
                className={cn(
                  'w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center transition-all duration-300',
                  'bg-amber-500 hover:bg-amber-400',
                  isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-80'
                )}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-[#0a0a0a]" />
                ) : (
                  <Play className="w-6 h-6 text-[#0a0a0a] ml-1" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative overflow-hidden rounded-xl cursor-pointer bg-[#151515]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Cover Image */}
      <div className={cn(
        "relative overflow-hidden",
        type === 'film' ? 'aspect-[3/4]' : 'aspect-video'
      )}>
        <img
          src={imageUrl(project.coverImage)}
          alt={project.title}
          className={cn(
            'w-full h-full object-cover object-center transition-transform duration-500',
            isHovered && 'scale-110'
          )}
        />
        <div className={cn(
          'absolute inset-0 bg-[#0a0a0a]/60 transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )} />

        {/* Play Button - Only for ads */}
        {isPlayable && (
          <button
            onClick={handlePlayClick}
            className={cn(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center',
              'transition-all duration-300',
              isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
            )}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-[#0a0a0a]" />
            ) : (
              <Play className="w-5 h-5 text-[#0a0a0a] ml-0.5" />
            )}
          </button>
        )}

        {/* Duration Badge - Only for ads */}
        {isPlayable && project.duration && (
          <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-[#0a0a0a]/80 text-[#f5f5f0] font-mono text-xs">
            {project.duration}
          </span>
        )}

        {/* Role Badge - Only for films */}
        {type === 'film' && project.role && (
          <span className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded bg-[#0a0a0a]/90 text-amber-500 font-mono text-xs text-center tracking-wider uppercase">
            {project.role}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-mono text-[10px] tracking-wider uppercase">
            {type === 'film' ? project.type : project.brand}
          </span>
          <span className="text-[#f5f5f0]/40 font-mono text-xs">
            {project.year}
          </span>
        </div>
        <h3 className="font-display text-lg text-[#f5f5f0] mb-1 group-hover:text-amber-500 transition-colors">
          {project.title}
        </h3>
        <p className="text-[#f5f5f0]/50 text-sm line-clamp-2">
          {project.description}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
