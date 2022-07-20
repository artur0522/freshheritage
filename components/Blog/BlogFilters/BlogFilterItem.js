import { useState} from 'react'
import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'

import PlusIcon from '@/svgs/plus.svg'
import MinusIcon from '@/svgs/minus.svg'

import classes from './BlogFilters.module.scss'
import { filter } from 'lodash-es'

const BlogFilterItem = (props) => {
  const articleFiltersDrawerContext = useArticleFiltersDrawerContext()
  const { filters, checkBoxHandler, tagCount, dispatch, filterListingsByTags } = articleFiltersDrawerContext
  const { filterGroup } = props
  const [dropdown, setDropdown] = useState(false)

  const changeHandler = (hasSubfilter, filterGroup, filterOption, subFilter) => {
    checkBoxHandler(hasSubfilter, filterGroup, filterOption, subFilter)
  }

  return (
    <div key={`${filterGroup}`} className={classes['filter-group']}>
        <button onClick={() => setDropdown(!dropdown)} className={`${classes['filter-group__title']} h2`}>
            <span>{filterGroup}</span>

            <div className={classes['icon-wrap']}>
                {dropdown && <span className={classes['minus']}><MinusIcon /></span>}
                {!dropdown && <span className={classes['plus']}><PlusIcon /></span>}
            </div>
        </button>
        {dropdown && <ul className={classes['filter-option__wrap']}>
            {Object.keys(filters[filterGroup].options).map((filterOption) => {
                return (
                    <li key={filterOption}>
                        {tagCount[filterOption] !== undefined && tagCount[filterOption] >= 3 && <div className={classes['filter-option']}>
                            <input onChange={() => changeHandler(false, filterGroup, filterOption)} value={filterOption} id={filterOption} checked={filters[filterGroup].options[filterOption].checked} type="checkbox" />
                            <label htmlFor={filterOption}>{filterOption}</label>
                        </div>}
                        {tagCount[Object.keys(filters[filterGroup].options[filterOption].subFilters)[0]] !== undefined && filters[filterGroup].options[filterOption].subFilters && <div className={classes['filter-option']}>
                            <input onChange={() => changeHandler(true, filterGroup, filterOption)} value={filterOption} id={filterOption} checked={filters[filterGroup].options[filterOption].checked} type="checkbox" />
                            <label htmlFor={filterOption}>{filterOption}</label>
                        </div>}
                        <ul className={classes['filter-suboption__wrap']}>
                            {filters[filterGroup].options[filterOption].subFilters && Object.keys(filters[filterGroup].options[filterOption].subFilters).map((subFilter) => {
                                if(tagCount[subFilter] !== undefined && tagCount[subFilter] >= 3) {
                                    return (
                                        <li key={subFilter}>
                                            <input onChange={() => changeHandler(true, filterGroup, filterOption, subFilter)} value={subFilter} id={subFilter} checked={filters[filterGroup].options[filterOption].subFilters[subFilter].checked} type="checkbox" />
                                            <label htmlFor={subFilter}>{subFilter}</label>
                                        </li>
                                    )
                                }
                            })}
                        </ul>
                    </li> 
                )
            })}
        </ul>}
    </div>
  )
}

export default BlogFilterItem