import { BreadcrumbJsonLd } from 'next-seo'
import { useRouter } from 'next/router'

const Breadcrumb = () => {
  const router = useRouter()

  const ignoreFirstPaths = [
    'pages',
    'account',
    'product',
    'collections',
  ]

  let urlPathArray = router.asPath.split('/').slice(1)

  let itemListElements = urlPathArray.map((item, index) => {
    const path = urlPathArray.filter((_, itemIndex) => itemIndex <= index).join('/')
    const url = `${process.env.NEXT_PUBLIC_DOMAIN}/${path}`
    return {
      position: index + 1,
      name: item,
      item: url
    }
  })

  if (ignoreFirstPaths.includes(urlPathArray[0])) {
    itemListElements = itemListElements.slice(1)
    itemListElements = itemListElements.map((item, index) => {
      return {
        ...item,
        position: index + 1
      }
    })
  }

  return (
    <BreadcrumbJsonLd
      itemListElements={itemListElements}
    />
  );
};

export default Breadcrumb;