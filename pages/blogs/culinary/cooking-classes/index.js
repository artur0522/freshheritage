import { nacelleClient } from 'services'

import ListingsTemplate from '@/components/Blog/BlogListings/ListingsTemplate'

const CookingClassesListings = ({ articles, blogSettings, blogSections}) => {
   return (
        <ListingsTemplate articles={articles} blogSettings={blogSettings} blogSections={blogSections} />
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
  
    const blogSections  = await nacelleClient.content({
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
        blogSections: blogSections
      }
    }
  }