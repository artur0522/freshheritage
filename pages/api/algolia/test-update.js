// import sanityClient from '@sanity/client'
// import algoliasearch from 'algoliasearch'
// import indexer from 'sanity-algolia'

// const sanity = sanityClient({
//     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//     dataset: 'production',
//     apiVersion: '2021-03-25',
//     useCdn: false
// })

// const algolia = algoliasearch(
//     process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
//     process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY
// )

// const ARTICLE_PROJECTION = `
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
// export default async function RequestHandler(request) {
//   const index = algolia.initIndex('sandbox_articles')
//   const sanityAlgolia = indexer(
//     {
//       article: {
//         index,
//         projection: ARTICLE_PROJECTION,
//       }
//     },
    
//     (document) => document,
//     (document) => !['unapproved'].includes(document.status),
//   )

//   return sanityAlgolia
//     .webhookSync(sanity, request.body)
//     .then(() => ({
//       status: 200,
//       body: 'Success!',
//     }))
//     .catch(() => ({
//       status: 500,
//       body: 'Something went wrong',
//     }))
// }

// import algoliasearch from 'algoliasearch'
// import sanityClient from '@sanity/client'
// import indexer, { flattenBlocks } from 'sanity-algolia'

// const algolia = algoliasearch(
//     process.env.NEXT_PUBLIC_ALGOLIA_APPLICATION_ID,
//     process.env.NEXT_PUBLIC_ALGOLIA_WRITE_API_KEY
// )
// const sanity = sanityClient({
//     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
//     dataset: 'production',
//     apiVersion: '2021-03-25',
//     useCdn: false
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
//           }
//         }
//         case 'standardArticle': {
//             return {
//               title: document.title,
//               handle: document.handle,
//               blog: document.blog,
//             }
//           }
//           case 'videoArticle': {
//             return {
//               title: document.title,
//               handle: document.handle,
//               blog: document.blog,
//             }
//           }
//           case 'culinaryContestArticle': {
//             return {
//               title: document.title,
//               handle: document.handle,
//               blog: document.blog,
//             }
//           }
//           case 'liveCookingClassArticle': {
//             return {
//               title: document.title,
//               handle: document.handle,
//               blog: document.blog,
//             }
//           }
//         default: {
//           throw new Error(`Unknown type: ${document.type}`)
//         }
//       }
//     }
//   )

//   return sanityAlgolia
//     .webhookSync(sanity, req.body)
//     .then(() => res.status(200).send('ok'))
// }