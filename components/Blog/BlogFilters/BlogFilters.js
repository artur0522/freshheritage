import { useEffect, useMemo, useState, useRef} from 'react'
import classes from './BlogFilters.module.scss'
import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'

import BlogFilterItem from './BlogFilterItem'

import PlusIcon from '@/svgs/plus.svg'
import MinusIcon from '@/svgs/minus.svg'

const BlogFilters = () => {
  const articleFiltersDrawerContext = useArticleFiltersDrawerContext()
  const { filters, checkBoxHandler, tagCount } = articleFiltersDrawerContext

  const changeHandler = (hasSubfilter, filterGroup, filterOption, subFilter) => {
    checkBoxHandler(hasSubfilter, filterGroup, filterOption, subFilter)
  }

  const handleDropdown = (filterGroup) => {
    dropdown[filterGroup] 
  }

  return (
    <div className={classes['filter-list']}>
        {Object.keys(filters).map((filterGroup) => {
            return (
              <BlogFilterItem filterGroup={filterGroup} />
            )
        })}
    </div>
  )
}

export default BlogFilters