import {useEffect, useState, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from './FishermenInfoDrawer.module.scss'
import { PortableText } from '@portabletext/react'

import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'
import IconClose from '@/svgs/close.svg'

const FishermenInfoDrawer = () => {
  const articleFiltersDrawerContext = useArticleFiltersDrawerContext()
  const { isFishInfoOpen, infoCardFields } = articleFiltersDrawerContext
  const { title, subheader, species, flyoutDescription } = infoCardFields
  console.log(infoCardFields)
  const [mounted, setMounted]= useState(false) 
  const [drawerOpen, setDrawerOpen] = useState(false)
  const nodeRef = useRef(null)
  const timeout = 200

  useEffect(() => {
    setMounted(true)
    setTimeout(() => {
    setDrawerOpen(true)
    }, timeout)
  }, [])

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      articleFiltersDrawerContext.dispatch({ type: 'close_fish_info' })
    }, timeout)
  }

  if(isFishInfoOpen && mounted) {
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
                      <button className="body" onClick={() => closeDrawer()}>
                        <IconClose />
                      </button>
                  </div>
                  <div className={classes['info']}>
                    {title && <h1>{title}</h1>}
                    {subheader && <h2>{subheader}</h2>}
                    {species?.length > 0 && <div className={classes['species-wrap']}>
                      {species.map((singleSpecies, index) => <span key={singleSpecies.header} className="species--title">{index !== 0 && ','} {singleSpecies.header}</span>)}
                    </div>}
                    {flyoutDescription && <p><PortableText value={flyoutDescription} /></p>}
                  </div>
              </div>
          </CSSTransition>
      </div>
    )
  } else {
    return null
  } 
}

export default FishermenInfoDrawer