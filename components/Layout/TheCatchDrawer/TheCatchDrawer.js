import {useEffect, useState, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from './TheCatchDrawer.module.scss'
import Link from 'next/link'

import { useTheCatchContext } from '@/context/TheCatchContext'

import IconClose from '@/svgs/close.svg'
import Image from 'next/image'

const TheCatchDrawer = () => {
  const theCatchContext = useTheCatchContext()
  const { monthName, year, pastIssues,  } = theCatchContext

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
                    {pastIssues?.length > 0 && <ul className={classes['content']}>
                        {pastIssues?.map((issue) => {
                            let foundContent = issue.content.find(section =>  section._type === 'staticHarvest')
                            return (
                                <li key={issue._key}>
                                    <Link href={`/the-catch/${issue.associatedProduct.toLowerCase().replaceAll(' ', '-')}-${issue.month.toLowerCase()}-${issue.year}`}>
                                        <a>
                                            <div className={classes['item-img']}>
                                                <Image 
                                                    src={foundContent?.harvestMonth[0]?.fishArray[0]?.species?.image?.asset?.url}
                                                    height={120}
                                                    width={120}
                                                    objectFit="cover"
                                                    alt={foundContent?.harvestMonth[0]?.fishArray[0]?.species?.title}
                                                />
                                            </div>
                                            <div className={classes['item-text']}>
                                                <h1>
                                                    <span>{issue.month} {issue.year}</span>
                                                    {issue.month.toLowerCase() === monthName && issue.year.toString() === year.toString() && <h4 className={classes['current-label']}>
                                                        Current Issue
                                                    </h4>}
                                                </h1>
                                                <h6>{issue.associatedProduct}</h6>
                                            </div>
                                        </a>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>}
                </div>
            </CSSTransition>
        </div>
    )
}

export default TheCatchDrawer