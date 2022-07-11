import { ProductJsonLd } from 'next-seo';
import { useRouter } from 'next/router'
import { stripHtml } from "string-strip-html"

const ProductSD = ({ data }) => {

  const router = useRouter()
  const product = data.content
  const { variants } = data
  const { title, description } = product
  const url = `${process.env.NEXT_PUBLIC_MYSHOPIFY_DOMAIN}/${router.asPath}`
  const images = product.media.map(image => {
    return {
      url: image.src,
    }
  })

  return (
    <ProductJsonLd
      productName={title}
      images={images}
      description={ description ? stripHtml(description).result : null}
      brand="Sitka Salmon Shares"
      // aggregateRating={{
      //   ratingValue: '4.4',
      //   reviewCount: '89',
      // }}
      offers={variants.map(variant => {
        return {
          price: variant.price.toFixed(2),
          priceCurrency: 'USD',
          availability: (variant.availableForSale) ? 'InStock' :  'OutOfStock',
          url
        }
      })}
    />
  )
};

export default ProductSD;