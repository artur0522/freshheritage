import React from 'react'
import classes from './ProductReviewStars.module.scss'
import FullStarIcon from '@/svgs/full-star.svg'

const ProductReviewStars = ({average = 4.5, reviewCount = 34}) => {

  const decimal = average - Math.floor(average)
  const fullStars = Math.floor(average)
  const emptyStars = 4 - fullStars
  let stars = []

  for (var i = 0; i < fullStars; i++) {
    stars.push(<FullStarIcon className={classes['review-star-full']} />)
  }

  if (fullStars < 5) {
    if (decimal >= .6) {
      stars.push(<FullStarIcon className={classes['review-star-full']} />)
    } else if (decimal >= .3) {
      stars.push(<FullStarIcon className={classes['review-star-half']} />)
    } else {
      stars.push(<FullStarIcon className={classes['review-star-empty']} />)
    }
  }

  for (var i = 0; i < emptyStars; i++) {
    stars.push(<FullStarIcon className={classes['review-star review-star-empty']} />)
  }

  return (
    <div className={classes['product-review-stars']}>
      <ul className={classes['review-stars__wrap']}>
        {stars.map((star, index) => <li key={index}>{star}</li>)}
      </ul>
      <span className={classes['review-count']}>
        {reviewCount} Review{reviewCount === 1 ? '' : 's'}
      </span>
    </div>
  )
}

export default ProductReviewStars