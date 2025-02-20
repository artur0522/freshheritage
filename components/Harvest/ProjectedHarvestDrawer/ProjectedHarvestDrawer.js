import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import "swiper/css"
import classes from './ProjectedHarvestDrawer.module.scss'

import HarvestCard from "../HarvestCard"

const ProjectedHarvestDrawer = ({ title, harvestList, currentSelling }) => {

    // STATE
    const [harvestListMonths, setHarvestListMonths] = useState([])
    const [activeTab, setActiveTab] = useState({})
    const [currentDate, setCurrentDate] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(null)

    useEffect(() => {
        // TABS BY MONTH
        const months = []
        harvestList.forEach((harvest) => {
            harvest.months.forEach((month) => {
                if(month.fishArray.length > 0) {
                    months.push({...month, month: month.month.trim().toLowerCase()})
                }
            })
        })

        // REMOVE DUPLICATE MONTHS
        const refinedMonths = months.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.month === value.month
            ))
        )

        // make reusable
        const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
        const date = new Date()
        const monthName = monthNames[date.getMonth()]
        const currentMonthIndex = refinedMonths.findIndex(refinedMonth => refinedMonth.month === monthName)
        const splicedMonths = refinedMonths.splice(currentMonthIndex, 4)

        setCurrentDate(date.toISOString().split('T')[0])
        setCurrentMonth(monthName)
        setActiveTab(splicedMonths[0])
        setHarvestListMonths(splicedMonths)
    }, [harvestList])

    // METHODS
    const findFilteredFish = (harvestMonth) => {
        let foundMonth = harvestListMonths.find((month) => {
            return month.month.trim().toLowerCase() === harvestMonth
        })
        setActiveTab(foundMonth)
    }

    // RENDER
    return (
        <div className={`${classes['harvest']}`}>
            <div className={classes['harvest__inner']}>
                <div className={`${classes['harvest__content']}`}>
                    <div className={`${classes['harvest__header']}`}>
                        {title && <h4>{title}</h4>}
                    </div>
                    <Swiper
                        slidesPerView={"auto"}
                        spaceBetween={18}
                        threshold={15}
                        breakpoints={{
                            768: {
                                spaceBetween: 60
                            }
                        }}
                        className={`${classes['harvest__tabs-swiper']}`}
                    >
                    {harvestListMonths.map((month) => {

                        return (
                            <SwiperSlide className={classes['harvest__tab']} key={month._id}>
                                <button onClick={() => findFilteredFish(month.month.trim().toLowerCase())} className={`${classes['harvest__tab']} heading--tab ${activeTab.month === month.month.trim().toLowerCase() ? classes['active'] : ""} capitalize`}>
                                    {month.month} {month.year} {currentMonth === month.month.trim().toLowerCase()  ? '(Shipping Now!)' : ' '}
                                </button>
                            </SwiperSlide>
                        )
                    })}
                    </Swiper>

                    {!currentSelling && harvestList && harvestList.map((harvest, index) => {
                        return (
                            <div className={`${classes['harvest__list']}`} key={index}>
                                {harvestList.length > 1 && harvest.months.filter(month => activeTab.month === month.month.trim().toLowerCase())[0]?.fishArray.length > 0 && <h4 className={classes['harvest__list-title']}>{harvest.variantTitle}</h4>}
                                <div className={`${classes['harvest__fish-list']}`}>
                                    {harvest.months.filter(month => activeTab.month === month.month.trim().toLowerCase())[0]?.fishArray.map((fish) => {
                                        return (
                                            <div className={`${classes['harvest__card']} ${classes['projected-card']}`} key={fish._key}>
                                                <HarvestCard fish={fish} cardStyle={'projected-card'} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}

                    {currentSelling && harvestList && harvestList.map((harvest) => {
                        return (
                            <div className={`${classes['harvest__list']}`} key={harvest._id}>
                                {harvestList.length > 1 && activeTab.month === currentMonth && harvest.months.filter(month => currentDate >= month.sellStart && currentDate <= month.sellEnd)[0]?.fishArray.length > 0 && <h4 className={classes['harvest__list-title']}>{harvest.variantTitle}</h4>}
                                {harvestList.length > 1 && activeTab.month !== currentMonth && harvest.months.filter(month => activeTab.month === month.month.trim().toLowerCase())[0]?.fishArray.length > 0 && <h4 className={classes['harvest__list-title']}>{harvest.variantTitle}</h4>}
                                <div className={`${classes['harvest__fish-list']}`}>
                                    {activeTab.month === currentMonth && harvest.months.filter(month => currentDate >= month.sellStart && currentDate <= month.sellEnd)[0]?.fishArray.map((fish) => {
                                        return (
                                            <div className={`${classes['harvest__card']} ${classes['projected-card']}`} key={fish._key}>
                                                <HarvestCard fish={fish} cardStyle={'projected-card'} />
                                            </div>
                                        )
                                    })}
                                    {activeTab.month !== currentMonth && harvest.months.filter(month => activeTab.month === month.month.trim().toLowerCase())[0]?.fishArray.map((fish) => {
                                        return (
                                            <div className={`${classes['harvest__card']} ${classes['projected-card']}`} key={fish._key}>
                                                <HarvestCard fish={fish} cardStyle={'projected-card'} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ProjectedHarvestDrawer
