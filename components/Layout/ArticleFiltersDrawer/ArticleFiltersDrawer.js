import {useEffect, useMemo, useState, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from './ArticleFiltersDrawer.module.scss'
import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'
import { filter } from 'lodash-es'

const ArticleFiltersDrawer = () => {
  const articleFiltersDrawerContext = useArticleFiltersDrawerContext()
  const { filters, checkBoxHandler } = articleFiltersDrawerContext

  const [drawerOpen, setDrawerOpen] = useState(false)
  const nodeRef = useRef(null)
  const timeout = 200

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      articleFiltersDrawerContext.dispatch({ type: 'close_drawer' })
    }, timeout)
  }

  const changeHandler = (hasSubfilter, filterGroup, filterOption, subFilter) => {
    checkBoxHandler(hasSubfilter, filterGroup, filterOption, subFilter)
  }

  useEffect(() => {
    setTimeout(() => {
    setDrawerOpen(true)
    }, timeout)
  }, [])

  console.log(filters)

  return (
    <div className={classes['pdp-flyout']}>
    <div onClick={() => closeDrawer()} className={classes['pdp-flyout__overlay']}></div>
        <CSSTransition in={drawerOpen} timeout={timeout} nodeRef={nodeRef} unmountOnExit classNames={{
            'enter': classes['pdp-flyout__content--enter'],
            'enterActive': classes['pdp-flyout__content--enter-active'],
            'enterDone': classes['pdp-flyout__content--enter-done'],
            'exit': classes['pdp-flyout__content--exit'],
            }}>
            <div ref={nodeRef} className={classes['pdp-flyout__content']}>
                <div className={classes['hide']}>
                    <button className="body" onClick={() => closeDrawer()}>Hide Filters</button>
                </div>
                <div className={classes['filter-list']}>
                    {Object.keys(filters).map((filterGroup) => {
                        return (
                            <div key={`${filterGroup}`} className={classes['filter-group']}>
                                <button className={`${classes['filter-group__title']} h2`}>{filterGroup}</button>
                                    <ul>
                                        {Object.keys(filters[filterGroup].options).map((filterOption) => {
                                            return (
                                                <li key={filterOption} className={classes['filter-option__wrap']}>
                                                    <div className={classes['filter-option']}>
                                                        <label htmlFor={filterOption}>{filterOption}</label>
                                                        <input onChange={() => changeHandler(false, filterGroup, filterOption)} value={filterOption} id={filterOption} checked={filters[filterGroup].options[filterOption].checked} type="checkbox" />
                                                    </div>
                                                    <ul className={classes['filter-suboption__wrap']}>
                                                        {filters[filterGroup].options[filterOption].subFilters && Object.keys(filters[filterGroup].options[filterOption].subFilters).map((subFilter) => {
                                                            return (
                                                                <li key={subFilter}>
                                                                    <label htmlFor={subFilter}>{subFilter}</label>
                                                                    <input onChange={() => changeHandler(true, filterGroup, filterOption, subFilter)} value={subFilter} id={subFilter} checked={filters[filterGroup].options[filterOption].subFilters[subFilter].checked} type="checkbox" />
                                                                </li>
                                                            )
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
            </div>
        </CSSTransition>
    </div>
  )
}

export default ArticleFiltersDrawer