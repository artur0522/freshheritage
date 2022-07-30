import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'
import { getNacelleReferences } from '@/utils/getNacelleReferences'

const RecipeListings = ({ articles, blogSettings, page }) => {

  console.log("articles:", articles)

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
    entryDepth: 1
  })

  const cookingClassCategoryBlogs = await nacelleClient.content({
    handles: ['cooking-classes'],
    type: 'cookingClassCategory',
    entryDepth: 1
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
    type: 'blog',
    entryDepth: 1
  })

  const cookingClassCategoryBlogs = await nacelleClient.content({
    handles: ['cooking-classes'],
    type: 'cookingClassCategory',
    entryDepth: 1
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
      type: type,
      entryDepth: 0
    })
    if (articles) {
      const fullRefArticles = await getNacelleReferences(articles)
      return [...promises, ...fullRefArticles]
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