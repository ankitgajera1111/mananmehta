import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { Button } from '../ui/button';

/**
 * Holds the site back until content exists.
 *
 * Only the very first visit ever sees this: afterwards ContentProvider paints
 * from its localStorage cache and revalidates silently. The markup mimics the
 * dark hero so the transition into the real page isn't a flash of white.
 */
const ContentGate = ({ children }) => {
  const { content, loading, error, refresh } = useContent();

  if (content) return children;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin" />
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#f5f5f0]/40">
            Loading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-6 h-6 text-amber-500" />
        </div>
        <h1 className="font-display text-2xl text-[#f5f5f0] mb-3">
          Content unavailable
        </h1>
        <p className="text-[#f5f5f0]/50 mb-8">
          {error?.message === 'Cannot reach the server.'
            ? 'The server is not responding. Please try again in a moment.'
            : 'We could not load the site content. Please try again in a moment.'}
        </p>
        <Button
          onClick={refresh}
          className="bg-amber-500 hover:bg-amber-400 text-[#0a0a0a] rounded-full px-8 py-6 font-mono text-xs tracking-wider uppercase"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ContentGate;
