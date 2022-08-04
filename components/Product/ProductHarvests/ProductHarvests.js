import { useState, useEffect } from 'react'
import ProjectedHarvestDrawer from '@/components/Harvest/ProjectedHarvestDrawer'
import { getHarvests } from '@/utils/getHarvests'

const ProductHarvests = ({product}) => {
  const [harvests, setHarvests] = useState([])

  useEffect(() => {
    getHarvests({product})
      .then(res => {
        setHarvests(res)
      })
  }, [product.variants])

  if (harvests.length === 0) {
    return ''
  }

  return <ProjectedHarvestDrawer title="Projected Harvest" harvestList={harvests} />
}

export default ProductHarvests