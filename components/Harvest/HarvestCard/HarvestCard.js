import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useMediaQuery } from 'react-responsive'
import { getNacelleReferences } from '@/utils/getNacelleReferences'

import { Navigation, Thumbs } from "swiper";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css"

import classes from './HarvestCard.module.scss'

async function getFullRefFish(fish) {
 return await getNacelleReferences(fish)
}

const HarvestCard = ({ fish: fishData, cardStyle }) => {

  const [fish, setFish] = useState(fishData)
  const [tabInfo, setTabInfo] = useState(fish['species'])
  const [mounted, setMounted] = useState(false)
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  useEffect(() => {
    setMounted(true)
    setThumbsSwiper()
  }, [thumbsSwiper])

  useEffect(() => {
    getFullRefFish(fish)
      .then((res) => {
        setFish({...res})
      })
  }, [])

  const isMobile =  useMediaQuery({ query: '(max-width: 767px)' })
  const isDesktop = useMediaQuery({query: '(min-width: 768px)'})

  const findTabInfo = (category) => {
    setTabInfo(fish[category])
  }

  return (
    <div className={`${classes['harvest__card']} ${cardStyle === 'projected-card' ? classes['projected-card'] : ""}`}>
       {cardStyle === 'projected-card' && isMobile && mounted && tabInfo?.image?.asset?.url && tabInfo[0]?._type !== 'fishermen' &&
        <div className={classes['harvest__card-img']}>
          <Image
              src={tabInfo.image.asset.url}
              alt={tabInfo.title}
              width={858}
              height={572}
          />
        </div>}

        {cardStyle === 'projected-card' && isDesktop && mounted && tabInfo?.image?.asset?.url && tabInfo[0]?._type !== 'fishermen'  &&
        <div className={classes['harvest__card-img']}>
          <Image
            src={tabInfo.image.asset.url}
            alt={tabInfo.title}
            objectFit="cover"
            layout='fill'
          />
        </div>}

        {cardStyle !== 'projected-card' && tabInfo?.image?.asset?.url && mounted && tabInfo[0]?._type !== 'fishermen' &&
        <div className={classes['harvest__card-img']}>
            <Image
                src={tabInfo.image.asset.url}
                alt={tabInfo.title}
                width={858}
                height={572}
            />
        </div>}

        {tabInfo[0]?._type === 'fishermen' &&
          <Swiper
              navigation={true}
              slidesPerView={1}
              onSwiper={setThumbsSwiper}
              modules={[Navigation, Thumbs]}
              thumbs={{ swiper: thumbsSwiper }}
              threshold={15}
              className="fishermen-swiper">
              {fish.fishermen.map((fishermen) => {
                return (
                  <SwiperSlide key={`${fishermen._key}-${fishermen.title}`}>
                    <div className={classes['harvest__card-img']}>
                      <Image
                          src={fishermen.image.asset.url}
                          alt={fishermen.title}
                          width={858}
                          height={572}
                      />
                    </div>
                  </SwiperSlide>
                )
              })}
          </Swiper>}

        <div className={classes['harvest__card-inner']}>
          <div className={classes['harvest__card-tabs']}>
            <Swiper
                  slidesPerView={"auto"}
                  spaceBetween={36}
                  threshold={15}
                  breakpoints={{
                    1024: {
                      spaceBetween: cardStyle === 'projected-card' ? 36 : 60
                    }
                }}
                  className={classes['harvest__card-swiper']}
              >
                {Object.keys(fish).filter((key) => key === "species" || key === "locations" || key === "fishermen" || key === "culinary").reverse().map((fishCategory) => {
                  return (
                    <SwiperSlide key={`${fish._key}-${fishCategory}`} className={`${tabInfo._type === fishCategory || tabInfo[0]?._type === fishCategory ? classes['active'] : ""} ${classes['harvest__card-tab']}`}>
                      <button className={`${cardStyle === 'projected-card' ? 'heading--projected-tab' : 'heading--tab'}`} onClick={() => findTabInfo(fishCategory.toString())}>
                        {fishCategory === 'fishermen' ? 'Caught By' : fishCategory}
                      </button>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
          </div>

          {tabInfo[0]?._type !== 'fishermen' &&
          <div className={classes['harvest__card-content']}>
              {tabInfo.header && <h4 className={`${cardStyle === 'projected-card' ? 'heading--projected-title' : ""}`}>{tabInfo.header}</h4>}
              {tabInfo.subheader && <h5>{tabInfo.subheader}</h5>}
              {tabInfo.content && <div className={classes['content-block']}><PortableText value={tabInfo.content} /></div>}
          </div>}

           {tabInfo[0]?._type === 'fishermen' &&
            <Swiper
              slidesPerView={1}
              onSwiper={setThumbsSwiper}
              watchSlidesProgress={true}
              allowTouchMove={false}
              modules={[Navigation, Thumbs]}
              threshold={15}
              className={classes['harvest__card-swiper']}>
                {fish.fishermen.map((fishermen) => {
                  return (
                    <SwiperSlide key={`${fishermen._key}--${fishermen.title}`}>
                      <div className={classes['harvest__card-content']}>
                          {fishermen.header && <h4 className={`${cardStyle === 'projected-card' ? 'heading--projected-title' : ""}`}>{fishermen.header}</h4>}
                          {fishermen.subheader && <h5>{fishermen.subheader}</h5>}
                          {fishermen.content && <div className={classes['content-block']}><PortableText value={fishermen.content} /></div>}
                      </div>
                    </SwiperSlide>
                  )
                })}
            </Swiper>}
        </div>
    </div>
  )
}

export default HarvestCard