import { useEffect, useState, useRef } from 'react'
import { CSSTransition } from 'react-transition-group'
import classes from './EditScheduleDrawer.module.scss'
import { useEditScheduleDrawerContext } from '@/context/EditScheduleDrawerContext'
import IconClose from '@/svgs/close.svg'
import { useMemberAccountContext } from '@/context/MemberAccountContext'
import _ from 'lodash'

const EditScheduleDrawer = ({ subscription }) => {
  const { dispatch } = useEditScheduleDrawerContext();
  const MemberAccountContext = useMemberAccountContext();
  // console.log(`memberaccountcontext`, MemberAccountContext);
  const nodeRef = useRef(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentActiveFulfillment, setCurrentActiveFulfillment] = useState('A')
  const [savedFulfillment, setSavedFulfillment] = useState(
    subscription.fulfill_group,
  )
  const [saving, setSaving] = useState(false);
  const timeout = 200

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

  useEffect(() => {
    setCurrentActiveFulfillment(subscription.fulfill_group)
    setSavedFulfillment(subscription.fulfill_group)
  }, [subscription])

  const disableSaveButton = () => {
    return savedFulfillment === currentActiveFulfillment || saving || MemberAccountContext.reloadingData;
  }

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
            <button
              onClick={() => {
                fetch(`/api/account/skip-order`, {
                  method: 'POST',
                  body: JSON.stringify({
                    skip_date: subscription.subscription_next_orderdate,
                    subscription: subscription.subscription_id,
                    action: 'skip',
                    // d.scheduled_status === "skipped" ? "recover" : "skip",
                  }),
                })
                  .then((_res) => {
                    console.log('skipped ok')
                  })
                  .catch(() => {
                    console.log('skipped failed')
                  })
              }}
              className={`btn salmon ${classes['action-button']}`}
            >
              Skip This Box
            </button>
            <div className={classes['divider']} />
            <div className={classes['text']}>
              Change Shipping Week for This Box
            </div>
            <div className={classes['fulfillment-rows']}>
              {subscription.fulfillment_options.map((ful, index) =>
                renderFulfillmentOption(
                  subscription,
                  ful,
                  index,
                  currentActiveFulfillment,
                  setCurrentActiveFulfillment,
                ),
              )}
            </div>
            <button
              disabled={disableSaveButton()}
              className={`btn salmon ${classes['action-button']}`}
              onClick={() => {
                setSaving(true);
                fetch(`/api/account/update-shipdate`, {
                  method: 'POST',
                  body: JSON.stringify({
                    subscription_id: subscription.subscription_id,
                    subscription_next_orderdate: subscription.fulfillment_options.find(
                      (f) => f.group === currentActiveFulfillment,
                    ).new_chargedate,
                  }),
                })
                  .then((_res) => {
                    console.log('saved ok')
                    setSaving(false);
                    MemberAccountContext.fetchCustomerData();
                  })
                  .catch(() => {
                    console.log('saved failed')
                    setSaving(false);
                    MemberAccountContext.fetchCustomerData();
                  })
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </CSSTransition>
    </div>
  )
}

const renderFulfillmentOption = (
  sub,
  ful,
  index,
  currentActiveFulfillment,
  setCurrentActiveFulfillment,
) => {
  const fulStartDate = new Date(ful.fulfill_start)
  const fulEndDate = new Date(ful.fulfill_end)

  const startString = fulStartDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  const endString = fulEndDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })

  const isFulSelected = currentActiveFulfillment === ful.group
  const isFulDisabled = ful.avail.toLocaleLowerCase() === 'false'

  const mainItemClasses = [
    classes['fulfillment-option'],
    isFulSelected ? classes['selected'] : '',
    isFulDisabled ? classes['disabled'] : '',
  ]
    .filter((i) => !!i)
    .join(' ')

  return (
    <div
    key={`${sub.subscription_id}-${ful.month}-${ful.group}`}
      className={mainItemClasses}
      onClick={() => {
        if (!isFulDisabled && ful.group !== currentActiveFulfillment) {
          setCurrentActiveFulfillment(ful.group)
        }
      }}
    >
      <input
        onChange={() => {
          setCurrentActiveFulfillment(ful.group)
        }}
        checked={isFulSelected}
        disabled={isFulDisabled}
        type="radio"
        id={`radio-${sub.subscription_id}-${ful.month}-${ful.group}`}
        name="radio-fulfillment-options"
      />
      <label htmlFor={`radio-${sub.subscription_id}-${ful.month}-${ful.group}`}>
        Week {index + 1}{' '}
        <span className={classes['highlight']}>
          {startString} - {endString}
        </span>
      </label>
    </div>
  )
}

export default EditScheduleDrawer
