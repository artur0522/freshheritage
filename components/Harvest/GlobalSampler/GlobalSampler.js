import React, { useState, useEffect } from 'react'
import Image from 'next/image'

import "swiper/css"
import classes from './GlobalSampler.module.scss'

import HarvestCard from "../HarvestCard"

const GlobalSampler = ({ fields }) => {
    console.log(fields)
  const {header, description, harvestList, illustration, illustration_2, alt, alt2 } = fields
  const [currentMonth, setCurrentMonth] = useState(null)
  const harvestListMonths = harvestList[0].months

  useEffect(() => {
     // make reusable
    const month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]
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
                        width={325}
                        height={549}
                        alt={alt}
                    />
                </div>
            </div>}

            {illustration_2 && <div className={`${classes['harvest__illustration']} ${classes['illustration-2']}`}>
                <div className={classes['harvest__illustration-img']}>
                    <Image
                        src={illustration_2.asset.url}
                        width={587}
                        height={440}
                        alt={alt2}
                    />
                </div>
            </div>}

            <div className="container">
                <div className={`${classes['harvest__text']}`}>
                    {header && <h1>{header}</h1>}
                    {description && <h2>{description}</h2>}
                    <button className="btn salmon">Learn More</button>
                </div>

                <div className={`${classes['harvest__fish-list']}`}>
                    {harvestListMonths && harvestListMonths.filter((harvestList) => harvestList.month.trim().toLowerCase() === currentMonth)[0]?.fishArray.map((fish) => {
                        return (
                            <div className={classes['harvest__card']} key={fish._key}>
                                <HarvestCard fish={fish} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    </div>
  )
}

export default GlobalSampler
