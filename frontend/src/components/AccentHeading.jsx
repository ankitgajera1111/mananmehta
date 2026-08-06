import React from 'react';

/**
 * Renders a heading with one word picked out in amber.
 *
 * The design has several of these ("FILM & TV", "LET'S TALK"). Storing the
 * heading as plain text plus the word to accent keeps the CMS field something a
 * non-technical person can edit, while the two-tone styling stays in code.
 * An empty or unmatched `accent` simply renders the plain heading.
 */
const AccentHeading = ({ text = '', accent = '', className = '' }) => {
  if (!accent || !text.includes(accent)) {
    return <span className={className}>{text}</span>;
  }

  const at = text.indexOf(accent);
  return (
    <span className={className}>
      {text.slice(0, at)}
      <span className="text-amber-500">{accent}</span>
      {text.slice(at + accent.length)}
    </span>
  );
};

export default AccentHeading;
