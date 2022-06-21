import React, {useState, useEffect} from 'react'
import { nacelleClient } from 'services'
import ContentSections from '../components/ContentSections'
import DynamicHero from "../components/DynamicHero"
import { useCustomerContext } from '@/context/CustomerContext'
import PageSEO from '@/components/Layout/PageSEO'

export default function Home({ pages }) {
  const homePage = pages.find((page) => page.handle === 'homepage')
  const context = useCustomerContext()

  let foundDynamicHero

  const { customer } = context

  const dynamicHeroSections = homePage.fields.content.filter((section) => {
    return section._type === 'dynamicHero'
  })

  const foundTags = customer?.tags.filter((tag) => {
    return tag === 'seafood box' || tag === 'bi monthly seafood box'  || tag === 'premium seafood box'  || tag === 'premium seafood box no shellfish' || tag === 'salmon box'
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
      <PageSEO seo={homePage.fields.seo} />
      {!context.customerLoading && <DynamicHero fields={foundDynamicHero} />}
      <ContentSections sections={homePage.fields.content} />
    </>
  )
}

export async function getStaticProps({ previewData }) {
  try {
    const pages = await nacelleClient.content({
      handles: ['homepage']
    })

    return {
      props: { pages }
    }
  } catch {
    // fake hero image section until Sanity is hooked up
    const page = {
      sections: [
        {
          sys: {
            id: 'testid',
            contentType: {
              sys: {
                id: 'heroBanner'
              }
            }
          },
          fields: {
            title: 'Sitka Salmon Shares',
            featuredMedia: {
              fields: {
                file: {
                  url: 'https://i.picsum.photos/id/11/1400/500.jpg?hmac=V3wFB6qaKu4yf-50Fix6CL0D4eyOBLfSpJYcyNB2Uyw'
                }
              }
            },
            backgroundAltTag: 'Sitka Alt Tag'
          }
        }
      ]
    }

    return {
      props: {
        page
      }
    }
  }
}