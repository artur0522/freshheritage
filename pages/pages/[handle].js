import PageSEO from '@/components/SEO/PageSEO'
import { nacelleClient } from 'services'
import ContentSections from '@/components/Sections/ContentSections'
import classes from './Page.module.scss'

export default function DynamicPage({ page }) {
  console.log("page:", page)
  if (page.type === 'infoPage') {
    const { header, leftContent , rightContent } = page.fields
    return (
      <div className={`${classes['info-page']} info-page container`}>
        <div className={classes['info-page__left']}>
          <h1>{header}</h1>
          {leftContent &&
            <ContentSections sections={leftContent} />
          }
        </div>
        <div className={classes['info-page__right']}>
          {rightContent &&
            <ContentSections sections={rightContent} />
          }
        </div>
      </div>
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
    handles: ['page']
  })

  const infoPages = await nacelleClient.content({
    handles: ['page']
  })

  const handles = [...basicPages, ...infoPages].map((page) => ({ params: { handle: page.handle } }))

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
