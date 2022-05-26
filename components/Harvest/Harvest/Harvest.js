import React, { useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import Link from 'next/link'

import classes from './Harvest.module.scss'

import HarvestCard from "../HarvestCard"

const Harvest = ({ fields }) => {
  console.log(fields)
  const { title, description, months  } = fields.harvestList[0]
  const { tabs } = months[0]
  const [fishList, setFishList] = useState(tabs[0].fishArray)

  return (
    <div className={`${classes['harvest']}`}>
        {title && <h1>{title}</h1>}
        {description && <h3>{description}</h3>}
        {tabs && tabs.map((tab) => <h3 className="heading--tab">{tab.title}</h3>)}

        {fishList && fishList.map((fish) => {
            return (
               <HarvestCard key={fish._key} fish={fish} />
            )
        })}
    </div>
  )
}

export default Harvest
