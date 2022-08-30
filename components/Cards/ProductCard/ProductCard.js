import { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive'
import Image from "next/image";
import classes from "./ProductCard.module.scss";
import { useRouter } from 'next/router'
import { dataLayerSelectProduct } from "@/utils/dataLayer";
import { formatPrice } from "@/utils/formatPrice";

function ProductCard({ product }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const isMobile =  useMediaQuery({ query: '(max-width: 430px)' })
  const isDesktop = useMediaQuery({query: '(min-width: 430px)'})
  const firstVariant = product.variants[0]

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

  return (
    product && (
      <div className={classes["card"]}>
        {splitFlagTag && <div className={`${classes['best-seller']} best-seller`}>{splitFlagTag}</div>}
        <div className={classes['card__inner']}>
        <a onClick={() => handleLink(product)} className={classes["media"]}>
          {product.content.featuredMedia && isMobile && mounted && (
            <Image
            src={product.content.featuredMedia.src}
            alt={product.content.featuredMedia.altText}
            width={430}
            height={278}
            className={classes.image}
          />
          )}
          {product.content.featuredMedia && isDesktop && mounted && (
              <Image
              src={product.content.featuredMedia.src}
              alt={product.content.featuredMedia.altText}
              width={650}
              height={350}
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
              {firstVariant.compareAtPrice && (
                <p className={`${classes.compare} secondary--body`}>
                  ${formatPrice(firstVariant.compareAtPrice * 100)}
                </p>
              )}
              <p className="secondary--body">${formatPrice(firstVariant.price * 100)}</p>
            </div>
            {firstVariant.weight && <p className={`${classes["weight"]} secondary--body`}>
              {firstVariant.weight}lbs
            </p>}
          </div>

          {includesMetafield && <p className={`${classes['metafield']} base-font`}>{includesMetafield.value}</p>}
          {shortDescriptionMetafield && <p className={`${classes['metafield']} base-font`}>{shortDescriptionMetafield.value}</p>}
        </div>
        </div>


        <a onClick={() => handleLink(product)} className="btn salmon">View Details</a>

      </div>
    )
  );
}

export default ProductCard;
