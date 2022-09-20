import { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive'
import Image from "next/image";
import ResponsiveImage from "@/components/ResponsiveImage";
import classes from "./ProductCard.module.scss";
import { useRouter } from 'next/router'
import { dataLayerSelectProduct } from "@/utils/dataLayer";
import { formatPrice } from "@/utils/formatPrice";
import { formatWeight } from "@/utils/formatWeight";
import useSWR from 'swr'
import axios from 'axios'

// setup inventory fetcher
const fetchInventory = (url, productHandle) => {
  return axios
     .get(url, {
       params: {
         productHandle: productHandle,
       },
     })
   .then((res) => res.data)
 };

const articleCardImgLoader = ({ src, width }) => {
  return `${src}?w=690`
}

function ProductCard({ product, responsive = false }) {

  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const isMobile =  useMediaQuery({ query: '(max-width: 430px)' })
  const isDesktop = useMediaQuery({query: '(min-width: 430px)'})
  const [isAvailable, setIsAvailable] = useState(product.availableForSale)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])

  useEffect(() => {
    setMounted(true)
  }, [])

  const includesMetafield = product.metafields.find(metafield => metafield.key === 'includes')
  const shortDescriptionMetafield = product.metafields.find(metafield => metafield.key === 'short_description')
  const flagTag = product.tags.find(tag => tag.includes("Flag"))
  const splitFlagTag = flagTag?.split(":")[1]

  const handleLink = (product) => {
    dataLayerSelectProduct({product, url: router.pathname})
    router.push(`/products/${encodeURIComponent(product.content.handle)}`)
  }

  const buttonText = isAvailable ? 'View Details' : 'Sold Out'

  const { data: productInfoRevalidate } = useSWR(
    ['/api/product/available', product.content.handle],
    (url, id) => fetchInventory(url, id),
    {
      errorRetryCount: 3,
      refreshInterval: 5000
    }
  );

  useEffect(() => {
    if (productInfoRevalidate) {
      setIsAvailable(productInfoRevalidate.availableForSale)
      setSelectedVariant(productInfoRevalidate.variants[0])
    }
  }, [productInfoRevalidate]);

  return (
    product && (
      <div className={classes["card"]}>
        {splitFlagTag && <div className={`${classes['best-seller']} best-seller`}>{splitFlagTag}</div>}
        <div className={classes['card__inner']}>
        <a onClick={() => handleLink(product)} className={classes["media"]}>
          {product.content.featuredMedia && isMobile && mounted && (
            <Image
              src={product.content.featuredMedia.src}
              alt={product.content.featuredMedia.altText || product.content.title}
              width={590}
              height={432}
              className={classes.image}
              objectFit="cover"
            />
          )}
          {product.content.featuredMedia && isDesktop && mounted && (
            <Image
              src={product.content.featuredMedia.src}
              alt={product.content.featuredMedia.altText || product.content.title}
              width={688}
              height={543}
              className={classes.image}
              objectFit="cover"
            />
            )}
            {product.content.featuredMedia && responsive && mounted && (
              <ResponsiveImage
                loader={articleCardImgLoader}
                src={product.content.featuredMedia.src}
                alt={product.content.featuredMedia.altText || product.content.title}
                className={classes.image}
              />
            )}
          </a>

          <div className={classes["card__content"]}>
            {product.content.title && (
              <h4
                className={`${classes["title"]} heading--product-title uppercase`}
              >
                {product.content.title}
              </h4>
            )}

            <div className={classes["price-wrap"]}>
              <div className={classes["price"]}>
                {selectedVariant.compareAtPrice && (
                  <p className={`${classes.compare} secondary--body`}>
                    ${formatPrice(selectedVariant.compareAtPrice * 100)}
                  </p>
                )}
                <p className="secondary--body">${formatPrice(selectedVariant.price * 100)}</p>
              </div>
              {selectedVariant.weight && <p className={`${classes["weight"]} secondary--body`}>
                {formatWeight(selectedVariant.weight)}lbs
              </p>}
            </div>

            {includesMetafield && <p className={`${classes['metafield']} base-font`}>{includesMetafield.value}</p>}
            {shortDescriptionMetafield && <p className={`${classes['metafield']} base-font`}>{shortDescriptionMetafield.value}</p>}
          </div>
          <a onClick={() => handleLink(product)} className="btn salmon">{buttonText}</a>
        </div>

      </div>
    )
  );
}

export default ProductCard;
