import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const RecipeListings = ({ articles, blogSettings, blogSections }) => { 
  return (
    <ListingsTemplate articles={articles} blogSettings={blogSettings} blogSections={blogSections} />
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

  const blogSections  = await nacelleClient.content({
    handles: ['recipe-listings'],
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
      blogSections: blogSections
    }
  }
}