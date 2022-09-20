import {useEffect, useState, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from './FishermenInfoDrawer.module.scss'
import { PortableText } from '@portabletext/react'
import Video from '@/components/Video'
import IconPlayButton from '@/svgs/play-button.svg'
import ResponsiveImage from '@/components/ResponsiveImage'

import { useArticleFiltersDrawerContext } from '@/context/ArticleFiltersDrawerContext'
import IconClose from '@/svgs/close.svg'

const FishermenInfoDrawer = () => {
  const articleFiltersDrawerContext = useArticleFiltersDrawerContext()
  const { isFishInfoOpen, infoCardFields } = articleFiltersDrawerContext
  const { title, subheader, species, flyoutDescription, flyoutImage, youtubeVideoId } = infoCardFields
  const [mounted, setMounted]= useState(false)
  const [startVideo, setStartVideo] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const nodeRef = useRef(null)
  const timeout = 200

  const showVideo = () => {
    setStartVideo(true)
  }

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

              {flyoutImage?.asset?.url && <div className={classes['hero-image']}>
                <ResponsiveImage sizes="(min-width: 1400px) 800px, 100vw" className={classes.mbl__img} src={flyoutImage.asset.url} layout="fill" alt={title || ''} />
                {youtubeVideoId && <Video youtubeVideoId={youtubeVideoId} startVideo={startVideo} className={classes['hero-video__wrap']} />}
                {youtubeVideoId && !startVideo &&
                  <button
                    className={classes['play-btn']}
                    onClick={() => showVideo()}><IconPlayButton /></button>
                }
              </div>}

              {flyoutDescription && <div><PortableText value={flyoutDescription} /></div>}
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