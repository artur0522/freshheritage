import React, { useState, useEffect } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/router'
import Link from 'next/link'

import CategoryCard from '@/components/Cards/CategoryCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import IconArrow from '@/svgs/arrow-right.svg'
import IconSearch from '@/svgs/search.svg'

import classes from "./BrowseCategory.module.scss"
import "swiper/css"

const BrowseCategory = ({ fields }) => {
  const router = useRouter()
  const {header, mobileCta, mobileUrl, categoriesList} = fields
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [blogType, setBlogType] = useState(null)
  const isMobile = useMediaQuery({ query: '(max-width: 1073px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 1074px)' })

    useEffect(() => {
        setMounted(true)
        router.asPath.split("/")
        setBlogType(router.asPath.split("/")[2])
        console.log("blogtype", blogType)
    }, [fields])

    const handleChange = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleKeyDown = (e) => {
        let index

        if(blogType === 'culinary') {
            index = 'culinary_articles'
        } else {
            index = 'brand_articles'
        }

        if (e.key === 'Enter') {
            e.preventDefault()
            router.push(`/pages/search?query=${searchTerm}&index=${index}`)
        }
    }

  return (
    <div className={classes['browse']}>
        <div className="container">
            <div className={classes['header']}>
                {header && <h1>{header}</h1>}

                {mobileUrl && isMobile && mounted && <div className={classes['header-link']}>
                    <Link href={mobileUrl}>
                        <a>{mobileCta}</a>
                    </Link>
                    <IconArrow />
                </div>}

                {isDesktop && mounted && <div className={classes['header-search']}>
                    <form>
                        <button type="button">
                            <IconSearch />
                        </button>
                        <input type="text" placeholder='Search' className="body" onKeyDown={(e) => handleKeyDown(e)} onChange={(e) => handleChange(e)} value={searchTerm} />
                   </form>
                </div>}
            </div>
            {categoriesList.length > 0 && mounted &&
                <div className={classes['slider']}>
                    <Swiper
                        loop={true}
                        slidesPerView={1.5}
                        spaceBetween={18}
                        threshold={15}
                        breakpoints={{
                            768: {
                                slidesPerView: 2.75
                            },
                            1074: {
                                slidesPerView: 3.75
                            }
                        }}
                        >
                        {categoriesList.map((category) => {
                            return (
                                <SwiperSlide key={category._key}>
                                    <CategoryCard category={category} />
                                </SwiperSlide>
                            )
                        })}
                    </Swiper>
                </div>
            }
        </div>
    </div>
  )
}

export default BrowseCategory
