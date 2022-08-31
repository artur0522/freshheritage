import { useEffect } from "react";
import { useRouter } from "next/router";
import { nacelleClient } from "services";

import ProductCard from "@/components/Cards/ProductCard/ProductCard";
import PageSEO from "@/components/SEO/PageSEO";
import { dataLayerViewProductList } from "@/utils/dataLayer";

import classes from "./Collection.module.scss";

function Collection(props) {
  const router = useRouter();
  const { collection, products } = props;

  useEffect(() => {
    dataLayerViewProductList({products, url: router.asPath})
  }, [])

  return (
    collection && (
      <div className={`${classes["collection"]} container`}>
        <PageSEO collection={collection} />
        <div className={classes["collection__header"]}>
          {collection.content?.title && <h1>{collection.content.title}</h1>}
          {collection.content?.description && (
            <h3>{collection.content.description}</h3>
          )}
        </div>
        <div className={classes["collection__list"]}>
          {products.map((product, index) => (
            <ProductCard product={product} key={`${product.id}-${index}`} />
          ))}
        </div>
      </div>
    )
  );
}

export default Collection;

export async function getStaticPaths() {
  // Performs a GraphQL query to Nacelle to get product collection handles.
  // (https://nacelle.com/docs/querying-data/storefront-sdk)
  const results = await nacelleClient.query({
    query: HANDLES_QUERY,
  });
  const handles = results.productCollections
    .filter((collection) => collection.content?.handle)
    .map((collection) => ({ params: { handle: collection.content.handle } }));

  return {
    paths: handles,
    fallback: "blocking",
  };
}

export async function getStaticProps({ params }) {
  // Performs a GraphQL query to Nacelle to get product collection data,
  // using the handle of the current page.
  // (https://nacelle.com/docs/querying-data/storefront-sdk)
  const { productCollections } = await nacelleClient.query({
    query: PAGE_QUERY,
    variables: { handle: params.handle },
  });

  if (!productCollections.length) {
    return {
      notFound: true,
    };
  }

  const { products, ...rest } = productCollections[0];
  return {
    props: {
      collection: rest,
      products,
    },
  };
}

// GraphQL fragment of necessary product data.
// (https://nacelle.com/docs/querying-data/storefront-api)
const PRODUCT_FRAGMENT = `
  nacelleEntryId
  sourceEntryId
  content{
    handle
    title
    options{
      name
      values
    }
    featuredMedia{
      src
      thumbnailSrc
      altText
    }
  }
  tags
  metafields {
    id
    key
    namespace
    value
  }
  variants{
    nacelleEntryId
    sourceEntryId
    sku
    availableForSale
    price
    compareAtPrice
    weight
    content{
      title
      selectedOptions{
        name
        value
      }
      featuredMedia{
        src
        thumbnailSrc
        altText
      }
    }
  }
`;

// GraphQL query for the handles of product collections.
// Used in `getStaticPaths`.
// (https://nacelle.com/docs/querying-data/storefront-api)
const HANDLES_QUERY = `
  {
    productCollections {
      content {
        handle
      }
    }
  }
`;

// GraphQL query for product collection content and initial products.
// Used in `getStaticProps`.
// (https://nacelle.com/docs/querying-data/storefront-api)
const PAGE_QUERY = `
  query CollectionPage($handle: String!){
    productCollections(filter: { handles: [$handle] }){
      nacelleEntryId
      sourceEntryId
      content{
        title
        description
        handle
      }
      products(first: 25){
        ${PRODUCT_FRAGMENT}
      }
    }
  }
`;

// GraphQL query for paginated products within a collection.
// Used in `handleFetch`.
// (https://nacelle.com/docs/querying-data/storefront-api)
const PRODUCTS_QUERY = `
  query CollectionProducts($handle: String!, $after: String!){
    productCollections(filter: { handles: [$handle] }){
      products(first: 24, after: $after){
        ${PRODUCT_FRAGMENT}
      }
    }
  }
`;
