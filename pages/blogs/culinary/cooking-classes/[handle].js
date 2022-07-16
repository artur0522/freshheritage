import { useEffect } from 'react'
import ArticleSplitHero from '@/components/Article/ArticleSplitHero'
import ArticleMain from '@/components/Article/ArticleMain'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'
import { useModalContext } from '@/context/ModalContext'
import ContentSections from '@/components/Sections/ContentSections'
import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'

const CookingClassArticle = ({ page, product, blogSettings }) => {

  // console.log("page:", page)
  // console.log("blogSettings:", blogSettings)

  const { setContent } = useModalContext()

  const { hero } = page.fields
  const blogType = page.fields.blog?.blogType
  const blogGlobalSettings = blogSettings ? blogSettings.fields[blogType] : undefined
  hero.classStartDate = page.fields?.classStartDate
  hero.classEndDate = page.fields?.classEndDate

  hero.header = page.title
  hero.subheader = page.fields.subheader

  if (page.fields?.sidebar?.classSignup && page.fields.klaviyoListId) {
    page.fields.sidebar.classSignup.klaviyoListId = page.fields.klaviyoListId
  }

  useEffect(() => {
    setContent({
      header: page.title,
      classStartDate: page.fields.classStartDate,
      classEndDate: page.fields.classEndDate,
      listId: page.fields.klaviyoListId
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <StructuredData type="article" data={page} />
      <StructuredData type="video" data={page} />
      <PageSEO seo={page.fields.seo} />
      <ArticleSplitHero fields={hero} renderType="cooking-class" blogGlobalSettings={blogGlobalSettings} />
      <ArticleMain contentType="standard" fields={page.fields} product={product} blogGlobalSettings={blogGlobalSettings} />
      <ContentSections sections={page.fields.pageContent} />
    </>
  )
}

export default CookingClassArticle

export async function getStaticPaths() {
  const videoArticles = await nacelleClient.content({
    type: 'videoArticle'
  })

  const liveCookingClassArticles = await nacelleClient.content({
    type: 'liveCookingClassArticle'
  })

  const allArticles = [...videoArticles, ...liveCookingClassArticles]

  const validArticles = allArticles.filter(article => article.fields.blog.handle === 'cooking-classes')

  const handles = validArticles.map((article) => ({ params: { handle: article.handle } }))

  return {
    paths: handles,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {


  let pages = await nacelleClient.content({
    handles: [params.handle],
    type: 'videoArticle'
  })

  if (!pages.length) {
    pages = await nacelleClient.content({
      handles: [params.handle],
      type: 'liveCookingClassArticle'
    })
  }

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  const page = pages[0]

  const props = {
    page,
    blogSettings: blogSettings[0],
    product: null
  }

  if (page.fields?.content) {
    const handles = page.fields.content.filter(item => item._type === 'productBlock').map(item => item.product)
    let { products } = await nacelleClient.query({
      query: GET_PRODUCTS,
      variables: {
        "filter": {
          "handles": [...handles]
        }
      }
    })
    if (products) {
      props.product = products[0]
    }
  }

  return {
    props
  }
}
