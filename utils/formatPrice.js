export const formatPrice = (price, showTrailingZeroes = false) => {
  if ((price / 100) % 1 === 0 && !showTrailingZeroes) {
    return (price / 100).toFixed(0)
  }
  return (price / 100).toFixed(2)
}