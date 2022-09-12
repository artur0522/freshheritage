import React from 'react'

import FullBleedHero from '@/components/Sections/FullBleedHero'
import SplitHero from '@/components/Sections/SplitHero'

const DynamicHero = ({ fields }) => {
  const { heroType, fullBleedHero, splitHero } = fields

  if(heroType === 'hero--full') {
    return <FullBleedHero imagePriority={true} fields={fullBleedHero} />
  } else  {
    return <SplitHero imagePriority={true} fields={splitHero} />
  }
}

export default DynamicHero
