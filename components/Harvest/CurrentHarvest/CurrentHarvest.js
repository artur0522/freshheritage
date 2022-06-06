import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

import "swiper/css"
import classes from './CurrentHarvest.module.scss'

import HarvestCard from "../HarvestCard"

// Used for both CURRENT SELLING HARVEST AND CURRENT MONTH HARVEST: _type inside of fields will dicate this
const CurrentHarvest = ({ fields }) => {
  const { header, description, harvestList, illustration, _type } = fields
  const [harvestListMonths, setHarvestListMonths] = useState(harvestList[0].months)
  const [activeTab, setActiveTab] = useState(harvestList[0])
  const [currentMonth, setCurrentMonth] = useState(null)
  const [currentYear, setCurrentYear] = useState(null)
  const [currentDate, setCurrentDate] = useState(null)

  useEffect(() => {
    // make reusable
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const date = new Date()
    const monthName = month[date.getMonth()]
    const year = date.getFullYear()

    // set current date to the same format as shown in sanity
    setCurrentDate(date.toISOString().split('T')[0])
    setCurrentMonth(monthName.toLowerCase())
    setCurrentYear(year)
  }, [])

  // Methods

   // make reusable
  const findFilteredFish = (harvestTitle) => {
    const foundHarvest = harvestList.find((harvest) => harvest.title === harvestTitle)
    setHarvestListMonths(foundHarvest.months)
    setActiveTab(foundHarvest)
  }
 
  const filteredHarvestListByCurrentMonth = harvestListMonths.filter(harvestList => currentMonth === harvestList.month.trim().toLowerCase())
  const foundHarvestsByDate = filteredHarvestListByCurrentMonth.filter(harvest => currentDate >= harvest.sellStart && currentDate <= harvest.sellEnd)

  return (
    <div className={`${classes['harvest']}`}>
        <div className={classes['harvest__inner']}>
            {illustration && <div className={`${classes['harvest__illustration']}`}>
                <div className={classes['harvest__illustration-img']}>
                    <Image
                        src={illustration.asset.url}
                        width={587}
                        height={440}
                    />
                </div>
            </div>}

            <div className={`${classes['harvest__content']}`}>
                <div className={`${classes['harvest__header']} container`}>
                    {header ? <h1>{header}</h1> : <h1>{`${currentMonth} ${currentYear} Harvest`}</h1>}
                    {description && <h3>{description}</h3>}
                </div>
                
                {harvestList.length >= 2 && <Swiper
                    slidesPerView={"auto"}
                    spaceBetween={36}
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
                </Swiper>}

                {_type === 'currentSellingHarvest' && foundHarvestsByDate && <div className={`${classes['harvest__fish-list']} container`}>
                    {foundHarvestsByDate && foundHarvestsByDate.map((harvest) => {
                        return (
                            harvest.fishArray.map((fish) => {
                                return (
                                    <div className={classes['harvest__card']} key={fish._key}>
                                        <HarvestCard fish={fish} />
                                    </div>
                                )
                            })
                        )
                    })}   
                </div>}

                {_type === 'currentMonthHarvest' && <div className={`${classes['harvest__fish-list']} container`}>
                    {harvestListMonths && harvestListMonths.filter((harvestList) => harvestList.month.trim().toLowerCase() === currentMonth)[0]?.fishArray.map((fish) => {
                        return (
                            <div className={classes['harvest__card']} key={fish._key}>
                                <HarvestCard fish={fish} />
                            </div>
                        )
                    })}
                </div>}
            </div>
        </div>
    </div>
  )
}

export default CurrentHarvest
