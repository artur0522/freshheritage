import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@nacelle/react-hooks";
import { getSelectedVariant } from "utils/getSelectedVariant";
import { getCartVariant } from "utils/getCartVariant";
import classes from "./ProductCard.module.scss";

function ProductCard({ product }) {
  console.log("productcard", product);
  const [, { addToCart }] = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedOptions, setSelectedOptions] = useState(
    selectedVariant.content.selectedOptions
  );

  let options = null;
  if (product?.content?.options?.some((option) => option.values.length > 1)) {
    options = product?.content?.options;
  }

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
        <Link href={`/products/${encodeURIComponent(product.content.handle)}`}>
          <a className={classes["media"]}>
            {product.content.featuredMedia ? (
              <Image
                src={product.content.featuredMedia.src}
                alt={product.content.featuredMedia.altText}
                width={650}
                height={350}
                className={classes.image}
              />
            ) : (
              <div>No Image</div>
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
            <p className={`${classes["weight"]} secondary--body`}>
              {selectedVariant.weight}lbs
            </p>
          </div>

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

        <Link href={`products/${product.content?.handle}`}>
          <a className="btn salmon">View Details</a>
        </Link>
      </div>
    )
  );
}

export default ProductCard;
