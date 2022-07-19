import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const RecipeListings = ({ articles, blogSettings, page }) => {

  if (page.fields.featuredClass) {
    page.fields.hero = page.fields.featuredClass.hero
  }

  return (
    <ListingsTemplate articles={articles} blogSettings={blogSettings} page={page} />
  )
}

export default RecipeListings

export async function getStaticProps() {

  const pages = await nacelleClient.content({
    handles: ['cooking-classes'],
    type: 'cookingClassCategory'
  })

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  const { articleTypes } = pages[0].fields

  const articles = await nacelleClient.content({
    type: articleTypes[0]
  })

  if (!articles.length) {
    return {
      notFound: true
    }
  }

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })



  return {
    props: {
      articles: articles,
      blogSettings: blogSettings[0],
      page: pages[0],
      handle: pages[0].handle
    }
  }
}