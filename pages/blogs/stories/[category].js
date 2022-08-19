import { useState, useEffect } from 'react'
import { nacelleClient } from 'services'
import { getNacelleReferences } from '@/utils/getNacelleReferences'
import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

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

const BrandBlogListings = ({ blogSettings, page, category }) => {

  const [articles, setArticles] = useState([])
  const [allArticlesLoaded, setAllArticlesLoaded] = useState(false)

  useEffect(() => {
    getArticles(page, 20)
      .then((res) => {
        const validArticles = res.filter(article => article.fields.blog.handle.current === category)
        setArticles([...validArticles])
      })
  }, [])

  useEffect(() => {
    if (allArticlesLoaded) {
      return
    }
    setAllArticlesLoaded(true)
    getArticles(page)
      .then((res) => {
        const validArticles = res.filter(article => article.fields.blog.handle.current === category)
        setArticles([...validArticles])
      })
  }, [articles])

  return (
    <ListingsTemplate articles={articles} blogSettings={blogSettings} page={page} />
  )
}

export default BrandBlogListings

export async function getStaticPaths() {
    const blogs = await nacelleClient.content({
      type: 'blogs',
      entryDepth: 1
    })

    const validBlogs = blogs.filter(blog => blog.fields.blogType === 'brand')

    const handles = validBlogs.map((article) => ({ params: { category: article.handle } }))

    return {
      paths: handles,
      fallback: 'blocking'
    }
  }

export async function getStaticProps({ params }) {

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  const pages = await nacelleClient.content({
    handles: [params.category],
    type: 'blog',
    entryDepth: 1
  })

  if (!pages.length) {
    return {
      notFound: true
    }
  }

  const fullRefPage = await getNacelleReferences(pages[0])

  return {
    props: {
      blogSettings: blogSettings[0],
      page: fullRefPage,
      category: params.category,
      handle: fullRefPage.handle
    }
  }
}