import { nacelleClient } from 'services'
import { GET_RECENT_ARTICLES } from '@/gql/index.js'

export const getRecentArticlesHandles = async (contentSection) => {
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
      pageSection.allRecentArticleHandles = allRecentArticleHandles
      return [...promises, pageSection]
    }
  }, Promise.resolve([]))

}