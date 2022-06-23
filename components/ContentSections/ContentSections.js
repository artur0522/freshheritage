import React from 'react'

import CurrentHarvest from '../Harvest/CurrentHarvest'
import ProjectedHarvestDrawer from '../Harvest/ProjectedHarvestDrawer'
import ProjectedHarvest from '../Harvest/ProjectedHarvest'
import GlobalSampler from '../Harvest/GlobalSampler'
import FeaturedBlogContent from '../FeaturedBlogContent'
import FullBleedHero from '../FullBleedHero'
import SplitHero from '../SplitHero'
import FiftyFifty from '../FiftyFifty'
import PressLogos from '../PressLogos'
import ValueProps from '../ValueProps'
import FAQs from '../FAQs'
import BlogHero from "../BlogHero"
import RecipeCategoriesList from '../RecipeCategoriesList'
import HalfHeroHalfSlider from '../HalfHeroHalfSlider'
import EmailSignup from '../EmailSignup'
import BrowseCategory from '../BrowseCategory'

const ContentSections = ({ sections }) => {
  if (!Array.isArray(sections)) {
    return null
  }

  return sections.map((section) => {
    const type = section?._type
    
    switch (type) {
      case 'hero':
        return <FullBleedHero fields={section} key={section._key} />
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
      case 'faqs':
        return <FAQs fields={section} key={section._key} />
      case 'blogHero':
        return <BlogHero fields={section} key={section._key} />
      case 'recipeCategoriesList':
        return <RecipeCategoriesList fields={section} key={section._key} />
      case 'halfHeroHalfSlider':
        return <HalfHeroHalfSlider fields={section} key={section._key} />
      case 'emailSignup':
        return <EmailSignup fields={section} key={section._key} />
      case 'browseCategory':
        return <BrowseCategory fields={section} key={section._key} />
      default:
        return null
    }
  })
}

export default ContentSections
