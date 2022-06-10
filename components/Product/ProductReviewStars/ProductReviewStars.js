import { useState, useEffect } from 'react'
import classes from './ProductReviewStars.module.scss'
import FullStarIcon from '@/svgs/full-star.svg'
import HalfStarIcon from '@/svgs/half-star.svg'
import EmptyStarIcon from '@/svgs/empty-star.svg'

const ProductReviewStars = ({productId}) => {

  const [reviews, setReviews] = useState(null)

  function buildStars(average) {
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
        stars.push(<HalfStarIcon className={classes['review-star-half']} />)
      } else {
        stars.push(<EmptyStarIcon className={classes['review-star-empty']} />)
      }
    }

    for (var i = 0; i < emptyStars; i++) {
      stars.push(<EmptyStarIcon className={classes['review-star review-star-empty']} />)
    }
    return stars
  }

  useEffect(() => {
    fetch('/api/reviews/get-reviews', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.message === 'success') {
        const { results } = res.data
        const productReview = results.find(review => review.product.productId == productId)
        if (productReview) {
          const { average, total } = productReview.product
          setReviews({
            total,
            average
          })
        }
      }
    })
  }, [])

  if (!reviews) {
    return ''
  }

  return (
    <div className={classes['product-review-stars']}>
      <ul className={classes['review-stars__wrap']}>
        {buildStars(reviews.average).map((star, index) => <li key={index}>{star}</li>)}
      </ul>
      <span className={classes['review-count']}>
        {reviews.total} Review{reviews.total === 1 ? '' : 's'}
      </span>
    </div>
  )
}

export default ProductReviewStars