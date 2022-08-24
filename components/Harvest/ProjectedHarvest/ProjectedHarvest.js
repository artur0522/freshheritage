import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

import "swiper/css"
import classes from './ProjectedHarvest.module.scss'

import HarvestCard from "../HarvestCard"

const ProjectedHarvest = ({ fields, disableHarvestFilters = false }) => {

    // SANITY FIELDS
    const { title, harvestList, currentSelling, description } = fields
    // STATE
    const [harvests, setHarvests] = useState(harvestList)
    const [harvestListMonths, setHarvestListMonths] = useState([])
    const [activeTab, setActiveTab] = useState({})
    const [activeHarvest, setActiveHarvest] = useState(harvestList[0])
    const [currentDate, setCurrentDate] = useState(null)
    const [currentMonth, setCurrentMonth] = useState(null)

    useEffect(() => {
        // TABS BY MONTH
        const months = []
        harvestList?.forEach((harvest) => {
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

        const refinedArr = harvestList.filter(harvest => harvest.handle.current === harvestList[0].handle.current)
        setHarvests(refinedArr)
    }, [harvestList])

    // METHODS
    const findFilteredFish = (harvestMonth) => {
        let foundMonth = harvestListMonths.find((month) => {
            return month.month.trim().toLowerCase() === harvestMonth
        })
        setActiveTab(foundMonth)
    }

    const filterHarvests = (harvestHandle) => {
        const filteredArr = harvestList.filter(harvest => harvest.handle.current === harvestHandle)
        const foundHarvest = harvestList.find(harvest => harvest.handle.current === harvestHandle)
        setActiveHarvest(foundHarvest)
        setHarvests(filteredArr)
    }

    // RENDER
    return (
        <div className={`${classes['harvest']}`}>
            <div className={classes['harvest__inner']}>
                <div className={`${classes['harvest__content']}`}>
                    <div className={`${classes['harvest__header']} container`}>
                        {title && <h4 className="h1">{title}</h4>}
                        {description && <h5>{description}</h5>}
                    </div>

                    {harvestList.length > 1 && !disableHarvestFilters && <Swiper
                        slidesPerView={"auto"}
                        spaceBetween={18}
                        breakpoints={{
                            768: {
                                spaceBetween: 23
                            }
                        }}
                        className={`${classes['active-harvest__swiper']}`}
                    >
                    {harvestList.map((harvest) => {
                        return (
                            <SwiperSlide className={classes['harvest__tab']} key={`${harvest.title}--${harvest.id}`}>
                                <button onClick={() => filterHarvests(harvest.handle.current)} className={`${classes['harvest__tab-btn']} ${activeHarvest.handle.current === harvest.handle.current ? classes['active'] : ""} heading--tab capitalize`}>
                                   {harvest.title}
                                </button>
                            </SwiperSlide>
                        )
                    })}
                    </Swiper>}

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
                    {harvestListMonths.map((month, index) => {

                        return (
                            <SwiperSlide className={classes['harvest__tab']} key={`${index}-${month._id}`}>
                                <button onClick={() => findFilteredFish(month.month.trim().toLowerCase())} className={`${classes['harvest__tab-btn']} heading--tab ${activeTab.month === month.month.trim().toLowerCase() ? classes['active'] : ""} capitalize`}>
                                    {month.month} {month.year} {currentMonth === month.month.trim().toLowerCase()  ? '(Shipping Now!)' : ' '}
                                </button>
                            </SwiperSlide>
                        )
                    })}
                    </Swiper>

                    {!currentSelling && harvests && harvests.map((harvest) => {
                        return (
                            <div className={`${classes['harvest__list']}`} key={harvest._id}>
                                <div className="container">
                                    {harvestList.length > 1 && harvest.months.filter(month => activeTab.month === month.month.trim().toLowerCase())[0]?.fishArray.length > 0 && <h4 className={classes['harvest__list-title']}>{harvest.header}</h4>}
                                    <div className={`${classes['harvest__fish-list']}`}>
                                        {harvest.months.filter(month => activeTab.month === month.month.trim().toLowerCase())[0]?.fishArray.map((fish) => {
                                            console.log("fish:", fish)
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

                    {currentSelling && harvests && harvests.map((harvest) => {
                        return (
                            <div className={`${classes['harvest__list']}`} key={harvest._id}>
                                <div className="container">
                                    {harvestList.length > 1 && activeTab.month === currentMonth && harvest.months.filter(month => currentDate >= month.sellStart && currentDate <= month.sellEnd)[0]?.fishArray.length > 0 && <h4 className={classes['harvest__list-title']}>{harvest.header}</h4>}
                                    {harvestList.length > 1 && activeTab.month !== currentMonth && harvest.months.filter(month => activeTab.month === month.month.trim().toLowerCase())[0]?.fishArray.length > 0 && <h4 className={classes['harvest__list-title']}>{harvest.header}</h4>}
                                    <div className={`${classes['harvest__fish-list']}`}>
                                        {activeTab.month === currentMonth && harvest.months.filter(month => currentDate >= month.sellStart && currentDate <= month.sellEnd)[0]?.fishArray.map((fish) => {
                                            return (
                                                <div className={`${classes['harvest__card']}`} key={fish._key}>
                                                    <HarvestCard fish={fish} />
                                                </div>
                                            )
                                        })}
                                        {activeTab.month !== currentMonth && harvest.months.filter(month => activeTab.month === month.month.trim().toLowerCase())[0]?.fishArray.map((fish) => {
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
