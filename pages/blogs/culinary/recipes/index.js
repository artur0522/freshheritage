import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const RecipeListings = ({ articles, blogSettings, blogSections }) => {
  const { hero } = page.fields
  const blogType = page.fields.blogType
  const blogGlobalSettings = blogSettings ? blogSettings.fields[blogType] : undefined
  hero.header = page.title
  hero.subheader = page.fields.subheader
  
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