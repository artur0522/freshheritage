import { createContext, useContext, useState, useEffect } from 'react'
import { accountClientPost } from '@/utils/account';
import { CUSTOMER_ACCESS_TOKEN_CREATE, GET_CUSTOMER, CUSTOMER_CREATE } from '@/gql/index.js';
import * as Cookies from 'es-cookie';

const CustomerContext = createContext()

export function useCustomerContext() {
  return useContext(CustomerContext)
}

export function CustomerProvider({ children }) {

  const [customer, setCustomer] = useState(null)

  useEffect(() => {
    const customerAccessToken = Cookies.get('customerAccessToken')
    console.log("customerAccessToken:", customerAccessToken)
    if (customerAccessToken) {
      setCustomer(JSON.parse(customerAccessToken))
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

  async function login({ email, password }) {
    const { customerAccessTokenCreateErrors, customerAccessTokenCreate } = await createCustomerAccessToken({email, password})
    if (customerAccessTokenCreateErrors) {
      return { errors: customerAccessTokenCreateErrors }
    }
    if (customerAccessTokenCreate.userErrors.length) {
      return { errors: customerAccessTokenCreate.userErrors }
    }
    const customerAccessToken = customerAccessTokenCreate.customerAccessToken
    const response = await accountClientPost({
      query: GET_CUSTOMER,
      variables: {
        customerAccessToken: customerAccessToken.accessToken
      }
    })
    const { data, errors } = response
    if (errors && errors.length) {
      return { errors: errors }
    }
    if (data?.customer) {
      // set cookie with expiration date
      Cookies.set('customerAccessToken', JSON.stringify(data.customer), { expires: new Date(customerAccessToken.expiresAt), path: '/' })
      setCustomer(data.customer)
    }
    return { data }
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
    <CustomerContext.Provider value={{customer, setCustomer, login, register}}>
      {children}
    </CustomerContext.Provider>
  )
}