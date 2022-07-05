import React from 'react'

import CurrentHarvest from '../Harvest/CurrentHarvest'
import ProjectedHarvestDrawer from '../Harvest/ProjectedHarvestDrawer'
import ProjectedHarvest from '../Harvest/ProjectedHarvest'
import GlobalSampler from '../Harvest/GlobalSampler'
import FeaturedBlogContent from '@/components/Sections/FeaturedBlogContent'
import FullBleedHero from '@/components/Sections/FullBleedHero'
import SplitHero from '@/components/Sections/SplitHero'
import FiftyFifty from '@/components/Sections/FiftyFifty'
import PressLogos from '@/components/Sections/PressLogos'
import ValueProps from '@/components/Sections/ValueProps'
import FAQs from '@/components/Sections/FAQs'
import BlogHero from "@/components/Sections/BlogHero"
import RecipeCategoriesList from '@/components/Sections/RecipeCategoriesList'
import HalfHeroHalfSlider from '@/components/Sections/HalfHeroHalfSlider'
import EmailSignup from '../EmailSignup'
import BrowseCategory from '@/components/Sections/BrowseCategory'
import ArticleRow from '@/components/Sections/ArticleRow'
import HalfVideoBlock from '@/components/Sections/HalfVideoBlock'

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
      case 'articleRow':
        return <ArticleRow fields={section} key={section._key} />
      case 'halfVideoBlock':
        return <HalfVideoBlock fields={section} key={section._key} />
      default:
        return null
    }
  })
}

export default ContentSections
