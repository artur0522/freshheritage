import { useState, useEffect } from 'react'
import ProjectedHarvestDrawer from '@/components/Harvest/ProjectedHarvestDrawer'
import { getHarvests } from '@/utils/getHarvests'
import LoadingState from '@/components/LoadingState'

const ProductHarvests = ({product}) => {
  const [harvests, setHarvests] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getHarvests({product})
      .then(res => {
        setIsLoading(false)
        setHarvests(res)
      })
  }, [product.variants])


  if (isLoading) {
    return <LoadingState />
  }

  if (harvests.length === 0) {
    return ''
  }

  return <ProjectedHarvestDrawer title="Projected Harvest" harvestList={harvests} />
}

export default ProductHarvests