import React from 'react'
import classes from './BlogFilters.module.scss'
import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'

import BlogFilterItem from './BlogFilterItem'

const BlogFilters = () => {
  const articleFiltersDrawerContext = useArticleFiltersDrawerContext()
  const { filters, checkBoxHandler, tagCount } = articleFiltersDrawerContext

  return (
    <div className={classes['filter-list']}>
        {Object.keys(filters).map((filterGroup, index) => {
          console.log(filterGroup)
            return (
              <BlogFilterItem key={`${filterGroup}-${index}`} filterGroup={filterGroup} />
            )
        })}
    </div>
  )
}

export default BlogFilters