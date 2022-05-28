import React, { useState } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Swiper, SwiperSlide } from 'swiper/react'

import "swiper/css"

import classes from './HarvestCard.module.scss'

const HarvestCard = ({ fish }) => {
  const [tabInfo, setTabInfo] = useState(fish['species'])

  const findTabInfo = (category) => {
    setTabInfo(fish[category])
  }

  console.log("tabInfo", tabInfo);

  return (
    <div className={classes['harvest__card']}>
        <div className={classes['harvest__card-img']}>
            <Image
                src={tabInfo.image.asset.url}
                alt={tabInfo.title}
                width={858}
                height={572}
            />
        </div>
        <div className={classes['harvest__card-tabs']}>
          <Swiper
                loop={true}
                slidesPerView={"auto"}
                spaceBetween={20}
                className={classes['harvest__card-tabs']}
            >
              <SwiperSlide className={classes['harvest__card-tab']}> 
                <button className="heading--tab" onClick={() => findTabInfo('species')}>Species</button>
              </SwiperSlide>
              <SwiperSlide className={classes['harvest__card-tab']}>
                <button className="heading--tab" onClick={() => findTabInfo('locations')}>Location</button>
              </SwiperSlide>
              <SwiperSlide className={classes['harvest__card-tab']}>
                <button className="heading--tab" onClick={() => findTabInfo('fishermen')}>Caught By</button>
              </SwiperSlide>
              <SwiperSlide className={classes['harvest__card-tab']}>
                <button className="heading--tab" onClick={() => findTabInfo('culinary')}>Culinary</button>
              </SwiperSlide>
            </Swiper>
        </div>
        <div className={classes['harvest__card-content']}>
            {tabInfo.header && <h4>{tabInfo.header}</h4>}
            {tabInfo.content && <PortableText value={tabInfo.content} />}
        </div>
    </div>
  )
}

export default HarvestCard
