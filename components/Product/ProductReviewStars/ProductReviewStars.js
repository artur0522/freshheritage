import { useState, useEffect, forwardRef } from 'react'
import classes from './ProductReviewStars.module.scss'
import FullStarIcon from '@/svgs/full-star.svg'
import HalfStarIcon from '@/svgs/half-star.svg'
import EmptyStarIcon from '@/svgs/empty-star.svg'
import { animateScroll as scroll } from 'react-scroll'

const ProductReviewStars = forwardRef(({productId}, ref) => {

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

  const getScrollPosition = (el) => {
    return el.getBoundingClientRect().top + window.scrollY
  }

  const onClick = () => {
    if (!ref.current['productReviews'].current) return
    const sectionEl = ref.current['productReviews'].current
    const sectionElTopPosition = getScrollPosition(sectionEl)
    scrollToEl(sectionElTopPosition)
  }

  const scrollToEl = (value) => {
    scroll.scrollTo(value, {
      duration: 300,
    })
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
  }, [productId])

  if (!reviews) {
    return ''
  }

  return (
    <div onClick={() => onClick()} ref={ref.current.reviewsStars} className={classes['product-review-stars']}>
      <ul className={classes['review-stars__wrap']}>
        {buildStars(reviews.average).map((star, index) => <li key={index}>{star}</li>)}
      </ul>
      <span className={classes['review-count']}>
        {reviews.total} Review{reviews.total === 1 ? '' : 's'}
      </span>
    </div>
  )
})

export default ProductReviewStars