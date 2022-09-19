// needed because Nacelle is displaying incorrect weight and they haven't been able to fix it before launch

export const formatWeight = (weight) => {
  if (weight % 1 === 0) {
    return weight
  }
  return weight.toFixed(1)
}