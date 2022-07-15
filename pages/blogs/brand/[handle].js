import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const BrandBlogListings = ({ articles, blogSettings, blogSections }) => {
  return (
    <ListingsTemplate articles={articles} blogSettings={blogSettings} blogSections={blogSections} />
  )
}

export default BrandBlogListings

export async function getStaticPaths() {
    const blogs = await nacelleClient.content({
      type: 'blogs'
    })
  
    const validBlogs = blogs.filter(blog => blog.fields.blogType === 'brand')
  
    const handles = validBlogs.map((article) => ({ params: { handle: article.handle } }))
  
    return {
      paths: handles,
      fallback: 'blocking'
    }
  }

export async function getStaticProps({ params }) {
  const articles = await nacelleClient.content({
    type: 'standardArticle'
  })

  const validArticles = articles.filter(article => article.fields.blog.handle.current === params.handle)

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  const blogSections  = await nacelleClient.content({
    handles: [params.handle],
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
      blogSections: blogSections
    }
  }
}