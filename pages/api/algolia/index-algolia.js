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
  *[
    _type in ['recipeArticle', 'standardArticle', 'videoArticle', 'culinaryContestArticle', 'liveCookingClassArticle']
  ] {
    "objectID": _id,
    _type,
    _rev,
    _createdAt,
    title,
  }
`
export default async function handler(res) {
    const documents = await sanity.fetch(QUERY)

    const index = algolia.initIndex('sandbox_articles')

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