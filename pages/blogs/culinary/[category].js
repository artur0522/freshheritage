import { useState, useEffect } from 'react'
import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'
import { getNacelleReferences } from '@/utils/getNacelleReferences'


async function getArticles(page, numOfEntries) {
  const { articleTypes } = page.fields

  let allArticles = await articleTypes.reduce(async (carry, type) => {
    let promises = await carry;
    const articles = await nacelleClient.content({
      type: type,
      entryDepth: 0,
      maxReturnedEntries: numOfEntries
    })

    if (articles) {
      const fullRefArticles = await getNacelleReferences(articles)
      return [...promises, ...fullRefArticles]
    }
  }, Promise.resolve([]))

  return allArticles
}

const RecipeListings = ({ blogSettings, page }) => {


  const [articles, setArticles] = useState([])
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false)

  if (page.fields.featuredClass) {
    page.fields.hero = page.fields.featuredClass.hero
  }

  useEffect(() => {
    getArticles(page, 20)
      .then((res) => {
        setArticles(res)
      })
  }, [])

  useEffect(() => {
    if (allArticlesLoaded) {
      return
    }
    setAllArticlesLoaded(true)
    getArticles(page)
      .then((res) => {
        setArticles(res)
      })
  }, [articles])

  console.log("articles:", articles)

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

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  return {
    props: {
      blogSettings: blogSettings[0],
      page: page,
      handle: page.handle
    }
  }
}