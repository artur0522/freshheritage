export const getMetafield = ({product, selectedVariant, key}) => {
  if (selectedVariant && selectedVariant.metafields.some(metafield => metafield.key === key)) {
    return selectedVariant.metafields.find(metafield => metafield.key === key)
  }
  return product.metafields.find(metafield => metafield.key === key)
}