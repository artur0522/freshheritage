import { nacelleClient } from 'services'
import { GET_RECENT_ARTICLES } from '@/gql/index.js'
import moment from 'moment'

export const getRecentArticles = async (contentSection) => {
  let featuredBlogContents = contentSection.filter(content => content._type === 'featuredBlogContent')
  featuredBlogContents = await featuredBlogContents.reduce(async (carry, pageSection) => {
    let promises = await carry
    if (!pageSection.articleType) {
      return promises
    }
    let { content } = await nacelleClient.query({
      query: GET_RECENT_ARTICLES,
      variables: {
        "type": pageSection.articleType,
      }
    })
    if (content) {
      let allRecentArticleHandles = [...content].sort((a, b) => b.createdAt - a.createdAt)

      // split ids into batches of 50
      const size = 50; const batches = [];
      for (var i = 0; i < allRecentArticleHandles.length; i += size) {
        batches.push(allRecentArticleHandles.slice(i, i + size))
      }

      // make more queries to get more data for articles
      let allReferences = await batches.reduce(async (carry, batch) => {
        let promises = await carry
        const entries = await nacelleClient.content({
          handles: batch.map(article => article.handle)
        })
        if (entries) {
          return [...promises, ...entries]
        }
      }, Promise.resolve([]))

      let sortedArticles = allReferences.sort((a, b) => {
        let aDatePublished = a.fields.publishedDate ? moment(a.fields.publishedDate).valueOf() / 1000 : a.createdAt
        let bDatePublished = b.fields.publishedDate ? moment(b.fields.publishedDate).valueOf() / 1000 : b.createdAt
        return bDatePublished - aDatePublished
      })

      pageSection.allRecentArticles = sortedArticles
      return [...promises, pageSection]
    }
  }, Promise.resolve([]))

}