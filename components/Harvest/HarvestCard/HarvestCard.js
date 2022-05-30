import React, { useState } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { Swiper, SwiperSlide } from 'swiper/react'

import "swiper/css"

import classes from './HarvestCard.module.scss'

const HarvestCard = ({ fish, cardStyle }) => {
  const [tabInfo, setTabInfo] = useState(fish['species'])

  const findTabInfo = (category) => {
    setTabInfo(fish[category])
  }

  return (
    <div className={`${cardStyle ===  'flex' ? 'flex' : ""} ${classes['harvest__card']}`}>
        <div className={classes['harvest__card-img']}>
            <Image
                src={tabInfo.image.asset.url}
                alt={tabInfo.title}
                width={858}
                height={572}
            />
        </div>
        <div className={classes['harvest__card-inner']}>
          <div className={classes['harvest__card-tabs']}>
            <Swiper
                  slidesPerView={"auto"}
                  spaceBetween={18}
                  breakpoints={{
                    1024: {
                      spaceBetween: 60
                    }
                }}
                  className={classes['harvest__card-tabs']}
              >
                {Object.keys(fish).filter((key) => key === "species" || key === "locations" || key === "fishermen" || key === "culinary").map((fishCategory) => {
                  return (
                    <SwiperSlide className={`${tabInfo._type ===  fishCategory ? classes['active'] : ""} ${classes['harvest__card-tab']}`}> 
                      <button className="heading--tab" onClick={() => findTabInfo(fishCategory.toString())}>
                        {fishCategory}
                      </button>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
          </div>
          <div className={classes['harvest__card-content']}>
              {tabInfo.header && <h4>{tabInfo.header}</h4>}
              {tabInfo.content && <PortableText value={tabInfo.content} />}
          </div>
        </div>
    </div>
  )
}

export default HarvestCard
