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
      <ArticleSplitHero fields={hero} renderType="default" blogType={blogType} blogSettings={blogSettings} />
      <ArticleMain contentType="standard" fields={page.fields} product={product} />
      <ContentSections sections={page.fields.pageContent} />
    </>
  )
}

export default RecipeArticle

export async function getStaticPaths() {
  const videoArticles = await nacelleClient.content({
    type: 'videoArticle'
  })

  const validArticles = videoArticles.filter(article => article.fields.blog.handle === 'cooking-class')

  const handles = validArticles.map((article) => ({ params: { handle: article.handle } }))

  return {
    paths: handles,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {

  const pages = await nacelleClient.content({
    handles: [params.handle],
    type: 'videoArticle'
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
