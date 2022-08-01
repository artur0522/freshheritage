import { useState, useEffect } from 'react'
import { nacelleClient } from 'services'
import { getNacelleReferences } from '@/utils/getNacelleReferences'
import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const BrandBlogListings = ({ articles: initialArticles, blogSettings, page }) => {

  const [articles, setArticles] = useState(initialArticles)

  useEffect(() => {
    const getArticles = async () => {
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

      return allArticles
    }

    getArticles()
      .then((res) => {
        setArticles(res)
      })
  }, [])

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

  const articles = await nacelleClient.content({
    type: 'standardArticle',
    entryDepth: 1,
    maxReturnedEntries: 20
  })

  const validArticles = articles.filter(article => article.fields.blog.handle.current === params.category)

  const fullValidArticles = await getNacelleReferences(validArticles)

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  const pages = await nacelleClient.content({
    handles: [params.category],
    type: 'blog',
    entryDepth: 1
  })

  const fullRefPage = await getNacelleReferences(pages[0])

  if (!articles.length) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      articles: fullValidArticles,
      blogSettings: blogSettings[0],
      page: fullRefPage,
      handle: fullRefPage.handle
    }
  }
}