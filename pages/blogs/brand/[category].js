import { nacelleClient } from 'services'
import { getNacelleReferences } from '@/utils/getNacelleReferences'
import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const BrandBlogListings = ({ articles, blogSettings, page }) => {
  return (
    <ListingsTemplate articles={articles} blogSettings={blogSettings} page={page} />
  )
}

export default BrandBlogListings

export async function getStaticPaths() {
    const blogs = await nacelleClient.content({
      type: 'blogs',
      entryDepth: 2
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
    entryDepth: 2
  })

  const validArticles = articles.filter(article => article.fields.blog.handle.current === params.category)

  const fullValidArticles = await getNacelleReferences(validArticles)

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  const pages = await nacelleClient.content({
    handles: [params.category],
    type: 'blog',
    entryDepth: 2
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