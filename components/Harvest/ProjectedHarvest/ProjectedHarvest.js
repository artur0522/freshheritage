import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

import "swiper/css"
import classes from './ProjectedHarvest.module.scss'

import HarvestCard from "../HarvestCard"

const ProjectedHarvest = ({ fields }) => {
  // SANITY FIELDS
  const { title, harvestList } = fields

    // STATE
    const [months, setMonths] = useState([])
    const [activeTab, setActiveTab] = useState({})
    const [currentMonth, setCurrentMonth] = useState(null)

  useEffect(() => {
    // TABS BY MONTH
    const months = []
    harvestList.forEach((harvest) => {
        harvest.months.forEach((month) => {
            months.push(month)
        })
    })
    // REMOVE DUPLICATE MONTHS
    const uniqueMonths = months.filter((value, index, self) =>
        index === self.findIndex((t) => (
        t.month === value.month
        ))
    )
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const date = new Date()
    const monthName = month[date.getMonth()]
    const currentMonthIndex = uniqueMonths.findIndex(month => month.month === monthName)
    const splicedMonths = uniqueMonths.splice(currentMonthIndex)

    setActiveTab(splicedMonths[0])
    setMonths(splicedMonths)
    setCurrentMonth(monthName)
  }, [])
  
  // METHODS
  const findFilteredFish = (harvestMonth) => {
    let foundMonth = months.find((month) => {
        return month.month === harvestMonth
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
                {months.map((month) => {
                    return (
                        <SwiperSlide className={classes['harvest__tab']} key={month._id}>
                            <button onClick={() => findFilteredFish(month.month)} className={`${classes['harvest__tab']} heading--tab ${activeTab.month === month.month ? classes['active'] : ""}`}>
                                {month.month} {month.year}
                            </button>
                        </SwiperSlide>
                    )
                })}
                </Swiper>

                {harvestList && harvestList.map((harvest) => {
                    return (
                        <div className={`${classes['harvest__list']}`}>
                            <div className="container">
                                {harvest.title && <h4 className={classes['harvest__list-title']}>{harvest.title}</h4>}
                                <div className={`${classes['harvest__fish-list']}`}>
                                    {harvest.months.filter(month => month.month === activeTab?.month)[0]?.fishArray.map((fish) => {
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
