
export function accountFormReducer(state, action) {
  switch (action.type) {
    case 'loading': {
      return {
        ...state,
        showSuccessMessage: false,
        showErrorMessage: false,
        isLoading: true,
      }
    }
    case 'success': {
      return {
        ...state,
        showSuccessMessage: true,
        showErrorMessage: false,
        errorMessage: '',
        isLoading: false,
      }
    }
    case 'error': {
      return {
        ...state,
        showSuccessMessage: false,
        showErrorMessage: true,
        errorMessage: action.payload,
        isLoading: false,
      }
    }
    default:
      return state
  }
}

export const initialState = {
  showSuccessMessage: false,
  showErrorMessage: false,
  errorMessage: '',
  isLoading: false,
}

export async function accountClientPost({
  query,
  variables
}) {
  const url = `https://${process.env.NEXT_PUBLIC_MYSHOPIFY_DOMAIN}/api/2022-04/graphql`
  const body = JSON.stringify({ query, variables })

  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_ACCESS_TOKEN
    },
    body
  })
  return response.json()
}