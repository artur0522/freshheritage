import { useEffect, useState, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from './EditScheduleDrawer.module.scss'
import { useEditScheduleDrawerContext } from '@/context/EditScheduleDrawerContext'
import IconClose from '@/svgs/close.svg'
import { PortableText } from '@portabletext/react'

const EditScheduleDrawer = ({ subscription }) => {
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

  const currentChargeDate = new Date(subscription.subscription_next_orderdate)

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
    <div className={`${classes['edit-schedule']} edit-schedule`}>
      <div
        onClick={() => closeDrawer()}
        className={classes['edit-schedule__overlay']}
      ></div>
      <CSSTransition
        in={drawerOpen}
        timeout={timeout}
        nodeRef={nodeRef}
        unmountOnExit
        classNames={{
          enter: classes['edit-schedule__content--enter'],
          enterActive: classes['edit-schedule__content--enter-active'],
          enterDone: classes['edit-schedule__content--enter-done'],
          exit: classes['edit-schedule__content--exit'],
        }}
      >
        <div ref={nodeRef} className={classes['edit-schedule__content']}>
          <button
            onClick={() => closeDrawer()}
            className={classes['edit-schedule__close-btn']}
          >
            <IconClose />
          </button>
          <div className={classes['schedule-header']}>
            <h1>Edit Schedule</h1>
            <h4>
              Next Order{' '}
              <span className={classes['highlight']}>
                charges{' '}
                {currentChargeDate.toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </h4>
          </div>

          <div className={classes['skip-and-schedule-box']}>
            <div className={classes['text']}>Skip</div>
            <button className={`btn salmon ${classes['action-button']}`}>
              Skip This Box
            </button>
            <div className={classes['divider']} />
            <div className={classes['text']}>
              Change Shipping Week for This Box
            </div>
            <div className={classes['fulfillment-rows']}>
              {subscription.fulfillment_options.map((ful, index) =>
                renderFulfillmentOption(subscription, ful, index),
              )}
            </div>
          </div>
        </div>
      </CSSTransition>
    </div>
  )
}

const renderFulfillmentOption = (sub, ful, index) => {
  return (
    <div>
      <input
        type="radio"
        id={`radio-${sub.subscription_id}-${ful.month}-${ful.group}`}
        name="radio-fulfillment-options"
      />
      <label htmlFor={`radio-${sub.subscription_id}-${ful.month}-${ful.group}`}>
        Week {index + 1} <span>date - date </span>
      </label>
    </div>
  )
}

export default EditScheduleDrawer
