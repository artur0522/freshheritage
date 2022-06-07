import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import "swiper/css"
import classes from './ProjectedHarvest.module.scss'

import HarvestCard from "../HarvestCard"

const ProjectedHarvest = ({ fields }) => {
    // SANITY FIELDS
    const { title, harvestList, currentSelling } = fields
    // STATE
    const [harvestListMonths, setHarvestListMonths] = useState([])
    const [activeTab, setActiveTab] = useState({})
    const [currentDate, setCurrentDate] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        // TABS BY MONTH
        const months = []
        harvestList.forEach((harvest) => {
            harvest.months.forEach((month) => {
                if(month.fishArray.length > 0) {
                    months.push(month)
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
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const date = new Date()
        const monthName = monthNames[date.getMonth()]
        const currentMonthIndex = refinedMonths.findIndex(refinedMonth => refinedMonth.month === monthName)
        const splicedMonths = refinedMonths.splice(currentMonthIndex)
        
        setCurrentDate(date.toISOString().split('T')[0])
        setCurrentMonth(monthName.toLowerCase())
        setActiveTab(splicedMonths[0])
        setHarvestListMonths(splicedMonths)
        setMounted(true)
    }, [])

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
                    {harvestListMonths.map((month) => {
                        return (
                            <SwiperSlide className={classes['harvest__tab']} key={month._id}>
                                <button onClick={() => findFilteredFish(month.month.trim().toLowerCase())} className={`${classes['harvest__tab']} heading--tab ${activeTab.month.trim().toLowerCase() === month.month.trim().toLowerCase() ? classes['active'] : ""}`}>
                                    {month.month} {month.year} {currentMonth === month.month.trim().toLowerCase()  ? '(Shipping Now!)' : ' '}
                                </button>
                            </SwiperSlide>
                        )
                    })}
                    </Swiper>

                    {harvestList && !currentSelling && harvestList.map((harvest) => {
                        return (
                            <div className={`${classes['harvest__list']}`} key={harvest._id}>
                                <div className="container">
                                    {harvest.months.filter(month => activeTab.month === month.month)[0]?.fishArray.length > 0 && <h4 className={classes['harvest__list-title']}>{harvest.header}</h4>}
                                    <div className={`${classes['harvest__fish-list']}`}>
                                        {mounted && harvest.months.filter(month => activeTab.month === month.month)[0]?.fishArray.map((fish) => {
                                            return (
                                                <div className={`${classes['harvest__card']}`} key={fish._key}>
                                                    <HarvestCard fish={fish} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                
                    {harvestList && currentSelling && harvestList.map((harvest) => {
                        return (
                            <div className={`${classes['harvest__list']}`} key={harvest._id}>
                                <div className="container">
                                    {activeTab.month?.trim().toLowerCase() === currentMonth && harvest.months.filter(month => currentDate >= month.sellStart && currentDate <= month.sellEnd)[0]?.fishArray.length > 0 && <h4 className={classes['harvest__list-title']}>{harvest.header}</h4>}
                                    {activeTab.month?.trim().toLowerCase() !== currentMonth && harvest.months.filter(month => activeTab.month === month.month)[0]?.fishArray.length > 0 && <h4 className={classes['harvest__list-title']}>{harvest.header}</h4>}
                                    <div className={`${classes['harvest__fish-list']}`}>
                                        {mounted && activeTab.month.trim().toLowerCase() === currentMonth && harvest.months.filter(month => currentDate >= month.sellStart && currentDate <= month.sellEnd)[0]?.fishArray.map((fish) => {
                                            return (
                                                <div className={`${classes['harvest__card']}`} key={fish._key}>
                                                    <HarvestCard fish={fish} />
                                                </div>
                                            )
                                        })}
                                        {mounted && activeTab.month.trim().toLowerCase() !== currentMonth && harvest.months.filter(month => activeTab.month === month.month)[0]?.fishArray.map((fish) => {
                                            return (
                                                <div className={`${classes['harvest__card']}`} key={fish._key}>
                                                    <HarvestCard fish={fish} />
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
