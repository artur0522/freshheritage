import classes from './ReviewsCarousel.module.scss'

const ReviewsCarousel = ({fields}) => {

  const { header } = fields

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