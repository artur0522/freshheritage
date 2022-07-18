import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const RecipeListings = ({ articles, blogSettings, page }) => {
  return (
    <ListingsTemplate articles={articles} blogSettings={blogSettings} page={page} />
  )
}

export default RecipeListings

export async function getStaticPaths() {
  const blogs = await nacelleClient.content({
    handles: ['blogs']
  })

  const handles = blogs.map((blogs) => ({ params: { handle: blogs.handle } }))

  return {
    paths: handles,
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }) {

  const pages = await nacelleClient.content({
    handles: [params.category],
    type: 'blog'
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
      page: pages[0]
    }
  }
}