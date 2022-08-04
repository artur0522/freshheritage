import { nacelleClient } from 'services'

export async function getHarvests({product, returnHarvestHandle}) {
  const harvestsInfo = await product.variants.reduce(async (carry, variant) => {
    let promises = await carry;

    const getHarvestInfo = async (item) => {
      if (item.metafields.some(metafield => metafield.key === 'harvest_handle')) {
        const harvestHandle = item.metafields.find(metafield => metafield.key === 'harvest_handle').value;
        if (returnHarvestHandle) {
          promises.push(harvestHandle)
          return promises
        }
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

  return harvestsInfo
}