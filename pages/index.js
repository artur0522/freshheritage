import React, {useState, useEffect} from 'react'
import { nacelleClient } from 'services'
import ContentSections from '../components/Sections/ContentSections'
import DynamicHero from "@/components/Sections/DynamicHero"
import { useCustomerContext } from '@/context/CustomerContext'
import PageSEO from '@/components/SEO/PageSEO'
import { getNacelleReferences } from '@/utils/getNacelleReferences'

export default function Home({ page }) {

  console.log("page:", page)

  const context = useCustomerContext()

  let foundDynamicHero

  const { customer } = context

  const dynamicHeroSections = page.fields.content.filter((section) => {
    return section._type === 'dynamicHero'
  })

  const foundTags = customer?.tags.filter((tag) => {
    return tag.toLowerCase() === 'seafood box' || tag.toLowerCase() === 'bi monthly seafood box'  || tag.toLowerCase() === 'premium seafood box'  || tag.toLowerCase() === 'premium seafood box no shellfish' || tag.toLowerCase() === 'salmon box'
  })

  if(foundTags?.includes('premium seafood box')) {
    foundDynamicHero = dynamicHeroSections.find((section) => {
      return section.memberType === 'premium seafood box'
    })
  } else if(foundTags?.includes('premium seafood box no shellfish')) {
    foundDynamicHero = dynamicHeroSections.find((section) => {
      return section.memberType === 'premium seafood box no shellfish'
    })
  } else if(foundTags?.includes('seafood box')) {
    foundDynamicHero = dynamicHeroSections.find((section) => {
      return section.memberType === 'seafood box'
    })
  } else if (foundTags?.includes('bi monthly seafood box')) {
    foundDynamicHero = dynamicHeroSections.find((section) => {
      return section.memberType === 'bi monthly seafood box'
    })
  } else if(foundTags?.includes('salmon box')) {
    foundDynamicHero = dynamicHeroSections.find((section) => {
      return section.memberType === 'salmon box'
    })
  } else {
    foundDynamicHero = dynamicHeroSections.find((section) => {
      return section.memberType === 'non subscribers'
    })
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