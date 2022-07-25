import {useEffect, useState, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from './TheCatchDrawer.module.scss'

import { useTheCatchContext } from '@/context/TheCatchContext'
import { useMediaQuery } from 'react-responsive'

import IconClose from '@/svgs/close.svg'
import ResponsiveImage from '@/components/ResponsiveImage'
import Image from 'next/image'

const TheCatchDrawer = () => {
  const theCatchContext = useTheCatchContext()
  const { currentIssue, monthName, findIssue, filteredIssue } = theCatchContext

  const [drawerOpen, setDrawerOpen] = useState(false)
  const nodeRef = useRef(null)
  const timeout = 200

  useEffect(() => {
    setTimeout(() => {
    setDrawerOpen(true)
    }, timeout)
  }, [])

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      theCatchContext.dispatch({ type: 'close_drawer' })
    }, timeout)
  }

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
                    <div className={classes['header']}>
                        <h4>Current and Past Issues</h4>
                    
                        <button className="body" onClick={() => closeDrawer()}>
                            <span><IconClose /></span>
                            <span className={classes['btn-text']}>Close</span>
                        </button>
                    </div>
                    <ul className={classes['content']}>
                        {currentIssue.fields?.content?.filter(content => content._type === 'staticHarvest').map((staticHarvest) => {
                            return (
                                <li onClick={() => findIssue(staticHarvest.harvestMonth[0].month)}>
                                    <div className={classes['item-img']}>
                                        <Image 
                                            src={staticHarvest.harvestMonth[0]?.fishArray[0]?.species?.image?.asset?.url}
                                            height={120}
                                            width={120}
                                            objectFit="cover"
                                            alt={staticHarvest.harvestMonth[0]?.fishArray[0]?.species?.title}
                                        />
                                    </div>
                                    <div className={classes['item-text']}>
                                        <h1>
                                            <span>{staticHarvest.harvestMonth[0].month} {staticHarvest.harvestMonth[0].year}</span>
                                            {filteredIssue.harvestMonth[0].month === staticHarvest.harvestMonth[0].month && <h4 className={classes['current-label']}>
                                                Current Issue
                                            </h4>}
                                        </h1>
                                        <h6>{currentIssue.fields.associatedProduct}</h6>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </CSSTransition>
        </div>
    )
}

export default TheCatchDrawer