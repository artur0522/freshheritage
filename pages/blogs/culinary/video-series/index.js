import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const VideoSeriesListings = ({ articles, blogSettings, page }) => {

  return (
    <ListingsTemplate articles={articles} blogSettings={blogSettings} page={page} />
  )
}

export default VideoSeriesListings

export async function getStaticProps({ params }) {
  const articles = await nacelleClient.content({
    type: 'videoArticle'
  })

  const validArticles = articles.filter(article => article.fields.blog.handle.current === 'video-series')

  const blogSettings = await nacelleClient.content({
    type: 'blogSettings'
  })

  const pages = await nacelleClient.content({
    handles: ['video-series'],
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
      page: pages[0]
    }
  }
}