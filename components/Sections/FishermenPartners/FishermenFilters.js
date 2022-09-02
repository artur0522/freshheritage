import React from 'react'

import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'
import IconCheckmark from '@/svgs/checkmark.svg'
import Checkbox from "react-custom-checkbox";

import classes from "./FishermenFilters.module.scss"

const FishermenFilters = () => {
  const articleFiltersDrawerContext = useArticleFiltersDrawerContext()
  const { filters, checkBoxHandler, tagCount } = articleFiltersDrawerContext

  const changeHandler = (hasSubfilter, filterGroup, filterOption, subFilter) => {
    checkBoxHandler(hasSubfilter, filterGroup, filterOption, subFilter)
  }

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
                                {buildCheckboxInput({
                                    label: filterOption,
                                    checked: filters[filterGroup].options[filterOption].checked,
                                    onChange: () => changeHandler(false, filterGroup, filterOption)
                                })}
                                <ul className={classes['filter-suboption__wrap']}>
                                    {filters[filterGroup].options[filterOption].subFilters && Object.keys(filters[filterGroup].options[filterOption].subFilters).map((subFilter) => {
                                        if(tagCount[subFilter] !== undefined && tagCount[subFilter] >= 3) {
                                            return (
                                                <li key={subFilter}>
                                                    {buildCheckboxInput({
                                                        label: subFilter,
                                                        checked: filters[filterGroup].options[filterOption].subFilters[subFilter].checked,
                                                        onChange: () => changeHandler(true, filterGroup, filterOption, subFilter)
                                                    })}
                                                </li>
                                            )
                                        }
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

export default FishermenFilters