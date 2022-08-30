import { useState} from 'react'
import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'

import PlusIcon from '@/svgs/plus.svg'
import MinusIcon from '@/svgs/minus.svg'
import IconCheckmark from '@/svgs/checkmark.svg'
import Checkbox from "react-custom-checkbox";

import classes from './BlogFilters.module.scss'
import { filter } from 'lodash-es'

const BlogFilterItem = (props) => {
  const articleFiltersDrawerContext = useArticleFiltersDrawerContext()
  const { filters, optionHandler, subOptionHandler, tagCount} = articleFiltersDrawerContext
  const { filterGroup } = props
  const [dropdown, setDropdown] = useState(false)
  
  function buildCheckboxInput({ onChange, label, checked }) {
    return <div className={`${classes['filter-option__checkbox-wrapper']} body`}>
                <Checkbox
                    className={`${classes['filter-option']}`}
                    icon={<div className={classes['filter-option--checked']}><IconCheckmark /></div>}
                    label={label}
                    checked={checked}
                    onChange={() => onChange()}
                />
            </div>
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
                        {tagCount[filterOption] !== undefined && tagCount[filterOption] >= 4 && tagCount[Object.keys(filters[filterGroup].options[filterOption].subFilters)[0]] === undefined &&
                            buildCheckboxInput({
                                label: filterOption,
                                checked: filters[filterGroup].options[filterOption].checked,
                                onChange: () => optionHandler(false, filterGroup, filterOption)
                            })
                        }

                        {tagCount[Object.keys(filters[filterGroup].options[filterOption].subFilters)[0]] !== undefined && filters[filterGroup].options[filterOption].subFilters &&
                            buildCheckboxInput({
                                label: filterOption,
                                checked: filters[filterGroup].options[filterOption].checked,
                                onChange: () => optionHandler(true, filterGroup, filterOption)
                            })
                        }
                        
                        <ul className={classes['filter-suboption__wrap']}>
                            {filters[filterGroup].options[filterOption].subFilters && Object.keys(filters[filterGroup].options[filterOption].subFilters).map((subFilter) => {
                                    return (
                                        <li key={subFilter}>
                                            {buildCheckboxInput({
                                                label: subFilter,
                                                checked: filters[filterGroup].options[filterOption].subFilters[subFilter].checked,
                                                onChange: () => subOptionHandler(true, filterGroup, filterOption, subFilter)
                                            })}
                                        </li>
                                    )
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