import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const CookingClassesListings = ({ articles, blogSettings, page}) => {
   return (
        <ListingsTemplate articles={articles} blogSettings={blogSettings} page={page} />
   )
}

export default CookingClassesListings

export async function getStaticProps({ params }) {
    const articles = await nacelleClient.content({
      type: 'videoArticle'
    })

    const validArticles = articles.filter(article => article.fields.blog.handle.current === 'cooking-classes')

    const blogSettings = await nacelleClient.content({
      type: 'blogSettings'
    })
  
    const pages  = await nacelleClient.content({
      handles: ['cooking-classes'],
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