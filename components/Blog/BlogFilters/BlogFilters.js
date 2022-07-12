import { useEffect, useMemo, useState, useRef} from 'react'
import classes from './BlogFilters.module.scss'
import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'

const BlogFilters = () => {
  const articleFiltersDrawerContext = useArticleFiltersDrawerContext()
  const { filters, checkBoxHandler, tagCount } = articleFiltersDrawerContext

  const changeHandler = (hasSubfilter, filterGroup, filterOption, subFilter) => {
    checkBoxHandler(hasSubfilter, filterGroup, filterOption, subFilter)
  }

  return (
    <div className={classes['filter-list']}>
        {Object.keys(filters).map((filterGroup) => {
            return (
                <div key={`${filterGroup}`} className={classes['filter-group']}>
                    <button className={`${classes['filter-group__title']} h2`}>{filterGroup}</button>
                        <ul>
                            {Object.keys(filters[filterGroup].options).map((filterOption) => {
                                return (
                                    <li key={filterOption} className={classes['filter-option__wrap']}>
                                        {<div className={classes['filter-option']}>
                                            <input onChange={() => changeHandler(false, filterGroup, filterOption)} value={filterOption} id={filterOption} checked={filters[filterGroup].options[filterOption].checked} type="checkbox" />
                                            <label htmlFor={filterOption}>{filterOption}</label>
                                        </div>} 
                                        <ul className={classes['filter-suboption__wrap']}>
                                            {filters[filterGroup].options[filterOption].subFilters && Object.keys(filters[filterGroup].options[filterOption].subFilters).map((subFilter) => {
                                                // if(tagCount[subFilter] !== undefined && tagCount[subFilter] >= 4) {
                                                    return (
                                                        <li key={subFilter}>
                                                            <input onChange={() => changeHandler(true, filterGroup, filterOption, subFilter)} value={subFilter} id={subFilter} checked={filters[filterGroup].options[filterOption].subFilters[subFilter].checked} type="checkbox" />
                                                            <label htmlFor={subFilter}>{subFilter}</label>
                                                        </li>
                                                    )
                                                // }
                                            })}
                                        </ul>
                                    </li>
                                )
                            })}
                        </ul>
                </div>
            )
        })}
    </div>
  )
}

export default BlogFilters