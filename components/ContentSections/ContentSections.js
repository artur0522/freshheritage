import React from 'react';
import dynamic from 'next/dynamic';

import FullBleedHero from '../FullBleedHero';
import SplitHero from '../SplitHero';

const ContentSections = ({ sections }) => {
  console.log('sections', sections);
  if (!Array.isArray(sections)) {
    return null;
  }

  return sections.map((section) => {
    const type = section?._type;
    console.log('type', type);

    switch (type) {
      case 'hero':
        return <FullBleedHero fields={section} key={section._key} />;
      case 'splitHero':
        return <SplitHero fields={section} key={section._key} />
      // ...add additional cases for whichever content types are needed
      default:
        return null;
    }
  });
};

export default ContentSections;
