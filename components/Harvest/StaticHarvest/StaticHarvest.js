import Image from 'next/image'

import "swiper/css"
import classes from './StaticHarvest.module.scss'

import HarvestCard from "../HarvestCard"

import { useTheCatchContext } from '@/context/TheCatchContext'
import { useEffect, useState } from 'react'

const StaticHarvest = ({ fields }) => {
  const { header, description, harvestMonth, illustration, alt } = fields

  const theCatchContext = useTheCatchContext()
  const { openDrawer, filteredIssue } = theCatchContext

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

<<<<<<< HEAD
<<<<<<< HEAD
  if(mounted && fields?.harvestMonth[0]?.month === filteredIssue?.harvestMonth[0]?.month) {
=======
  if(mounted && fields.harvestMonth.length && fields.harvestMonth[0].month === filteredIssue.harvestMonth[0].month) {
>>>>>>> origin/main
=======
  if(mounted && fields.harvestMonth.length && fields.harvestMonth[0].month === filteredIssue.harvestMonth[0].month) {
>>>>>>> 3a2c3a3701a2bcdd2d32c1601cb91a2c0eb0de7d
    return (
        <div className={`${classes['harvest']}`}>
            <div className={classes['harvest__inner']}>
                <button className={`${classes['btn']} secondary--body`} onClick={() => openDrawer()}>View Past Issues Of The Catch +</button>

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
  } else {
    return null
  }
}

export default StaticHarvest
