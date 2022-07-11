import React from 'react'

import { nacelleClient } from 'services'
import ContentSections from '../../../components/Sections/ContentSections'
import PageSEO from '@/components/SEO/PageSEO'

export default function CulinaryBlog({ pages }) {
  const culinaryBlogPage = pages.find((page) => page.handle === 'culinary-blog')

  return (
    <>
      <PageSEO seo={culinaryBlogPage.fields.seo} />
      <ContentSections sections={culinaryBlogPage.fields.content} />
    </>
  )
}

export async function getStaticProps({ previewData }) {
  try {
    const pages = await nacelleClient.content({
      handles: ['culinary-blog']
    })

    return {
      props: { pages }
    }
  } catch {
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
