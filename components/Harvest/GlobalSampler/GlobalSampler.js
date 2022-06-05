import React, { useState, useEffect } from 'react'
import Image from 'next/image'

import "swiper/css"
import classes from './GlobalSampler.module.scss'

import HarvestCard from "../HarvestCard"

const GlobalSampler = ({ fields }) => {
  const {header, description, harvestList, illustration, illustration_2 } = fields
  const [currentMonth, setCurrentMonth] = useState(null)
  const harvestListMonths = harvestList[0].months

  useEffect(() => {
     // make reusable
    const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const date = new Date()
    const monthName = month[date.getMonth()]

    setCurrentMonth(monthName.toLowerCase())
  }, [])

  return (
    <div className={`${classes['harvest']}`}>
        <div className={`${classes['harvest__inner']}`}>
            {illustration && <div className={`${classes['harvest__illustration']} ${classes['illustration-1']}`}>
                <div className={classes['harvest__illustration-img']}>
                    <Image
                        src={illustration.asset.url}
                        width={1009}
                        height={757}
                    />
                </div>
            </div>}

            {illustration_2 && <div className={`${classes['harvest__illustration']} ${classes['illustration-2']}`}>
                <div className={classes['harvest__illustration-img']}>
                    <Image
                        src={illustration_2.asset.url}
                        width={587}
                        height={440}
                    />
                </div>
            </div>}

            <div className={`${classes['harvest__text']} container`}>
                {header && <h1>{header}</h1>}
                {description && <h2>{description}</h2>}
                <button className="btn salmon">Learn More</button>
            </div>

            <div className={`${classes['harvest__fish-list']} container`}>
                {harvestListMonths && harvestListMonths.filter((harvestList) => harvestList.month.trim().toLowerCase() === currentMonth)[0]?.fishArray.map((fish) => {
                    return (
                        <div className={classes['harvest__card']}>
                            <HarvestCard key={fish._key} fish={fish} />
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default GlobalSampler
