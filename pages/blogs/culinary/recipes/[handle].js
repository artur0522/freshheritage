import ArticleHero from '@/components/Article/ArticleHero'
import ArticleNav from '@/components/Article/ArticleNav'
import ArticleMain from '@/components/Article/ArticleMain'
import { nacelleClient } from 'services'

const RecipeArticle = ({ page }) => {

  console.log("page:", page)

  const { hero } = page.fields
  const { content } = page.fields

  return (
    <>
      <ArticleHero fields={hero}  />
      <ArticleNav fields={content} />
      <ArticleMain fields={content} />
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
