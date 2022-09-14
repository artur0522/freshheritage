import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SwiperSlide } from 'swiper/react'

import classes from "./CategoryCard.module.scss"
import "swiper/css"

const CategoryCard = ({ category, slide }) => {
  return (
    <div className={classes['slider__slide']}>
        <div className={classes['image-wrap']}>
            <Image width={438} height={600} alt={category.alt || "category image"} src={category.image.asset.url} />
        </div>
        <div className={classes['text']}>
            <h2 className="h4">{category.header}</h2>
            <div className={classes['btn-wrap']}>
                <Link href={category.ctaUrl}>
                    <a className="btn alabaster">{category.ctaText}</a>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default CategoryCard