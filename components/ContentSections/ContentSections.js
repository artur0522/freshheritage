import React from 'react';
import dynamic from 'next/dynamic';

import FeaturedBlogContent from '../FeaturedBlogContent';
import FullBleedHero from '../FullBleedHero';
import SplitHero from '../SplitHero';
import FiftyFifty from '../FiftyFifty';
import PressLogos from '../PressLogos';
import ValueProps from '../ValueProps';
import CurrentHarvest from '../Harvest/CurrentHarvest';
import ProjectedHarvest from '../Harvest/ProjectedHarvest';
import GlobalSampler from '../Harvest/GlobalSampler';

const ContentSections = ({ sections }) => {
  if (!Array.isArray(sections)) {
    return null;
  }

  return sections.map((section) => {
    const type = section?._type;
    
    switch (type) {
      case 'hero':
        return <FullBleedHero fields={section} key={section._key} />;
      case 'splitHero':
        return <SplitHero fields={section} key={section._key} />
      case 'halfContentBlock':
        return <FiftyFifty fields={section} key={section._key} />
      case 'pressLogos':
        return <PressLogos fields={section} key={section._key} />
      case 'valueProps':
        return <ValueProps fields={section} key={section._key} />
      case 'featuredBlogContent':
        return <FeaturedBlogContent fields={section} key={section._key} />
      case 'currentSellingHarvest':
        return <CurrentHarvest fields={section} key={section._key} />
      case 'currentMonthHarvest':
        return <CurrentHarvest fields={section} key={section._key} />
      case 'projectedHarvest':
        return <ProjectedHarvest fields={section} key={section._key} />
      case 'globalSampler':
        return <GlobalSampler fields={section} key={section._key} />
      default:
        return null;
    }
  });
};

export default ContentSections;
