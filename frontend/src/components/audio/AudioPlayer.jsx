import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { Slider } from '../ui/slider';
import { cn } from '../../lib/utils';

const AudioPlayer = ({ 
  track, 
  coverImage, 
  projectTitle, 
  projectType,
  variant = 'default',
  onNext,
  onPrev,
  showControls = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Simulated duration for demo (since we don't have real audio files)
  useEffect(() => {
    const [mins, secs] = (track?.duration || '3:30').split(':').map(Number);
    setDuration(mins * 60 + secs);
  }, [track]);

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Simulate playback progress
  useEffect(() => {
    let interval;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, currentTime]);

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4 p-4 bg-[#151515] rounded-lg">
        <button
          onClick={handlePlayPause}
          className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-400 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-[#0a0a0a]" />
          ) : (
            <Play className="w-4 h-4 text-[#0a0a0a] ml-0.5" />
          )}
        </button>
        <div className="flex-1">
          <p className="text-[#f5f5f0] text-sm font-medium truncate">{track?.title || 'Track Title'}</p>
          <p className="text-[#f5f5f0]/50 text-xs">{projectTitle}</p>
        </div>
        <span className="text-[#f5f5f0]/50 text-xs font-mono">{formatTime(currentTime)} / {formatTime(duration)}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      'bg-gradient-to-br from-[#151515] to-[#1a1a1a] rounded-xl overflow-hidden',
      variant === 'featured' ? 'p-6 lg:p-8' : 'p-4 lg:p-6'
    )}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Album Art */}
        <div className={cn(
          'relative flex-shrink-0 rounded-lg overflow-hidden',
          variant === 'featured' ? 'w-full lg:w-64 h-64' : 'w-full lg:w-48 h-48'
        )}>
          <img
            src={coverImage}
            alt={projectTitle}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          {/* Play button overlay */}
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div className={cn(
              'rounded-full bg-amber-500/90 flex items-center justify-center transition-all',
              'group-hover:scale-110 group-hover:bg-amber-500',
              variant === 'featured' ? 'w-16 h-16' : 'w-12 h-12'
            )}>
              {isPlaying ? (
                <Pause className={cn('text-[#0a0a0a]', variant === 'featured' ? 'w-7 h-7' : 'w-5 h-5')} />
              ) : (
                <Play className={cn('text-[#0a0a0a] ml-1', variant === 'featured' ? 'w-7 h-7' : 'w-5 h-5')} />
              )}
            </div>
          </button>
        </div>

        {/* Track Info & Controls */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="font-mono text-xs tracking-[0.15em] uppercase text-amber-500 mb-2">
              {projectType}
            </p>
            <h3 className={cn(
              'font-display text-[#f5f5f0] mb-1',
              variant === 'featured' ? 'text-2xl lg:text-3xl' : 'text-xl lg:text-2xl'
            )}>
              {projectTitle}
            </h3>
            <p className="text-[#f5f5f0]/70 text-lg">
              {track?.title || 'Track Title'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 space-y-2">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleProgressChange}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs font-mono text-[#f5f5f0]/50">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          {showControls && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {onPrev && (
                  <button
                    onClick={onPrev}
                    className="w-10 h-10 rounded-full border border-[#f5f5f0]/20 flex items-center justify-center text-[#f5f5f0]/70 hover:text-[#f5f5f0] hover:border-[#f5f5f0]/40 transition-all"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handlePlayPause}
                  className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center hover:bg-amber-400 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-[#0a0a0a]" />
                  ) : (
                    <Play className="w-5 h-5 text-[#0a0a0a] ml-0.5" />
                  )}
                </button>
                {onNext && (
                  <button
                    onClick={onNext}
                    className="w-10 h-10 rounded-full border border-[#f5f5f0]/20 flex items-center justify-center text-[#f5f5f0]/70 hover:text-[#f5f5f0] hover:border-[#f5f5f0]/40 transition-all"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-3">
                <button onClick={toggleMute} className="text-[#f5f5f0]/70 hover:text-[#f5f5f0] transition-colors">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  className="w-24 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
