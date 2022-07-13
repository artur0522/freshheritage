import React from 'react'

import { nacelleClient } from 'services'
import ContentSections from '@/components/Sections/ContentSections'

export default function DynamicPage({ page }) {
  return (
    <>
      <ContentSections sections={page.fields.content} />
    </>
  )
}

export async function getStaticPaths() {
  const pages = await nacelleClient.content({
    handles: ['page']
  })

  const handles = pages.map((page) => ({ params: { handle: page.handle } }))

  return {
    paths: handles,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {

  const pages = await nacelleClient.content({
    handles: [params.handle]
  })

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      page: pages[0]
    }
  }

}
