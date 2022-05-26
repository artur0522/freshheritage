import React, { useState } from 'react'

import classes from './Harvest.module.scss'

import HarvestCard from "../HarvestCard"

const Harvest = ({ fields }) => {
  const { title, description, months  } = fields.harvestList[0]
  const { tabs } = months[0]
  const [fishList, setFishList] = useState(tabs[0].fishArray)

  const findFilteredFish = (tabTitle) => {
    const foundTab = tabs.find((tab) => tab.title === tabTitle)
    setFishList(foundTab.fishArray)
  }

  return (
    <div className={`${classes['harvest']}`}>
        {title && <h1>{title}</h1>}
        {description && <h3>{description}</h3>}
        {tabs && tabs.map((tab) => <button onClick={() => findFilteredFish(tab.title)} className="heading--tab">{tab.title}</button>)}

        {fishList && fishList.map((fish) => {
            return (
               <HarvestCard key={fish._key} fish={fish} />
            )
        })}
    </div>
  )
}

export default Harvest
