import { useEffect } from 'react'
import { processNodes } from 'react-html-parser'
import classes from './ReviewsCarousel.module.scss'

const ReviewsCarousel = ({fields}) => {

  const { header } = fields

  useEffect(() => {
    if (StampedFn) {
      StampedFn.init({ apiKey: process.env.NEXT_PUBLIC_STAMPEDIO_KEY_PUBLIC, storeUrl: process.env.NEXT_PUBLIC_STAMPEDIO_STORE_HASH });
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