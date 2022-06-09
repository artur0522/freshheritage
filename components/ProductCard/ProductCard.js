import { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive'
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@nacelle/react-hooks";
import { getSelectedVariant } from "utils/getSelectedVariant";
import { getCartVariant } from "utils/getCartVariant";
import classes from "./ProductCard.module.scss";

function ProductCard({ product }) {
  const [, { addToCart }] = useCart();
  const [mounted, setMounted] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedOptions, setSelectedOptions] = useState(
    selectedVariant.content.selectedOptions
  );
  const isMobile =  useMediaQuery({ query: '(max-width: 736px)' })
  const isDesktop = useMediaQuery({query: '(min-width: 737px)'})

  console.log(product)

  useEffect(() => {
    setMounted(true)
  }, [])

  let options = null;
  if (product?.content?.options?.some((option) => option.values.length > 1)) {
    options = product?.content?.options;
  }

  const includesMetafield = product.metafields.find(metafield => metafield.key === 'includes')
  const shortDescriptionMetafield = product.metafields.find(metafield => metafield.key === 'short_description')
  const flagTag = product.tags.find(tag => tag.includes("Flag"))
  const splitFlagTag = flagTag?.split(":")[1]

  const buttonText = selectedVariant
    ? selectedVariant.availableForSale
      ? "Add To Cart"
      : "Sold Out"
    : "Select Option";

  const handleOptionChange = (event, option) => {
    const newOption = { name: option.name, value: event.target.value };
    const optionIndex = selectedOptions.findIndex((selectedOption) => {
      return selectedOption.name === newOption.name;
    });

    const newSelectedOptions = [...selectedOptions];
    if (optionIndex > -1) {
      newSelectedOptions.splice(optionIndex, 1, newOption);
      setSelectedOptions([...newSelectedOptions]);
    } else {
      setSelectedOptions([...newSelectedOptions, newOption]);
    }
    const variant = getSelectedVariant({
      product,
      options: newSelectedOptions,
    });
    setSelectedVariant(variant ? { ...variant } : null);
  };

  // Get product data and add it to the cart by using `addToCart`
  // from the `useCart` hook provided by `@nacelle/react-hooks`.
  // (https://github.com/getnacelle/nacelle-react/tree/main/packages/react-hooks)
  const handleAddItem = () => {
    const variant = getCartVariant({
      product,
      variant: selectedVariant,
    });
    addToCart({
      variant,
      quantity: 1,
    });
  };

  return (
    product && (
      <div className={classes["card"]}>
        {splitFlagTag && <div className={`${classes['best-seller']} best-seller`}>{splitFlagTag}</div>}
        <div className={classes['card__inner']}>
        <Link href={`/products/${encodeURIComponent(product.content.handle)}`}>
          <a className={classes["media"]}>
            {product.content.featuredMedia && isMobile && mounted && (
              <Image
                src={product.content.featuredMedia.src}
                alt={product.content.featuredMedia.altText}
                width={650}
                height={350}
                className={classes.image}
              />
            )} 
            {product.content.featuredMedia && isDesktop && mounted && (
              <Image
                src={product.content.featuredMedia.src}
                alt={product.content.featuredMedia.altText}
                width={430}
                height={278}
                className={classes.image}
              />
            )} 
          </a>
        </Link>

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
                  ${selectedVariant.compareAtPrice}
                </p>
              )}
              <p className="secondary--body">${selectedVariant.price}</p>
            </div>
            {selectedVariant.weight && <p className={`${classes["weight"]} secondary--body`}>
              {selectedVariant.weight}lbs
            </p>}
          </div>

          {includesMetafield && <p className={`${classes['metafield']} base-font`}>{includesMetafield.value}</p>}
          {shortDescriptionMetafield && <p className={`${classes['metafield']} base-font`}>{shortDescriptionMetafield.value}</p>}

          {options &&
            options.map((option, oIndex) => (
              <div key={oIndex}>
                <label htmlFor={`select-${oIndex}-${product.id}`}>
                  {option.name}
                </label>
                <select
                  id={`select-${oIndex}-${product.id}`}
                  onChange={($event) => handleOptionChange($event, option)}
                >
                  {option.values.map((value, vIndex) => (
                    <option key={vIndex} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
        </div>

        <Link href={`products/${product.content?.handle}`}>
          <a className="btn salmon">View Details</a>
        </Link>
      </div>
    )
  );
}

export default ProductCard;
