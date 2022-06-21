import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { stripHtml } from "string-strip-html"

/*
 requied: seo from sanity or product/collection from shopify
*/

const PageSEO = ({ seo, images = [], product, collection }) => {

  if (!seo && !product && !collection) {
    return ''
  }

  const router = useRouter()
  const url = `${process.env.NEXT_PUBLIC_MYSHOPIFY_DOMAIN}/${router.pathname}`

  if (seo?.shareGraphic) {
    images.push({
      url: seo.shareGraphic.asset.url,
      alt: seo.shareGraphic.asset.alt || seo.metaTitle
    })
  }

  if (product) {
    const { title, description } = product.content
    const images = product.content.media.map(image => {
      return {
        url: image.src,
        alt: image.alt || title
      }
    })
    seo = {
      metaTitle: title,
      metaDesc: stripHtml(description).result,
      shareTitle: title,
      shareDesc: stripHtml(description).result,
      images
    }
  }

  if (collection) {
    const { title, description } = collection.content
    seo = {
      metaTitle: title,
      metaDesc: stripHtml(description).result,
      shareTitle: title,
      shareDesc: stripHtml(description).result,
      images: []
    }
  }

  const openGraphImages = images.map(image => {
    return {
      url: image.url,
      width: 1200,
      height: 630,
      alt: image.alt,
      type: 'image/jpeg',
    }
  })

  return (
    <NextSeo
      title={seo.metaTitle}
      description={seo.metaDesc}
      openGraph={{
        url: url,
        title: seo.shareTitle,
        description: seo.shareDesc,
        images: openGraphImages,
        site_name: 'Sitka Salmon Shares',
      }}
    />
  )
}

export default PageSEO