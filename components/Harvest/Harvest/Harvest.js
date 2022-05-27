import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import "swiper/css"
import classes from './Harvest.module.scss'

import HarvestCard from "../HarvestCard"


const Harvest = ({ fields }) => {
  const { header, description, harvestList } = fields
  const [activeHarvestList, setActiveHarvestList] = useState(harvestList[0].months)
  const [activeTab, setActiveTab] = useState(activeHarvestList[0])

  const findFilteredFish = (harvestTitle) => {
    const foundHarvest = harvestList.find((harvest) => harvest.title === harvestTitle)
    setActiveHarvestList(foundHarvest.months)
    setActiveTab(foundHarvest)
  }

  return (
    <div className={`${classes['harvest']}`}>
        <div className={`${classes['harvest__content']}`}>
            <div className={`${classes['harvest__header']} ${classes['harvest--gutters']}`}>
                {header && <h1>{header}</h1>}
                {description && <h3>{description}</h3>}
            </div>
            <Swiper
                loop={true}
                slidesPerView={"auto"}
                spaceBetween={10}
                className={classes['harvest__tabs-swiper']}
            >
            {harvestList.map((harvest) => {
                return (
                    <SwiperSlide className={classes['harvest__tab']}>
                        <button onClick={() => findFilteredFish(harvest.title)} className={`${classes['harvest__tab']} heading--tab ${activeTab.title ===  harvest.title ? classes['active'] : ""}`}>
                            {harvest.title}
                        </button>
                    </SwiperSlide>
                )
            })}
            </Swiper>
            <div className={`${classes['harvest__fish-list']} ${classes['harvest--gutters']}`}>
                {activeHarvestList && activeHarvestList[0].fishArray.map((fish) => {
                    return (
                        <HarvestCard key={fish._key} fish={fish} />
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default Harvest
