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

  const changeHandler = (event, filterGroupTitle, isFilterOption, filterOption) => {
    checkBoxHandler(event.target.id, filterGroupTitle, isFilterOption, filterOption)
  }

  useEffect(() => {
    setTimeout(() => {
    setDrawerOpen(true)
    }, timeout)
  }, [])

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
                  {filters?.map((filterGroup) => {
                    return (
                        <div key={`${filterGroup.title}-${filterGroup._id}`} className={classes['filter-group']}>
                            <button className={`${classes['filter-group__title']} h2`}>{filterGroup.title}</button>
                                {filterGroup.filterOptions.length > 0 && <ul>
                                    {filterGroup.filterOptions.map((filterOption) => {
                                        return (
                                            <li key={filterOption._key} className={classes['filter-option__wrap']}>
                                                <div className={classes['filter-option']}>
                                                    <label htmlFor={filterOption.value}>{filterOption.name}</label>
                                                    <input onChange={(event) => changeHandler(event, filterGroup.title, true, filterOption.value)} value={filterOption.value} id={filterOption.value} checked={filterOption.isChecked} type="checkbox" />
                                                </div>
                                                <ul className={classes['filter-suboption__wrap']}>
                                                    {filterOption.subFilters && filterOption.subFilters.length > 0 && filterOption.subFilters.map((subFilter) => {
                                                        return (
                                                            <li key={subFilter._key}>
                                                                <label htmlFor={subFilter.value}>{subFilter.name}</label>
                                                                <input onChange={(event) => changeHandler(event, filterGroup.title, false, filterOption)} value={subFilter.value} id={subFilter.value} checked={subFilter.isChecked} type="checkbox" />
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
                  })}
                </div>
            </div>
        </CSSTransition>
    </div>
  )
}

export default ArticleFiltersDrawer