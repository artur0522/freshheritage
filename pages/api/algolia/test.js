// import algoliasearch from 'algoliasearch'
// import sanityClient from '@sanity/client'

// export const algolia = algoliasearch(
//   process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
//   process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY
// )

// export const sanity = sanityClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   dataset: 'production',
//   apiVersion: '2021-03-25',
//   useCdn: false
// })

// const QUERY = `
//   *[
//     _type in ['recipeArticle', 'standardArticle', 'videoArticle', 'culinaryContestArticle', 'liveCookingClassArticle']
//   ] {
//     "objectID": _id,
//     _type,
//     _rev,
//     _createdAt,
//     title,
//   }
// `
// export default async function handler(res) {
//     const documents = await sanity.fetch(QUERY)

//     const index = algolia.initIndex('sandbox_articles')

//     try {
//         console.time(`Saving ${documents.length} documents to index:`)
//         await index.saveObjects(documents)
//         console.timeEnd(`Saving ${documents.length} documents to index:`)
//         return {
//           status: 200,
//           body: 'Success!',
//         }
//     } catch (error) {
//       console.error(error)
//       return {
//         status: 500,
//         body: error,
//       }
//     }
// }




// import algoliasearch from 'algoliasearch'
// import sanityClient from '@sanity/client'
// import indexer, { flattenBlocks } from 'sanity-algolia';

// export const algolia = algoliasearch(
//   process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
//   process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY
// )

// export const sanity = sanityClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//   dataset: 'production',
//   apiVersion: '2021-03-25',
//   useCdn: false
// })

// const index = 'sandbox_articles'

// export default async function handler(req, res) {
//   const sanityAlgolia = indexer(
//     {
//       article: {
//         index: algolia.initIndex(index)
//       }
//     },
//     (document) => {
//       switch (document._type) {
//         case 'recipeArticle': {
//           return {
//             title: document.title,
//             handle: document.handle,
//             blog: document.blog,
//             "objectID": document._id,
//           }
//         }
//         case 'standardArticle': {
//             return {
//               title: document.title,
//               handle: document.handle,
//               blog: document.blog,
//               "objectID": document._id,
//             }
//           }
//           case 'videoArticle': {
//             return {
//               title: document.title,
//               handle: document.handle,
//               blog: document.blog,
//               "objectID": document._id,
//             }
//           }
//           case 'culinaryContestArticle': {
//             return {
//               title: document.title,
//               handle: document.handle,
//               blog: document.blog,
//               "objectID": document._id,
//             }
//           }
//           case 'liveCookingClassArticle': {
//             return {
//               title: document.title,
//               handle: document.handle,
//               blog: document.blog,
//               "objectID": document._id,
//             }
//           }
//         default:
//           throw new Error(`Unknown type: ${document.type}`);
//       }
//     }
//   )

//   const types =  ['recipeArticle', 'standardArticle', 'videoArticle', 'culinaryContestArticle', 'liveCookingClassArticle']
//   const query = `
//   *[
//     _type in ['recipeArticle', 'standardArticle', 'videoArticle', 'culinaryContestArticle', 'liveCookingClassArticle']
//   ] {
//     _type,
//     _rev,
//     "objectID": _id,
//     _createdAt,
//     title,
//   }
// `
// sanity.fetch(query, { types }).then((docs) => {
//     return sanityAlgolia
//       .webhookSync(sanity, {
//         ids: {
//           created: docs.map((item) => item._id),
//           updated: [],
//           deleted: []
//         }
//       })
//       .then(() => res.status(200).send('ok'))
//       .catch((err) => {
//         console.log(err.message)
//         res.status(200).send(docs)
//       })
//   })
// }




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

// const index = 'sanity_articles'

// export default function handler(req, res) {
//   const sanityAlgolia = indexer(
//     {
//       article: {
//         index: algolia.initIndex(index)
//       }
//     },
//     (document) => {
//       switch (document._type) {
//          case 'standardArticle': {
//           const articleContent =
//             document.body && Array.isArray(document.body)
//               ? flattenBlocks(document.body)
//               : ''

//           return {
//             content: articleContent,
//             title: document.title,
//             blog: document.blog,
//             "objectID": document._id,
//           }
//         }
//         case 'recipeArticle': {
//             const articleContent =
//               document.body && Array.isArray(document.body)
//                 ? flattenBlocks(document.body)
//                 : ''
  
//             return {
//               content: articleContent,
//               title: document.title,
//               blog: document.blog,
//               "objectID": document._id,
//             }
//         }
//         case 'videoArticle': {
//             const articleContent =
//               document.body && Array.isArray(document.body)
//                 ? flattenBlocks(document.body)
//                 : ''
  
//             return {
//               content: articleContent,
//               title: document.title,
//               blog: document.blog,
//               "objectID": document._id,
//             }
//         }
//         case 'culinaryContestArticle': {
//             const articleContent =
//               document.body && Array.isArray(document.body)
//                 ? flattenBlocks(document.body)
//                 : ''
  
//             return {
//               content: articleContent,
//               title: document.title,
//               blog: document.blog,
//               "objectID": document._id,
//             }
//         }
//         case 'liveCookingClassArticle': {
//             const articleContent =
//               document.body && Array.isArray(document.body)
//                 ? flattenBlocks(document.body)
//                 : ''
            
//             return {
//               content: articleContent,
//               title: document.title,
//               blog: document.blog,
//               "objectID": document._id,
//             }
//         }
//         default: {
//           throw new Error(`Unknown type: ${document.type}`)
//         }
//       }
//     }
//   )

//   const types = ['standardArticle']
//   const query =
//     '*[_type in $types] {_id, _type, content, title, handle, blog}'

//   sanity.fetch(query, { types }).then((docs) => {
//     return sanityAlgolia
//       .webhookSync(sanity, {
//         ids: {
//           created: docs.map((item) => item._id),
//           updated: [],
//           deleted: []
//         }
//       })
//       .then(() => res.status(200).send('ok'))
//       .catch((err) => {
//         console.log(err.message)
//         res.status(200).send(docs)
//       })
//   })
// }