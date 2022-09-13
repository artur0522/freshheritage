import { forwardRef } from 'react'

import { useRouter } from 'next/router'
import { useTheCatchContext } from '@/context/TheCatchContext'

import CurrentHarvest from '../../Harvest/CurrentHarvest'
import StaticHarvest from '@/components/Harvest/StaticHarvest'
import ProjectedHarvestDrawer from '../../Harvest/ProjectedHarvestDrawer'
import ProjectedHarvest from '../../Harvest/ProjectedHarvest'
import GlobalSampler from '../../Harvest/GlobalSampler'
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
import EmailSignupBlock from '@/components/Sections/EmailSignupBlock'
import BrowseCategory from '@/components/Sections/BrowseCategory'
import ArticleRow from '@/components/Sections/ArticleRow'
import HalfVideoBlock from '@/components/Sections/HalfVideoBlock'
import FeaturedFishCarousel from '@/components/Sections/FeaturedFishCarousel'
import AllKnowYourFishblock from '@/components/Sections/AllKnowYourFishBlock'
import FeaturedText from '@/components/Sections/FeaturedText'
import FiftyFiftyImage from '@/components/Sections/FiftyFiftyImage'
import BoldHeaderText from '@/components/Sections/BoldHeaderText'
import ImageWithText from '@/components/Sections/ImageWithText'
import ImageTextColumns from '../ImageTextColumns'
import WYSIWYG from '@/components/Sections/WYSIWYG'
import ContactUs from '@/components/Sections/ContactUs'
import Accordion from '../Accordion'
import ReviewsCarousel from '@/components/Sections/ReviewsCarousel'
import FishermenPartners from '../FishermenPartners'
import ProductReviews from '@/components/Product/ProductReviews'

const ContentSections = forwardRef(({ sections, harvestMetafield, harvests, disableHarvestFilters, product}, ref) => {
  const router = useRouter()

  if (harvestMetafield === undefined && router.pathname.includes('/products')) {
    harvestMetafield = null
  } else if (harvestMetafield === undefined && !router.pathname.includes('/products')) {
    harvestMetafield = {}
  } else if(!harvestMetafield) {
    harvestMetafield = {}
  } else {
    harvestMetafield = harvestMetafield
  }

  if (!Array.isArray(sections)) {
    return null
  }

  return sections.map((section, index) => {
    const type = section?._type

    const imagePriority = index < 2

    switch (type) {
      case 'hero':
        return <FullBleedHero fields={section} imagePriority={imagePriority} key={section._key} />
      case 'splitHero':
        return <SplitHero fields={section} imagePriority={imagePriority} key={section._key} />
      case 'halfContentBlock':
        return <FiftyFifty fields={section} key={section._key} />
      case 'pressLogos':
        return <PressLogos fields={section} key={section._key} />
      case 'valueProps':
        return <ValueProps fields={section} key={section._key} />
      case 'featuredBlogContent':
        return <FeaturedBlogContent fields={section} key={section._key} />
      case 'currentSellingHarvest':
        if(harvestMetafield) {
          return <CurrentHarvest fields={section} key={section._key} />
        } else {
          return null
        }
      case 'currentMonthHarvest':
        if(harvestMetafield) {
          return <CurrentHarvest fields={section} key={section._key} />
        } else {
          return null
        }
      case 'projectedHarvest':
        if(harvestMetafield) {
          return <ProjectedHarvest fields={section} key={section._key} />
        } else if (harvests) {
          section = {
            ...section,
            harvestList: harvests
          }
          return <ProjectedHarvest fields={section} disableHarvestFilters={disableHarvestFilters} key={section._key} />
        } else {
          return null
        }
      case 'staticHarvest':
        if(harvestMetafield) {
          return <StaticHarvest fields={section} key={section._key} />
        } else {
          return null
        }
      case 'globalSampler':
        if(harvestMetafield) {
          return <CurrentHarvest fields={section} key={section._key} />
        } else {
          return null
        }
      case 'faqs':
        return <FAQs fields={section} key={section._key} />
      case 'blogHero':
        return <BlogHero fields={section} imagePriority={imagePriority} key={section._key} />
      case 'recipeCategoriesList':
        return <RecipeCategoriesList fields={section} key={section._key} />
      case 'halfHeroHalfSlider':
        return <HalfHeroHalfSlider fields={section} imagePriority={imagePriority} key={section._key} />
      case 'emailSignup':
        return <div className="bg-color--fawn">
          <div className="container">
            <EmailSignupBlock props={{
              emailSignup: section
            }} key={section._key} />
          </div>
        </div>
      case 'browseCategory':
        return <BrowseCategory fields={section} key={section._key} />
      case 'articleRow':
        return <ArticleRow fields={section} key={section._key} />
      case 'recipeArticleRow':
        return <ArticleRow fields={section} key={section._key} />
      case 'halfVideoBlock':
        return <HalfVideoBlock fields={section} key={section._key} />
      case 'featuredText':
        return <FeaturedText fields={section} key={section._key} />
      case 'fiftyFiftyImageBlock':
        return <FiftyFiftyImage fields={section} key={section._key} />
      case 'boldHeaderText':
        return <BoldHeaderText fields={section} key={section._key} />
      case 'imageWithText':
        return <ImageWithText fields={section} key={section._key} />
      case 'imageTextColumns':
        return <ImageTextColumns fields={section} key={section._key} />
      case 'wysiwyg':
        return <WYSIWYG fields={section} key={section._key} />
      case 'contactUs':
        return <ContactUs fields={section} key={section._key} />
      case 'accordion':
        return <Accordion fields={section} key={section._key} />
      case 'featuredFishCarousel':
        return <FeaturedFishCarousel fields={section} key={section._key} />
      case 'featuredFishermenCarousel':
        return <FeaturedFishCarousel fields={section} key={section._key} />
      case 'allKnowYourFishBlock':
        return <AllKnowYourFishblock fields={section} key={section._key} />
      case 'reviewsCarousel':
        return <ReviewsCarousel fields={section} key={section._key} />
      case 'fishermenPartners':
        return <FishermenPartners fields={section} key={section._key} />
      case 'productReviews':
        if (product) {
          return <ProductReviews ref={ref} product={product} fields={section} key={section._key} />
        }
        return null
      default:
        return null
    }
  })
})

export default ContentSections
