import React from 'react'

import { nacelleClient } from 'services'
import ContentSections from '../components/ContentSections'

export default function HowItWorks({ pages }) {
  const howItWorksPage = pages.find((page) => page.handle === 'how-it-works')

  return (
    <>
      <ContentSections sections={howItWorksPage.fields.content} />
    </>
  )
}

export async function getStaticProps({ previewData }) {
  try {
    const pages = await nacelleClient.content({
      handles: ['how-it-works']
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
