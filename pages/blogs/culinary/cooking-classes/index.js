import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const LiveCookingClassesListings = ({ articles, blogSettings, page}) => {
   return (
      <ListingsTemplate articles={articles} blogSettings={blogSettings} page={page} />
   )
}

export default LiveCookingClassesListings

export async function getStaticProps({ params }) {

    const videoArticles = await nacelleClient.content({
      type: 'videoArticle'
    })

    const liveCookingClassArticles = await nacelleClient.content({
      type: 'liveCookingClassArticle'
    })

    const allArticles = [...videoArticles, ...liveCookingClassArticles]

    const validArticles = allArticles.filter(article => article.fields.blog.handle === 'cooking-classes')

    const blogSettings = await nacelleClient.content({
      type: 'blogSettings'
    })

    const pages  = await nacelleClient.content({
      handles: ['cooking-classes'],
      type: 'blog'
    })

    if (!validArticles.length) {
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