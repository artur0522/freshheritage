import React, { useState, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import Image from 'next/image'

import "swiper/css"
import classes from './StaticHarvest.module.scss'

import HarvestCard from "../HarvestCard"

// Used for both CURRENT SELLING HARVEST AND CURRENT MONTH HARVEST: _type inside of fields will dicate this
const StaticHarvest = ({ fields }) => {
  console.log('staticharvest', fields)
  const { header, description, harvestMonth, illustration, _type, alt } = fields
//   const [harvestListMonths, setHarvestListMonths] = useState(harvestList[0].months)
//   const [activeTab, setActiveTab] = useState(harvestList[0])
  
  useEffect(() => {
   
  }, [])

  return (
    <div className={`${classes['harvest']}`}>
        <div className={classes['harvest__inner']}>
            {illustration && <div className={`${classes['harvest__illustration']}`}>
                <div className={classes['harvest__illustration-img']}>
                    <Image
                        src={illustration.asset.url}
                        width={587}
                        height={440}
                        alt={alt}
                    />
                </div>
            </div>}

            <div className={`${classes['harvest__content']}`}>
                <div className={`${classes['harvest__header']} container`}>
                    {header ? <h1>{header}</h1> : <h1>{`${currentMonth} ${currentYear} Harvest`}</h1>}
                    {description && <h3>{description}</h3>}
                </div>

                {harvestMonth && <div className={`${classes['harvest__fish-list']} container`}>
                    {harvestMonth[0].fishArray.map((fish) => {
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

export default StaticHarvest
