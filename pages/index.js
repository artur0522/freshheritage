import { nacelleClient } from 'services'
import ContentSections from '../components/Sections/ContentSections'
import DynamicHero from "@/components/Sections/DynamicHero"
import { useCustomerContext } from '@/context/CustomerContext'
import PageSEO from '@/components/SEO/PageSEO'
import { getNacelleReferences } from '@/utils/getNacelleReferences'

export default function Home({ page }) {

  const context = useCustomerContext()

  const { customer } = context

  const dynamicHeroSections = page.fields.content.filter((section) => {
    return section._type === 'dynamicHero'
  })

  let foundDynamicHero

  foundDynamicHero = dynamicHeroSections.find((section) => {
    return section.memberType === 'non subscribers'
  })

  if (customer) {
    if(customer.tags.includes('PS')) {
      foundDynamicHero = dynamicHeroSections.find((section) => {
        return section.memberType === 'premium seafood box'
      })
    } else if(customer.tags.includes('PSWS')) {
      foundDynamicHero = dynamicHeroSections.find((section) => {
        return section.memberType === 'premium seafood box no shellfish'
      })
    } else if(customer.tags.includes('SF')) {
      foundDynamicHero = dynamicHeroSections.find((section) => {
        return section.memberType === 'seafood box'
      })
    } else if (customer.tags.includes('SF-BI')) {
      foundDynamicHero = dynamicHeroSections.find((section) => {
        return section.memberType === 'bi monthly seafood box'
      })
    } else if(customer.tags.includes('S')) {
      foundDynamicHero = dynamicHeroSections.find((section) => {
        return section.memberType === 'salmon box'
      })
    }
  }

  return (
    <>
      <PageSEO seo={page.fields.seo} />
      {!context.customerLoading && <DynamicHero fields={foundDynamicHero} />}
      <ContentSections sections={page.fields.content} />
    </>
  )
}

export async function getStaticProps({ previewData }) {

  const pages = await nacelleClient.content({
    handles: ['homepage'],
    type: 'page',
    entryDepth: 1
  })

  const fullPage = await getNacelleReferences(pages[0])

  return {
    props: {
      page: fullPage
    }
  }

}