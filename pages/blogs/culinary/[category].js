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

export async function getStaticPaths() {
  const blogs = await nacelleClient.content({
    type: 'blogs',
    entryDepth: 2
  })

  const cookingClassCategoryBlogs = await nacelleClient.content({
    handles: ['cooking-classes'],
    type: 'cookingClassCategory',
    entryDepth: 2
  })

  const validBlogs = [...blogs, ...cookingClassCategoryBlogs].filter(blog => blog.fields.blogType === 'culinary')

  const handles = validBlogs.map((blogs) => ({ params: { category: blogs.handle } }))

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

  const cookingClassCategoryBlogs = await nacelleClient.content({
    handles: ['cooking-classes'],
    type: 'cookingClassCategory'
  })


  if (!pages.length && !cookingClassCategoryBlogs.length) {
    return {
      notFound: true
    }
  }

  const page = pages.length ? pages[0] : cookingClassCategoryBlogs[0]

  const { articleTypes } = page.fields

  let allArticles = await articleTypes.reduce(async (carry, type) => {
    let promises = await carry;
    const articles = await nacelleClient.content({
      type: type
    })
    if (articles) {
      return [...promises, ...articles]
    }
  }, Promise.resolve([]))

  if (!allArticles.length) {
    return {
      notFound: true
    }
  }

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  return {
    props: {
      articles: allArticles,
      blogSettings: blogSettings[0],
      page: page,
      handle: page.handle
    }
  }
}