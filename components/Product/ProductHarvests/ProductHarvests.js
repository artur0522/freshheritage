import { useState, useEffect } from 'react'
import { nacelleClient } from 'services'
import ProjectedHarvestDrawer from '@/components/Harvest/ProjectedHarvestDrawer'

const ProductHarvests = ({product}) => {
  const [harvests, setHarvests] = useState([])


  useEffect(() => {
    async function getHarvest() {
      const harvestsInfo = await product.variants.reduce(async (carry, variant) => {
        let promises = await carry;

        const getHarvestInfo = async (item) => {
          if (item.metafields.some(metafield => metafield.key === 'harvest_handle')) {
            const harvestHandle = item.metafields.find(metafield => metafield.key === 'harvest_handle').value;
            const harvestContent = await nacelleClient.content({
              handles: [harvestHandle],
              type: 'harvest'
            })
            if (harvestContent) {
              promises.push({
                ...harvestContent[0].fields,
                variantTitle: variant.content?.title,
              })
              return promises
            }
          }
        }

        // check if variant has metafield
        const variantHasMetafield = await getHarvestInfo(variant)
        if (variantHasMetafield) return variantHasMetafield

        // check if product has metafield
        const productHasMetafield = await getHarvestInfo(product)
        if (productHasMetafield) return productHasMetafield

        return promises
      }, Promise.resolve([]))

      console.log("harvestsInfo:", harvestsInfo)

      setHarvests(harvestsInfo)
    }
    getHarvest()
  }, [product.variants])

  if (harvests.length === 0) {
    return ''
  }

  return <ProjectedHarvestDrawer title="Projected Harvest" harvestList={harvests} />
}

export default ProductHarvests