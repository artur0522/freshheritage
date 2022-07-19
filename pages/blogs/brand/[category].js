import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const BrandBlogListings = ({ articles, blogSettings, page }) => {

  console.log("articles:", articles)


  return (
    <ListingsTemplate articles={articles} blogSettings={blogSettings} page={page} />
  )
}

export default BrandBlogListings

export async function getStaticPaths() {
    const blogs = await nacelleClient.content({
      type: 'blogs'
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
    type: 'standardArticle'
  })

  const validArticles = articles.filter(article => article.fields.blog.handle.current === params.category)

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  const pages  = await nacelleClient.content({
    handles: [params.category],
    type: 'blog'
  })

  if (!articles.length) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      articles: validArticles,
      blogSettings: blogSettings[0],
      page: pages[0],
      handle: pages[0].handle
    }
  }
}