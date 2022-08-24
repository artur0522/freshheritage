import Image from 'next/image';
import React from 'react'
import classes from './AccountDetails.module.scss'
import crabTestImage from './crab.png';

export default function AccountDetailsPage() {
  return (
    <div className={classes['account-details']}>
      <h3>Account Details</h3>

      <h5>My Info</h5>
      <div className={classes['customer-email-info']}>
        <div>
          <div>customer@gmail.com</div>
          <div>*********</div>
        </div>
        <div className={classes['reset']}>
          <a>Send Password Reset</a>
        </div>
      </div>

      <h3>My Subscriptions</h3>

      <div className={classes['subscription-container']}>
        <div className={classes['summary']}>
          <div className={classes['details']}>
            <div>Premium Seafood Subscription</div>
            <div><strong>Next Box Ships</strong></div>
            <div>Jul 27, 2021</div>
          </div>
          <div className={classes['cancel']}>
            <a>Cancel Plan</a>
          </div>
        </div>

        {/* Plan Details */}
        <div className={classes['detailed-description']}>
          <div className={classes['image']}>
            <Image
              src={crabTestImage.src}
              alt="Crab"
              layout="intrinsic"
              height={84}
              width={120}
            />
          </div>
          <div className={classes['product']}>
            <div className={classes['name']}><span>Premium Seafood Subscription</span> with shellfish</div>
            <div>12 deliveries prepaid | Ships every month</div>
          </div>
          <div className={classes['cost']}>
            <div>$1,850.76 ($154.23/box)</div>
            <div>4.5lbs / box</div>
          </div>
        </div>

        {/* Plan Cancellation Accordion */}
        <div>
          <div>Please select a reason below</div>
          <div>Personal reasons or life changes</div>
          <div>Personal reasons or life changes</div>
          <div>Personal reasons or life changes</div>
          <div>Personal reasons or life changes</div>
          <div>Personal reasons or life changes</div>
          <div>Personal reasons or life changes</div>
          <div>Personal reasons or life changes</div>
          <button>Cancel My Plan</button>
          <a>Nevermind</a>
        </div>
      </div>
    </div>
  )
}
