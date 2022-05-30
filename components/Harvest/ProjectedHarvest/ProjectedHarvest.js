import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

import "swiper/css"
import classes from './ProjectedHarvest.module.scss'

import HarvestCard from "../HarvestCard"

const ProjectedHarvest = ({ fields }) => {
  const { title, harvestList } = fields
  const months = []
  harvestList.forEach((harvest) => {
    harvest.months.forEach((month) => {
        months.push(month.title)
    })
  })

  const [activeHarvestList, setActiveHarvestList] = useState(harvestList[0].months)
  const [activeTab, setActiveTab] = useState(months[0])

  console.log(fields)
  
  const findFilteredFish = (harvestTitle) => {
    const foundHarvest = harvestList.find((harvest) => harvest.title === harvestTitle)
    setActiveHarvestList(foundHarvest.months)
    setActiveTab(foundHarvest)
  }

  return (
    <div className={`${classes['harvest']}`}>
        <div className={classes['harvest__inner']}>
            <div className={`${classes['harvest__content']}`}>
                <div className={`${classes['harvest__header']} container`}>
                    {title && <h4>{title}</h4>}
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
                {months.map((month) => {
                    return (
                        <SwiperSlide className={classes['harvest__tab']} key={month}>
                            <button onClick={() => findFilteredFish(month)} className={`${classes['harvest__tab']} heading--tab ${activeTab.title ===  month ? classes['active'] : ""}`}>
                                {month}
                            </button>
                        </SwiperSlide>
                    )
                })}
                </Swiper>

                {harvestList && harvestList.map((harvest) => {
                    return (
                        <div className={`${classes['harvest__list']}`}>
                            <div className="container">
                                <h4>{harvest.title}</h4>
                                <div className={`${classes['harvest__fish-list']}`}>
                                    {harvest.months[0].fishArray.map((fish) => {
                                        return(
                                            <div className={classes['harvest__card']}>
                                                <HarvestCard key={fish._key} fish={fish} cardStyle={'flex'} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default ProjectedHarvest
