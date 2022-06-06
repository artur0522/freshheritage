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
