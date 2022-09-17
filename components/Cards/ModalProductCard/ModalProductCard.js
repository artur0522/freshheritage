import { useState, useEffect } from "react"
import { useMediaQuery } from 'react-responsive'
import Link from "next/link"
import ResponsiveImage from "@/components/ResponsiveImage"
import classes from "./ModalProductCard.module.scss"

function ModalProductCard({ product }) {

  const [mounted, setMounted] = useState(false)

  const isMobile =  useMediaQuery({ query: '(max-width: 430px)' })
  const isDesktop = useMediaQuery({query: '(min-width: 430px)'})

  useEffect(() => {
    setMounted(true)
  }, [])

  const articleCardImgLoader = ({ src, width }) => {
    return `${src}?w=690`
  }

  return (
    product && (
      <div className={classes["card"]}>
        <div className={classes['card__inner']}>
            <div className={classes['card__image']}>
                <Link href={`/products/${encodeURIComponent(product.handle)}`}>
                <a className={classes["media"]}>
                    {product.product_image && isMobile && mounted && (
                    <ResponsiveImage
                    loader={articleCardImgLoader}
                    src={product.product_image}
                    alt={product.title}
                    className={classes.image}
                    />
                    )}
                    {product.product_image && isDesktop && mounted && (
                    <ResponsiveImage
                    loader={articleCardImgLoader}
                    src={product.product_image}
                    alt={product.title}
                    className={classes.image}
                    />
                    )}
                </a>
                </Link>
            </div>

            <div className={classes["card__content"]}>
                {product.title && (
                    <h4
                    className={`${classes["title"]} heading--product-title uppercase`}
                    >
                    {product.title}
                    </h4>
                )}

                <div className={classes["price-wrap"]}>
                    <div className={classes["price"]}>
                    <p className="secondary--body">${product.price}</p>
                    </div>
                    {product.weight && <p className={`${classes["weight"]} secondary--body`}>
                    {product.weight}
                    </p>}
                </div>

                <Link href={`/products/${encodeURIComponent(product.handle)}`}>
                  <a className="btn salmon">View Details</a>
                </Link>
            </div>
        </div>
      </div>
    )
  )
}

export default ModalProductCard
