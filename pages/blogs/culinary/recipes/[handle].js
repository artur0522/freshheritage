import ArticleSplitHero from '@/components/Article/ArticleSplitHero'
import ArticleMain from '@/components/Article/ArticleMain'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'
import ContentSections from '@/components/Sections/ContentSections'
import PageSEO from '@/components/SEO/PageSEO'
import StructuredData from '@/components/SEO/StructuredData'

const RecipeArticle = ({ page, product, blogSettings }) => {

  // console.log("page:", page)
  // console.log("blogSettings:", blogSettings)

  const { hero } = page.fields
  hero.tags = page.fields.articleTags
  const blogType = page.fields.blog?.blogType
  const blogGlobalSettings = blogSettings ? blogSettings.fields[blogType] : undefined
  hero.header = page.title
  hero.subheader = page.subheader

  return (
    <>
      <StructuredData type="article" data={page} />
      <StructuredData type="recipe" data={page} />
      <PageSEO seo={page.fields.seo} />
      <ArticleSplitHero fields={hero} renderType="recipe" blogGlobalSettings={blogGlobalSettings} />
      <ArticleMain contentType="recipe" showNav={true} fields={page.fields} product={product} blogGlobalSettings={blogGlobalSettings} />
      <ContentSections sections={page.fields.pageContent} />
    </>
  )
}

export default RecipeArticle

export async function getStaticPaths() {
  const recipeArticles = await nacelleClient.content({
    type: 'recipeArticle'
  })

  const handles = recipeArticles.map((article) => ({ params: { handle: article.handle } }))

  return {
    paths: handles,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {

  const pages = await nacelleClient.content({
    handles: [params.handle],
    type: 'recipeArticle'
  })

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
