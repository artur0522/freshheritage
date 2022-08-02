import { useEffect } from 'react'
import classes from './ReviewsCarousel.module.scss'

const ReviewsCarousel = ({fields}) => {

  const { header } = fields

  useEffect(() => {
    if (StampedFn) {
      StampedFn.init({ apiKey: 'pubkey-rCuPl7qXFI5WD689Ee3LO4Mtu461N4', storeUrl: '252897' });
    }
  }, [])

  return (
    <div className={classes['reviews-carousel']}>
      <div className="container">
        <div className={classes['reviews-carousel__header']}>
          <h2 className="h1">{header}</h2>
        </div>
        <div id="stamped-reviews-widget" data-widget-type="carousel" ></div>
      </div>
    </div>
  )
}

export default ReviewsCarousel