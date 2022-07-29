import ArticleSplitHero from '@/components/Article/ArticleSplitHero'
import ArticleMain from '@/components/Article/ArticleMain'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'
import ContentSections from '@/components/Sections/ContentSections'
import StructuredData from '@/components/SEO/StructuredData'
import PageSEO from '@/components/SEO/PageSEO'
import { getNacelleReferences } from '@/utils/getNacelleReferences'

const BrandArticle = ({ page, product, blogSettings }) => {
  const { hero } = page.fields
  const blogType = page.fields.blog?.blogType
  const blogGlobalSettings = blogSettings ? { ...blogSettings.fields[blogType], blogType} : undefined
  hero.header = page.title
  hero.subheader = page.fields.subheader

  return (
    <>
      <StructuredData type="article" data={page} />
      <PageSEO seo={page.fields.seo} />
      <ArticleSplitHero fields={hero} renderType="default" blogGlobalSettings={blogGlobalSettings} />
      <ArticleMain contentType="standard" fields={page.fields} product={product} blogGlobalSettings={blogGlobalSettings} />
      <ContentSections sections={page.fields.pageContent} />
    </>
  )
}

export default BrandArticle

export async function getStaticPaths() {

  const standardArticles = await nacelleClient.content({
    type: 'standardArticle',
    entryDepth: 2
  })

  const validArticles = standardArticles.reduce((carry, article) => {
    // only get brand categories
    const blogType = article.fields.blog.blogType
    if (blogType === 'brand') {
      return [...carry, {
        category: article.fields.blog.handle.current,
        handle: article.handle
      }]
    }
    return carry
  }, [])

  const handles = validArticles.map((article) => {
    return {
      params: {
        handle: article.handle,
        category: article.category
      }
    }
  })

  return {
    paths: handles,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {

  const pages = await nacelleClient.content({
    handles: [params.handle],
    type: 'standardArticle',
    entryDepth: 2
  })

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  const fullRefPage = await getNacelleReferences(pages[0])

  const props = {
    page: fullRefPage,
    handle: fullRefPage.handle,
    blogSettings: blogSettings[0],
    product: null
  }

  if (fullRefPage.fields?.content) {
    const handles = fullRefPage.fields.content.filter(item => item._type === 'productBlock').map(item => item.product)
    if (handles.length) {
      let data = await nacelleClient.query({
        query: GET_PRODUCTS,
        variables: {
          "filter": {
            "handles": [...handles]
          }
        }
      })
      if (data.products && data.products.length) {
        const products = data.products
        props.product = products[0]
      }
    }
  }

  return {
    props
  }
}
