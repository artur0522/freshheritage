import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useMediaQuery } from 'react-responsive'

import "swiper/css"

import classes from './HarvestCard.module.scss'

const HarvestCard = ({ fish, cardStyle }) => {
  const [tabInfo, setTabInfo] = useState(fish['species'])
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const isMobile =  useMediaQuery({ query: '(max-width: 767px)' })
  const isDesktop = useMediaQuery({query: '(min-width: 768px)'})

  const findTabInfo = (category) => {
    setTabInfo(fish[category])
  }

  return (
    <div className={`${classes['harvest__card']} ${cardStyle === 'projected-card' ? classes['projected-card'] : ""}`}>
       {cardStyle === 'projected-card' && isMobile && mounted &&
          <div className={classes['harvest__card-img']}>
            <Image
                src={tabInfo.image.asset.url}
                alt={tabInfo.title}
                width={858}
                height={572}
            />
          </div>}

        {cardStyle === 'projected-card' && isDesktop && mounted &&
          <div className={classes['harvest__card-img']}>
              <Image
                  src={tabInfo.image.asset.url}
                  alt={tabInfo.title}
                  objectFit="cover"
                  layout='fill'
              />
          </div>}

          {cardStyle !== 'projected-card' &&
          <div className={classes['harvest__card-img']}>
              <Image
                  src={tabInfo.image.asset.url}
                  alt={tabInfo.title}
                  width={858}
                  height={572}
              />
          </div>}
        <div className={classes['harvest__card-inner']}>
          <div className={classes['harvest__card-tabs']}>
            <Swiper
                  slidesPerView={"auto"}
                  spaceBetween={36}
                  breakpoints={{
                    1024: {
                      spaceBetween: cardStyle === 'projected-card' ? 36 : 60
                    }
                }}
                  className={classes['harvest__card-swiper']}
              >
                {Object.keys(fish).filter((key) => key === "species" || key === "locations" || key === "fishermen" || key === "culinary").reverse().map((fishCategory) => {
                  return (
                    <SwiperSlide key={`${fish._key}-${fishCategory}`} className={`${tabInfo._type ===  fishCategory ? classes['active'] : ""} ${classes['harvest__card-tab']}`}> 
                      <button className={`${cardStyle === 'projected-card' ? 'heading--projected-tab' : 'heading--tab'}`} onClick={() => findTabInfo(fishCategory.toString())}>
                        {fishCategory}
                      </button>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
          </div>
          <div className={classes['harvest__card-content']}>
              {tabInfo.header && <h4 className={`${cardStyle === 'projected-card' ? 'heading--projected-title' : ""}`}>{tabInfo.header}</h4>}
              {tabInfo.content && <PortableText value={tabInfo.content} />}
          </div>
        </div>
    </div>
  )
}

export default HarvestCard
