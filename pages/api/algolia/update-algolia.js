import algoliasearch from 'algoliasearch'
import sanityClient from '@sanity/client'
import indexer, { flattenBlocks } from 'sanity-algolia'

const algolia = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
    process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY
)

const sanity = sanityClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2021-03-25',
    useCdn: false
})

const index = 'sandbox_articles'

export default function handler(req, res) {
  const sanityAlgolia = indexer(
    {
      article: {
        index: algolia.initIndex(index)
      }
    },
    (document) => {
      switch (document._type) {
        case 'standardArticle': {
          const articleContent =
            document.body && Array.isArray(document.body)
              ? flattenBlocks(document.body)
              : ''

          return {
            content: articleContent,
            title: document.title,
            blog: document.blog,
            "objectID": document._id,
          }
        }
        case 'recipeArticle': {
            const articleContent =
              document.body && Array.isArray(document.body)
                ? flattenBlocks(document.body)
                : ''
  
            return {
              content: articleContent,
              title: document.title,
              blog: document.blog,
              "objectID": document._id,
            }
        }
        case 'videoArticle': {
            const articleContent =
              document.body && Array.isArray(document.body)
                ? flattenBlocks(document.body)
                : ''
  
            return {
              content: articleContent,
              title: document.title,
              blog: document.blog,
              "objectID": document._id,
            }
        }
        case 'culinaryContestArticle': {
            const articleContent =
              document.body && Array.isArray(document.body)
                ? flattenBlocks(document.body)
                : ''
  
            return {
              content: articleContent,
              title: document.title,
              blog: document.blog,
              "objectID": document._id,
            }
        }
        case 'liveCookingClassArticle': {
            const articleContent =
              document.body && Array.isArray(document.body)
                ? flattenBlocks(document.body)
                : ''
            
            return {
              content: articleContent,
              title: document.title,
              blog: document.blog,
              "objectID": document._id,
            }
        }
        default: {
          throw new Error(`Unknown type: ${document.type}`)
        }
      }
    }
  )

  return sanityAlgolia
    .webhookSync(sanity, req.body)
    .then(() => res.status(200).send('ok'))
}