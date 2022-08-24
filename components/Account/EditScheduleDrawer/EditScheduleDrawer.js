import {useEffect, useState, useRef} from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from './EditScheduleDrawer.module.scss'
import { useEditScheduleDrawerContext } from '@/context/EditScheduleDrawerContext'
import IconClose from '@/svgs/close.svg'
import ResponsiveImage from '@/components/ResponsiveImage'
import ArticleRow from '@/components/Sections/ArticleRow'
import { PortableText } from '@portabletext/react'
import { getNacelleReferences } from '@/utils/getNacelleReferences'

const EditScheduleDrawer = ({subscription}) => {

  const { dispatch } = useEditScheduleDrawerContext()
  const nodeRef = useRef(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const timeout = 200

  // const { header, peakSeason, nutritionalInfo, image, description, content } = fields

  // const [contentSections, setContentSections] = useState(content)

  const closeDrawer = () => {
    setDrawerOpen(false)
    setTimeout(() => {
      dispatch({ type: 'close_drawer' })
    }, timeout)
  }

  useEffect(() => {
    if (subscription) {
      setTimeout(() => {
        setDrawerOpen(true)
      }, 500)
    }
  }, [subscription])

  // useEffect(() => {
  //   const getUpdatedContent = async () => {
  //     const fullRefContent = await getNacelleReferences(content)
  //     return fullRefContent
  //   }
  //   getUpdatedContent()
  //     .then((res) => {
  //       setContentSections([...res])
  //     })
  // }, [])

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
              <div className={classes['know-your-fisher__header']}>
                <h2 className="h1">HEADER</h2>
                <div className={classes['know-your-fish__detail-item']}>
                  <h3>Peak Season:</h3>
                  <p>peak season here</p>
                </div>
              </div>

              {<div className={classes['know-your-fish__description']}>
                <PortableText value='this is a description' />
              </div>}
            </div>
          </div>
      </CSSTransition>
    </div>
  )
}

export default EditScheduleDrawer
