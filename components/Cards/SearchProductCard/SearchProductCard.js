import { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive'
import Link from "next/link";
import Image from "next/image";
import classes from "./SearchProductCard.module.scss";

function ProductCard({ product }) {
  
  const [mounted, setMounted] = useState(false)
  
  const isMobile =  useMediaQuery({ query: '(max-width: 430px)' })
  const isDesktop = useMediaQuery({query: '(min-width: 430px)'})

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    product && (
      <div className={classes["card"]}>
        <div className={classes['card__inner']}>
        <Link href={`/products/${encodeURIComponent(product.handle)}`}>
          <a className={classes["media"]}>
            {product.product_image && isMobile && mounted && (
              <Image
              src={product.product_image}
              alt={product.title}
              width={430}
              height={278}
              className={classes.image}
            />
            )}
            {product.product_image && isDesktop && mounted && (
               <Image
               src={product.product_image}
               alt={product.title}
               width={650}
               height={350}
               className={classes.image}
             />
            )}
          </a>
        </Link>

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

        </div>
        </div>

        <Link href={`/products/${encodeURIComponent(product.handle)}`}>
          <a className="btn salmon">View Details</a>
        </Link>
      </div>
    )
  );
}

export default ProductCard;
