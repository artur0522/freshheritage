export const transformEdges = (object, field) => {
  if (field == null) {
    return object.edges.map((edge) => {
      return edge.node
    })
  } else {
    return object.edges.map((edge) => {
      return edge.node[field]
    })
  }
}

export const CUSTOMER_ACCESS_TOKEN_CREATE = `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    userErrors {
      field
      message
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
  }
}`

export const CUSTOMER_ACCESS_TOKEN_DELETE = `mutation customerAccessTokenDelete($customerAccessToken: String!) {
  customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
    deletedAccessToken
    deletedCustomerAccessTokenId
    userErrors {
      field
      message
    }
  }
}`

export const GET_CUSTOMER = `query getCustomer($customerAccessToken: String!) {
  customer(customerAccessToken: $customerAccessToken) {
    id
    email
    acceptsMarketing
    createdAt
    updatedAt
    displayName
    lastName
    firstName
    phone
    tags
    defaultAddress {
      address1
      address2
      city
      company
      country
      countryCodeV2
      firstName
      formatted
      formattedArea
      id
      lastName
      latitude
      longitude
      name
      phone
      province
      provinceCode
      zip
    }
    addresses (first: 50) {
      edges {
        node {
          address1
          address2
          city
          company
          country
          countryCodeV2
          firstName
          formatted
          formattedArea
          id
          lastName
          name
          phone
          province
          provinceCode
          zip
        }
      }
    }
  }
}`

export const CUSTOMER_CREATE = `mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      id
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`

export const CUSTOMER_RECOVER = `mutation customerRecover($email: String!) {
  customerRecover(email: $email) {
    customerUserErrors {
      code
      field
      message
    }
  }
}`

export const CUSTOMER_RESET = `mutation customerReset($id: ID!, $input: CustomerResetInput!) {
  customerReset(id: $id, input: $input) {
    customer {
      id
      email
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`

export const GET_PRODUCTS = `query products($filter: ProductFilterInput) {
  products(filter: $filter){
    nacelleEntryId
    sourceEntryId
    sourceId
    availableForSale
    productType
    tags
    metafields {
      id
      key
      namespace
      value
    }
    content {
      nacelleEntryId
      sourceEntryId
      sourceId
      handle
      title
      description
      metafields {
        namespace
        value
        key
      }
      options {
        name
        values
      }
      featuredMedia {
        altText
        id
        src
        thumbnailSrc
        type
      }
      media {
        id
        src
        thumbnailSrc
        altText
      }
    }
    variants {
      nacelleEntryId
      sourceEntryId
      sku
      availableForSale
      price
      compareAtPrice
      weight
      productHandle
      quantityAvailable
      metafields {
        namespace
        value
        key
      }
      content {
        title
        variantEntryId
        selectedOptions {
          name
          value
        }
        featuredMedia {
          src
          thumbnailSrc
          altText
        }
      }
    }
  }
}`;