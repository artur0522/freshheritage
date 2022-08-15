import algoliasearch from 'algoliasearch'
import sanityClient from '@sanity/client'

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

const QUERY = `*[
    _type in ['recipeArticle']
  ] {
    _type,
    _rev,
    "objectID": _id,
    _createdAt,
  }`

export default async function handler(res) {
    const documents = await sanity.fetch(QUERY)

    const index = algolia.initIndex('sandbox_culinary')

    try {
        console.time(`Saving ${documents.length} documents to index:`)
        await index.saveObjects(documents)
        console.timeEnd(`Saving ${documents.length} documents to index:`)
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

// import algoliasearch from 'algoliasearch'
// import sanityClient from '@sanity/client'
// import indexer, { flattenBlocks } from 'sanity-algolia'

// const algolia = algoliasearch(
//   process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
//   process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY
// )
// const sanity = sanityClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   dataset: 'production',
//   apiVersion: '2021-03-25',
//   useCdn: false
// })

// const index = 'sandbox_culinary'

// export default function handler(req, res) {
//   const sanityAlgolia = indexer(
//     {
//       article: {
//         index: algolia.initIndex(index)
//       }
//     },
//     (document) => {
//       switch (document._type) {
//         case 'standardArticle': {
//           const articleContent =
//             document.body && Array.isArray(document.body)
//               ? flattenBlocks(document.body)
//               : ''

//           return {
//             title: document.title,
//             handle: document.handle,
//             blog: document.blog,
//             content: articleContent
//           }
//         }
//         default: {
//           throw new Error(`Unknown type: ${document.type}`)
//         }
//       }
//     }
//   )

//   const types = ['standardArticle']
//   const query =
//     '*[_type in $types] {_id, _type, body, title, handle, blog}'

//   sanity.fetch(query, { types }).then((docs) => {
//     return sanityAlgolia
//       .webhookSync(sanity, {
//         ids: {
//           created: docs.map((item) => item._id),
//           updated: [],
//           deleted: []
//         }
//       })
//       .then(() => {
//         res.status(200).send('ok')
//       })
//       .catch((err) => {
//         console.log(err.message)
//         res.status(200).send(docs)
//       })
//   })
// }




