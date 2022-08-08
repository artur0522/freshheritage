import React from 'react'

import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'
import { filter } from 'lodash-es'

import classes from "./FishermenFilters.module.scss"

const FishermenFilters = () => {
  const articleFiltersDrawerContext = useArticleFiltersDrawerContext()
  const { filters, checkBoxHandler, tagCount } = articleFiltersDrawerContext

  const changeHandler = (hasSubfilter, filterGroup, filterOption, subFilter) => {
    checkBoxHandler(hasSubfilter, filterGroup, filterOption, subFilter)
  }
  
  return (
    <div>
        {Object.keys(filters).map((filterGroup) => {
            return (
                <div key={`${filterGroup}`} className={classes['filter-group']}>
                <h2 className={`${classes['filter-group__title']} h2`}>
                    <span>{filterGroup}</span>
                </h2>
                <ul className={classes['filter-option__wrap']}>
                    {Object.keys(filters[filterGroup].options).map((filterOption) => {
                        return (
                            <li key={filterOption}>
                                {tagCount[filterOption] !== undefined && tagCount[filterOption] >= 2 && <div className={classes['filter-option']}>
                                    <input onChange={() => changeHandler(false, filterGroup, filterOption)} value={filterOption} id={filterOption} checked={filters[filterGroup].options[filterOption].checked} type="checkbox" />
                                    <label htmlFor={filterOption}>{filterOption}</label>
                                </div>}
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

export default FishermenFilters