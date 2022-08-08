import React, { useState, useEffect } from 'react'
import Script from 'next/script'
import PageSEO from '@/components/SEO/PageSEO'
import { nacelleClient } from 'services'
import ContentSections from '@/components/Sections/ContentSections'
import classes from './Page.module.scss'
import { useMediaQuery } from 'react-responsive'
import ResponsiveImage from '@/components/ResponsiveImage'
import { getNacelleReferences } from '@/utils/getNacelleReferences'

export default function DynamicPage({ page }) {
  console.log("page:", page)

  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery(
    {query: '(min-width: 1074px)'}
  )

  useEffect(() => {
    setMounted(true)
    // document.createElement("script");script.type="text/javascript",script.id="ze-snippet",script.src="https://static.zdassets.com/ekr/snippet.js?key=7926bf41-0910-4145-b2f7-44517d2707b0",document.getElementsByTagName("head")[0].appendChild(script)
   
    // <script type="text/javascript">
    //   window.zESettings = {
    //       analytics: false
    //   };
    // </script>
  }, [])

  if (page.type === 'infoPage') {
    const { header, leftContent , rightContent, bottomContent, desktopIllustration, mobileIllustration } = page.fields
    return (
      <>
        <div className={`${classes['info-page']} info-page container`}>
          <PageSEO seo={page.seo} />
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
        <Script type="text/javascript" id="ze-snippet" src="https://static.zdassets.com/ekr/snippet.js?key=7926bf41-0910-4145-b2f7-44517d2707b0" strategy="lazyOnload" />
      </>
    )
  }

  return (
    <>
      <PageSEO seo={page.seo} />
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
    entryDepth: 1
  })

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  const fullRefPage = await getNacelleReferences(pages[0])

  return {
    props: {
      page: fullRefPage
    }
  }

}
