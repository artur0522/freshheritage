import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

import "swiper/css"
import classes from './ProjectedHarvest.module.scss'

import HarvestCard from "../HarvestCard"

const ProjectedHarvest = ({ fields }) => {
  // SANITY FIELDS
  const { title, harvestList } = fields
  const months = []
  harvestList.forEach((harvest) => {
    harvest.months.forEach((month) => {
        months.push(month)
    })
  })

  const uniqueMonths = months.filter((value, index, self) =>
    index === self.findIndex((t) => (
        t.title === value.title && t.month === value.month
    ))
   )

  // STATE
  const [activeTab, setActiveTab] = useState(uniqueMonths[0])
  
  // METHODS
  const findFilteredFish = (monthTitle) => {
    let foundMonth = uniqueMonths.find((month) => {
        return month.title === monthTitle
    })
    setActiveTab(foundMonth)
  }

  // RENDER
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
                    className={`${classes['harvest__tabs-swiper']}`}
                >
                {uniqueMonths.map((month) => {
                    return (
                        <SwiperSlide className={classes['harvest__tab']} key={month._id}>
                            <button onClick={() => findFilteredFish(month.title)} className={`${classes['harvest__tab']} heading--tab ${activeTab.title === month.title ? classes['active'] : ""}`}>
                                {month.title}
                            </button>
                        </SwiperSlide>
                    )
                })}
                </Swiper>

                {harvestList && harvestList.map((harvest) => {
                    return (
                        <div className={`${classes['harvest__list']}`}>
                            <div className="container">
                                {harvest.title && <h4>{harvest.title}</h4>}
                                <div className={`${classes['harvest__fish-list']}`}>
                                    {harvest.months.filter(month => month.title === activeTab.title)[0]?.fishArray.map((fish) => {
                                        return(
                                            <div className={`${classes['harvest__card']} ${classes['projected-card']}`}>
                                                <HarvestCard key={fish._key} fish={fish} cardStyle={'projected-card'} />
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
