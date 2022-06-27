import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Link from 'next/link'
import IconArrow from '@/svgs/arrow-right.svg'

import classes from './RecipeCategoriesList.module.scss'

const RecipeCategoriesList = ({ fields }) => {
  const {header, ctaUrl, ctaText, categoriesList } = fields
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' })

  useEffect(() => {
    setMounted(true)
  }, [fields])

  return (
    <div className={`${classes['categories']}`}>
        <div className="container">
            <div className={classes['categories__header']}>
                {header && <h1>{header}</h1>}

                {ctaUrl &&<div className={classes['categories__header-link']}>
                    <Link href={ctaUrl}>
                        <a>{ctaText}</a>
                    </Link>
                    <IconArrow />
                </div>}
            </div>
            <div className={classes['categories__list']}>
                {categoriesList.length > 0 && categoriesList.map((category) => {
                    return (
                        <Link href={category.url} key={category._key}>
                            <a className={classes['categories__card']}>
                                {isMobile && mounted && category.desktopImage.asset.url && <div className={`${classes['card__img']}`}>
                                    <Image
                                        src={category.desktopImage.asset.url}
                                        alt={category.alt}
                                        width={707}
                                        height={235}
                                    />
                                </div>}
                                {isDesktop && mounted && category.desktopImage.asset.url && <div className={`${classes['card__img']}`}>
                                    <Image
                                        src={category.desktopImage.asset.url}
                                        alt={category.alt}
                                        width={797}
                                        height={317}
                                    />
                                </div>}
                                {header && <h4>{header}</h4>}
                            </a>
                        </Link>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default RecipeCategoriesList
