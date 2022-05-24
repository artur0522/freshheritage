import { createContext, useContext, useState, useEffect } from 'react'
import { accountClientPost } from '@/utils/account'
import { CUSTOMER_ACCESS_TOKEN_CREATE, GET_CUSTOMER, CUSTOMER_CREATE } from '@/gql/index.js'
import * as Cookies from 'es-cookie'

const CustomerContext = createContext()

export function useCustomerContext() {
  return useContext(CustomerContext)
}

export function CustomerProvider({ children }) {

  const [customer, setCustomer] = useState(null)
  const [customerLoading, setCustomerLoading] = useState(false);

  useEffect(() => {
    const customerAccessToken = Cookies.get('customerAccessToken')
    // console.log("customerAccessToken:", customerAccessToken)
    if (customerAccessToken) {
      getCustomer({ accessToken: customerAccessToken })
    }
  }, [])

  async function createCustomerAccessToken({ email, password }) {
    const response = await accountClientPost({
      query: CUSTOMER_ACCESS_TOKEN_CREATE,
      variables: {
        input: {
          email,
          password
        }
      }
    })
    const { data, errors } = response
    if (errors && errors.length) {
      return { customerAccessTokenCreateErrors: errors }
    }
    return { customerAccessTokenCreate: data.customerAccessTokenCreate }
  }

  async function getCustomer({accessToken, expiresAt}) {
    setCustomerLoading(true);
    const response = await accountClientPost({
      query: GET_CUSTOMER,
      variables: {
        customerAccessToken: accessToken
      }
    })
    const { data, errors } = response
    setCustomerLoading(false);
    if (errors && errors.length) {
      return { errors: errors }
    }
    if (data?.customer && expiresAt) {
      Cookies.set('customerAccessToken', accessToken, { expires: new Date(expiresAt), path: '/' })
    }

    const { customer } = data;

    // TODO: might need to turn this into a useReducer instead of using useState above
    if (data.customer.tags.length) {
      if (data.customer.tags.some(tag => ['member monthly', 'member prepaid'].includes(tag))) {
        customer.is_member = true
      } else {
        customer.is_member = false
      }
    }

    setCustomer(customer)
    console.log("customer:", customer)
    return { data }
  }

  async function login({ email, password }) {
    const { customerAccessTokenCreateErrors, customerAccessTokenCreate } = await createCustomerAccessToken({email, password})
    if (customerAccessTokenCreateErrors) {
      return { errors: customerAccessTokenCreateErrors }
    }
    if (customerAccessTokenCreate.userErrors.length) {
      return { errors: customerAccessTokenCreate.userErrors }
    }
    const customerAccessToken = customerAccessTokenCreate.customerAccessToken
    return getCustomer({
      accessToken: customerAccessToken.accessToken,
      expiresAt: customerAccessToken.expiresAt
    })
  }

  async function register({ firstName, lastName, email, password }) {
    const response = await accountClientPost({
      query: CUSTOMER_CREATE,
      variables: {
        input: {
          firstName,
          lastName,
          email,
          password
        }
      }
    })
    const { data, errors } = response
    if (errors && errors.length) {
      return { errors: errors }
    }
    const { customerUserErrors } = data.customerCreate
    return { data, errors: customerUserErrors }
  }

  return (
    <CustomerContext.Provider value={{customer, setCustomer, customerLoading, login, register}}>
      {children}
    </CustomerContext.Provider>
  )
}