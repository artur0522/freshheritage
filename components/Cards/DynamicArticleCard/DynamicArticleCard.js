import React from 'react'

import ArticleCard from '../ArticleCard'
import RecipeArticleCard from '../RecipeArticleCard'

const DynamicArticleCard = ({ article, reverse, responsiveImage = false}) => {
  const tags = article.fields ? article.fields?.articleTags : article.hero?.articleTags
  const recipeTag = tags?.find((tag) => {
    return tag.value === 'recipe'
  })

  if(recipeTag) {
    return (
        <>
          <RecipeArticleCard article={article} responsiveImage={responsiveImage} />
        </>
    )
  } else {
    return (
        <>
          <ArticleCard article={article} reverse={reverse} responsiveImage={responsiveImage} />
        </>
    )
  }
}

export default DynamicArticleCard