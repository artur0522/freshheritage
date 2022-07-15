import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const CookingGuidesListings = ({ articles, blogSettings, blogSections}) => {
   return (
        <ListingsTemplate articles={articles} blogSettings={blogSettings} blogSections={blogSections} />
   )
}

export default CookingGuidesListings

export async function getStaticProps({ params }) {
    const articles = await nacelleClient.content({
      type: 'cookingGuideArticle'
    })
  
    const blogSettings = await nacelleClient.content({
      type: 'blogSettings'
    })
  
    const blogSections  = await nacelleClient.content({
      handles: ['cooking-guides'],
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