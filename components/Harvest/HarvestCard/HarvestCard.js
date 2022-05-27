import React, { useState } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'

import classes from './HarvestCard.module.scss'

const HarvestCard = ({ fish }) => {
  const [tabInfo, setTabInfo] = useState(fish['species'])

  const findTabInfo = (category) => {
    setTabInfo(fish[category])
  }

  return (
    <div className={classes['harvest__card']}>
        <div className={classes['harvest__card-img']}>
            <Image
                src={fish.species.image.asset.url}
                alt={fish.title}
                width={858}
                height={572}
            />
        </div>
        <div className={classes['harvest__card-tabs']}>
            <button onClick={() => findTabInfo('species')}>Species</button>
            <button onClick={() => findTabInfo('locations')}>Location</button>
            <button onClick={() => findTabInfo('fishermen')}>Caught By</button>
            <button onClick={() => findTabInfo('culinary')}>Culinary</button>
        </div>
        <div className={classes['harvest__card-content']}>
            {tabInfo.content && <PortableText value={tabInfo.content} />}
        </div>
    </div>
  )
}

export default HarvestCard
