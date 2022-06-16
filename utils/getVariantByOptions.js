// returns variant based on frequency option selected
 // @param purchaseFlowOptions required if finding variant for premium seafood subscription box which has hardcoded logic

export const getVariantByOptions = ({variants, matchOptionValue, purchaseFlowOptions}) => {
  return variants.find(variant => {
    // hardcoded logic to find variant for premium seafood box if shellfish free is selected
    if (purchaseFlowOptions && purchaseFlowOptions.productHandle === 'premium-seafood-subscription-box') {
      const shellFishOptionValue = purchaseFlowOptions.shellfish_free_selected ? 'no shellfish' : 'shellfish';
      return variant.content.selectedOptions.filter(option => option.value === matchOptionValue || option.value === shellFishOptionValue).length >= 2
    }
    return variant.content.selectedOptions.some(option => option.value === matchOptionValue)
  })
}