import React from 'react'

import ArticleCard from '../ArticleCard'
import RecipeArticleCard from '../RecipeArticleCard'

const DynamicArticleCard = ({ article, reverseCard }) => {
  const tags = article.articleTags
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
            <ArticleCard article={article} reverse={reverseCard} />
        </>
    )
  }
}

export default DynamicArticleCard