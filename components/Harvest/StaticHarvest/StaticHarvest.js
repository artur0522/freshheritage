import Image from 'next/image'

import "swiper/css"
import classes from './StaticHarvest.module.scss'

import HarvestCard from "../HarvestCard"

import { useTheCatchContext } from '@/context/TheCatchContext'
import { useEffect, useState } from 'react'

const StaticHarvest = ({ fields }) => {
  const { header, description, harvestMonth, illustration, alt } = fields

  console.log(fields)

  const theCatchContext = useTheCatchContext()
  const { openDrawer, addPastIssues, addIssue } = theCatchContext

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    addPastIssues(fields?.list)
    addIssue(fields?.harvestMonth[0])
  }, [mounted])

  if(mounted && fields.harvestMonth?.length > 0) {
    return (
        <div className={`${classes['harvest']}`}>
            <div className={classes['harvest__inner']}>
                {fields?.list?.length > 0 && <button className={`${classes['btn']} secondary--body`} onClick={() => openDrawer()}>View Past Issues Of The Catch +</button>}

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
