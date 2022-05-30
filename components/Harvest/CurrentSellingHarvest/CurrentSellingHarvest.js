import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

import "swiper/css"
import classes from './CurrentSellingHarvest.module.scss'

import HarvestCard from "../HarvestCard"


const CurrentSellingHarvest = ({ fields }) => {
  const { header, description, harvestList, illustration } = fields
  const [activeHarvestList, setActiveHarvestList] = useState(harvestList[0].months)
  const [activeTab, setActiveTab] = useState(harvestList[0])

  const findFilteredFish = (harvestTitle) => {
    const foundHarvest = harvestList.find((harvest) => harvest.title === harvestTitle)
    setActiveHarvestList(foundHarvest.months)
    setActiveTab(foundHarvest)
  }

  return (
    <div className={`${classes['harvest']}`}>
        <div className={classes['harvest__inner']}>
            <div className={`${classes['harvest__illustration']}`}>
                <div className={classes['harvest__illustration-img']}>
                    <Image
                        src={illustration.asset.url}
                        width={587}
                        height={440}
                        layout="fill"
                    />
                </div>
            </div>
            <div className={`${classes['harvest__content']}`}>
                <div className={`${classes['harvest__header']} container`}>
                    {header && <h1>{header}</h1>}
                    {description && <h3>{description}</h3>}
                </div>
                <Swiper
                    slidesPerView={"auto"}
                    spaceBetween={18}
                    breakpoints={{
                        768: {
                            spaceBetween: 60
                        }
                    }}
                    className={classes['harvest__tabs-swiper']}
                >
                {harvestList.map((harvest) => {
                    return (
                        <SwiperSlide className={classes['harvest__tab']} key={harvest._id}>
                            <button onClick={() => findFilteredFish(harvest.title)} className={`${classes['harvest__tab']} heading--tab ${activeTab.title ===  harvest.title ? classes['active'] : ""}`}>
                                {harvest.title}
                            </button>
                        </SwiperSlide>
                    )
                })}
                </Swiper>
                <div className={`${classes['harvest__fish-list']} container`}>
                    {activeHarvestList && activeHarvestList[0].fishArray.map((fish) => {
                        return (
                            <div className={classes['harvest__card']}>
                                <HarvestCard key={fish._key} fish={fish} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    </div>
  )
}

export default CurrentSellingHarvest
