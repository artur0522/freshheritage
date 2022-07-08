import {useEffect, useMemo, useState, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from '../PDPDrawer/PDPDrawer.module.scss'
import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'

const ArticleFiltersDrawer = () => {
  const articleFiltersDrawerContext = useArticleFiltersDrawerContext()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const nodeRef = useRef(null)
  const timeout = 200

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      articleFiltersDrawerContext.dispatch({ type: 'close_drawer' })
    }, timeout)
  }

  useEffect(() => {
    setTimeout(() => {
    setDrawerOpen(true)
    }, timeout)
  }, [])

  return (
    <div className={classes['pdp-flyout']}>
    <   div onClick={() => closeDrawer()} className={classes['pdp-flyout__overlay']}></div>
        <CSSTransition in={drawerOpen} timeout={timeout} nodeRef={nodeRef} unmountOnExit classNames={{
            'enter': classes['pdp-flyout__content--enter'],
            'enterActive': classes['pdp-flyout__content--enter-active'],
            'enterDone': classes['pdp-flyout__content--enter-done'],
            'exit': classes['pdp-flyout__content--exit'],
            }}>
            <div ref={nodeRef} className={classes['pdp-flyout__content']}>
                hey
            </div>
        </CSSTransition>
    </div>
  )
}

export default ArticleFiltersDrawer