import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const RecipeListings = ({ articles, blogSettings, page }) => { 
  return (
    <ListingsTemplate articles={articles} blogSettings={blogSettings} page={page} />
  )
}

export default RecipeListings

export async function getStaticProps({ params }) {
  const recipeArticles = await nacelleClient.content({
    type: 'recipeArticle'
  })

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  const pages  = await nacelleClient.content({
    handles: ['recipes'],
    type: 'blog'
  })

  if (!recipeArticles.length) {
    return {
      notFound: true
    }  
  }

  return {
    props: {
      articles: recipeArticles,
      blogSettings: blogSettings[0],
      page: pages[0]
    }
  }
}