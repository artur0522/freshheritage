export const getBackNavigationInfo = (router) => {
  let urlPathArray = router.asPath.split('/').slice(0, -1)
  const goBackUrl = urlPathArray.join('/')
  const goBackTitle = urlPathArray[urlPathArray.length - 1].replace(/-/g, ' ')

  return {
    url: goBackUrl,
    title: goBackTitle
  }
}
