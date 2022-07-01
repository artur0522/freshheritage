import ArticleSplitHero from '@/components/Article/ArticleSplitHero'
import ArticleMain from '@/components/Article/ArticleMain'
import { nacelleClient } from 'services'
import { GET_PRODUCTS } from '@/gql/index.js'
import ContentSections from '@/components/ContentSections'

const RecipeArticle = ({ page, product, blogSettings }) => {

  console.log("page:", page)
  console.log("blogSettings:", blogSettings)

  const { hero } = page.fields
  const blogType = page.fields.blog?.blogType

  return (
    <>
      <ArticleSplitHero fields={hero} renderType="recipe" blogType={blogType} blogSettings={blogSettings} />
      <ArticleMain fields={page.fields} product={product} />
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

  if (page.fields?.content?.addToCartProduct) {
    const handle = page.fields.content.addToCartProduct
    let { products } = await nacelleClient.query({
      query: GET_PRODUCTS,
      variables: {
        "filter": {
          "handles": [handle]
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
