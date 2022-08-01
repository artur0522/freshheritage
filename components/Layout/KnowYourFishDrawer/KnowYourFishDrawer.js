import {useEffect, useState, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from './KnowYourFishDrawer.module.scss'
import { useKnowYourFishDrawerContext } from '@/context/KnowYourFishDrawerContext'
import IconClose from '@/svgs/close.svg'
import ResponsiveImage from '@/components/ResponsiveImage'
import ContentSections from '@/components/Sections/ContentSections'
import { PortableText } from '@portabletext/react'
import { getNacelleReferences } from '@/utils/getNacelleReferences'

const KnowYourFishDrawer = ({fields}) => {

  console.log("fields:", fields)

  const { dispatch } = useKnowYourFishDrawerContext()
  const nodeRef = useRef(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const timeout = 200

  const { header, peakSeason, nutritionalInfo, image, description, content } = fields

  const [contentSections, setContentSections] = useState(content)

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      dispatch({ type: 'close_drawer' })
    }, timeout)
  }

  useEffect(() => {
    if (fields) {
      setTimeout(() => {
        setDrawerOpen(true)
      }, timeout)
    }
  }, [fields])

  useEffect(() => {
    const getUpdatedContent = async () => {
      const fullRefContent = await getNacelleReferences(content)
      return fullRefContent
    }
    getUpdatedContent()
      .then((res) => {
        setContentSections([...res])
      })
  }, [])

  return (
    <div className={`${classes['know-your-fish-drawer']} know-your-fish-drawer`}>
      <div onClick={() => closeDrawer()} className={classes['know-your-fish-drawer__overlay']}></div>
      <CSSTransition in={drawerOpen} timeout={timeout} nodeRef={nodeRef} unmountOnExit classNames={{
          'enter': classes['know-your-fish-drawer__content--enter'],
          'enterActive': classes['know-your-fish-drawer__content--enter-active'],
          'enterDone': classes['know-your-fish-drawer__content--enter-done'],
          'exit': classes['know-your-fish-drawer__content--exit'],
        }}>
          <div ref={nodeRef} className={classes['know-your-fish-drawer__content']}>
            <button
              onClick={() => closeDrawer()}
              className={classes['know-your-fish-drawer__close-btn']}>
                <IconClose />
            </button>
            <div className={classes['know-your-fish']}>
              {header && <h2 className="h1">{header}</h2>}
              {peakSeason && <div className={classes['know-your-fish__detail-item']}>
                <h3><b>Peak Season:</b></h3>
                <h6>{peakSeason}</h6>
              </div>}
              {nutritionalInfo && <div className={classes['know-your-fish__detail-item']}>
                <h3><b>Nutritional info:</b></h3>
                <h6>{nutritionalInfo}</h6>
              </div>}
              {image && <div className={classes['know-your-fish__image']}>
                <ResponsiveImage src={image.asset.url} alt={image.asset.alt || header} />
              </div>}
              {description && <div className={classes['know-your-fish__description']}>
                <PortableText value={description} />
              </div>}
              {content && <div className={classes['know-your-fish__content']}>
                <ContentSections sections={contentSections} />
              </div>}
            </div>
          </div>
      </CSSTransition>
    </div>
  )
}

export default KnowYourFishDrawer