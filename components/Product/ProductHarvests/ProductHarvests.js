import { useState, useEffect } from 'react'
import { nacelleClient } from 'services'
import ProjectedHarvestDrawer from '@/components/Harvest/ProjectedHarvestDrawer'

const ProductHarvests = ({product}) => {
  const [harvests, setHarvests] = useState([])

  useEffect(() => {
    async function getHarvest() {
      const harvestsInfo = await product.variants.reduce(async (carry, variant) => {
        let promises = await carry;
        if (variant.metafields.some(metafield => metafield.key === 'harvest_handle')) {
          const harvestHandle = variant.metafields.find(metafield => metafield.key === 'harvest_handle').value;
          const harvestContent = await nacelleClient.content({
            handles: [harvestHandle],
            type: 'harvest'
          })
          if (harvestContent) {
            promises.push({
              ...harvestContent[0].fields,
              variantTitle: variant.content.title,
            })
            return promises
          }
        }
        return promises
      }, Promise.resolve([]))
      setHarvests(harvestsInfo)
    }
    getHarvest()
  }, [])

  if (harvests.length === 0) {
    return ''
  }

  return <ProjectedHarvestDrawer title="Projected Harvest" harvestList={harvests} />
}

export default ProductHarvests