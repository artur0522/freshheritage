import React, { useState, useEffect } from 'react'
import PageSEO from '@/components/SEO/PageSEO'
import { nacelleClient } from 'services'
import ContentSections from '@/components/Sections/ContentSections'
import classes from './Page.module.scss'
import { useMediaQuery } from 'react-responsive'
import ResponsiveImage from '@/components/ResponsiveImage'
import { getNacelleReferences } from '@/utils/getNacelleReferences'
import { getRecentArticles } from '@/utils/getRecentArticles'

export default function DynamicPage({ page }) {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )

  console.log("page:", page)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (page.type === 'infoPage') {
    const { header, leftContent , rightContent, bottomContent, desktopIllustration, mobileIllustration } = page.fields
    return (
      <>
        <div className={`${classes['info-page']} info-page container`}>
          <PageSEO seo={page.fields.seo} />
          <div className={classes['info-page__left']}>
            <h1 className={classes['info-page__header']}>{header}</h1>
            {leftContent &&
              <ContentSections sections={leftContent} />
            }
            {desktopIllustration && isDesktop && mounted &&
              <div className={classes['info-page__illustration-image']}>
                <ResponsiveImage
                  src={desktopIllustration.asset.url}
                  layout="fill"
                  alt={desktopIllustration.asset.alt || ''}
                />
              </div>
            }
            {mobileIllustration && isMobile && mounted &&
              <div className={classes['info-page__illustration-image']}>
                <ResponsiveImage
                  src={mobileIllustration.asset.url}
                  layout="fill"
                  alt={mobileIllustration.asset.alt || ''}
                />
              </div>
            }
          </div>
          <div className={classes['info-page__right']}>
            {rightContent &&
              <ContentSections sections={rightContent} />
            }
          </div>
        </div>
        {bottomContent &&
          <ContentSections sections={bottomContent} />
        }
      </>
    )
  }

  return (
    <>
      <PageSEO seo={page.fields.seo} />
      <ContentSections sections={page.fields.content} />
    </>
  )
}

export async function getStaticPaths() {
  const basicPages = await nacelleClient.content({
    type: 'page',
    entryDepth: 0,
  })

  const infoPages = await nacelleClient.content({
    type: 'infoPage',
    entryDepth: 0
  })

  const handles = [...basicPages, ...infoPages].map((page) => ({ params: { handle: page.handle } }))

  return {
    paths: handles,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {

  const pages = await nacelleClient.content({
    handles: [params.handle],
    type: 'page',
    entryDepth: 1
  })

  const infoPages = await nacelleClient.content({
    handles: [params.handle],
    type: 'infoPage',
    entryDepth: 1
  })

  if (!pages.length && !infoPages.length) {
    return {
      notFound: true
    }
  }

  const page = pages.length ? pages[0] : infoPages[0]

  const fullRefPage = await getNacelleReferences(page)

  if (fullRefPage?.fields?.content?.some(content => content._type === 'featuredBlogContent')) {
    await getRecentArticles(fullRefPage)
  }

  return {
    props: {
      page: fullRefPage,
      handle: params.handle
    }
  }

}
