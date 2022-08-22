import React from 'react'

import ArticleCard from '../ArticleCard'
import RecipeArticleCard from '../RecipeArticleCard'

const DynamicArticleCard = ({ article, reverse, responsiveImage = false}) => {
  const blog = article.fields ? article.fields.blog : article.blog
  let isRecipe = false;
  if (blog) {
    const blogCategory = blog.handle?.current ? blog.handle.current : blog.handle
    if (blogCategory === 'recipes') {
      isRecipe = true
    }
  }

  if(isRecipe) {
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