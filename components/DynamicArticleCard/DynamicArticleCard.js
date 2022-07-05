import React from 'react'

import ArticleCard from '../ArticleCard'
import RecipeArticleCard from '../RecipeArticleCard'

const DynamicArticleCard = ({ article, reverse }) => {
  const tags = article.fields ? article.fields.hero?.articleTags : article.hero?.articleTags
  const recipeTag = tags?.find((tag) => {
    return tag.value === 'recipe'
  })

  if(recipeTag) {
    return (
        <>
            <RecipeArticleCard article={article} />
        </>
    )
  } else {
    return (
        <>
            <ArticleCard article={article} reverse={reverse} />
        </>
    )
  }
}

export default DynamicArticleCard