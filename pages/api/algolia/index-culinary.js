import algoliasearch from 'algoliasearch'
import sanityClient from '@sanity/client'

export const algolia = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
  process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY
)

export const sanity = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2021-03-25',
  useCdn: false
})

const QUERY = `
*[_type == "standardArticle" && blog._ref in *[_type=="blog" && blogType == "culinary"]._id || 
_type == "recipeArticle" && blog._ref in *[_type=="blog" && blogType == "culinary"]._id ||
_type == "videoArticle" && blog._ref in *[_type=="blog" && blogType == "culinary"]._id ||
_type == "liveCookingClassArticle" && blog._ref in *[_type=="blog" && blogType == "culinary"]._id]
{
    _type,
    _rev,
    handle,
    "objectID": _id,
    _createdAt,
    title,
    "blog": blog->{title, blogType, handle},
    articleTags,
    hero {
       desktopBackgroundImage {
         crop,
         hotspot {
           x,
           y,
         },
         asset->{url}
       },
       activeTime,
       cookTime,
       totalTime,
       ctaText,
       ctaUrl
    }
}
`
export default async function handler(res) {
    const documents = await sanity.fetch(QUERY)

    const index = algolia.initIndex('culinary_articles')

    try {
        console.log(`Saving ${documents.length} documents to index:`)
        await index.saveObjects(documents)
        return {
          status: 200,
          body: 'Success!',
        }
    } catch (error) {
      console.error(error)
      return {
        status: 500,
        body: error,
      }
    }
}