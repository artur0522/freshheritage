import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const LiveCookingClassesListings = ({ articles, blogSettings, blogSections}) => {
   return (
        <ListingsTemplate articles={articles} blogSettings={blogSettings} blogSections={blogSections} />
   )
}

export default LiveCookingClassesListings

export async function getStaticProps({ params }) {
    const articles = await nacelleClient.content({
      type: 'liveCookingClassArticle'
    })
  
    const blogSettings = await nacelleClient.content({
      type: 'blogSettings'
    })
  
    const blogSections  = await nacelleClient.content({
      handles: ['live-cooking-classes'],
      type: 'blog'
    })
  
    if (!articles.length) {
      return {
        notFound: true
      }  
    }
  
    return {
      props: {
        articles: articles,
        blogSettings: blogSettings[0],
        blogSections: blogSections
      }
    }
  }