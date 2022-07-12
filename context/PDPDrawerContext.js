import { createContext, useContext, useReducer, useEffect } from 'react'
import { nacelleClient } from 'services'
import PDPDrawer from '@/components/Layout/PDPDrawer'
import { useRouter } from 'next/router'
import { GET_PRODUCTS } from '../gql'

const PDPDrawerContext = createContext()

function boxReducer(state, action) {
  switch (action.type) {
    case 'open_drawer': {
      return {
        ...state,
        isOpen: true,
        activeProductHandle: action.payload
      };
    }
    case 'close_drawer': {
      return {
        ...state,
        isOpen: false,
        activeProductHandle: null
      };
    }
    case 'add_box_data': {
      return {
        ...state,
        boxManager: action.payload
      };
    }
    default:
      return state;
  }
}

const initialState = {
  isOpen: false,
  activeProductHandle: null,
  boxManager: {}
};

export function usePDPDrawerContext() {
  return useContext(PDPDrawerContext)
}

export function PDPDrawerProvider({ children }) {

  const router = useRouter()
  const [state, dispatch] = useReducer(boxReducer, initialState)
  const { isOpen, activeProductHandle, boxManager } = state

  const updateParam = () => {
    if (router.pathname === '/pages/choose-your-plan' && router.isReady) {
      router.replace({
        pathname: '/pages/choose-your-plan',
        query: (activeProductHandle ? { expand: activeProductHandle } : undefined)
      }, undefined, { shallow: true })
    }
  }

  const openDrawer = async (productData) => {
    const productHandle = productData.content.handle
    dispatch({ type: 'open_drawer', payload: productHandle})
    if (!boxManager[productHandle]) {
      const boxDetails = await nacelleClient.content({
        handles: [productHandle],
        type: 'boxDetails'
      })
      const updatedBoxManager = {
        ...boxManager,
        [productHandle]: {
          product: productData,
          boxDetails: boxDetails[0],
        }
      }
      dispatch({ type: 'add_box_data', payload: updatedBoxManager })
    }
  }

  useEffect(() => {
    if (isOpen) document.querySelector('html').classList.add('disable-scroll')
    if (!isOpen) document.querySelector('html').classList.remove('disable-scroll')
    updateParam()
  }, [isOpen])

  // triggers pdp flyout on page load if url has a param of expand
  useEffect(() => {
    async function onLoad(productHandle) {
      const { products } = await nacelleClient.query({
        query: GET_PRODUCTS,
        variables: {
          "filter": {
            "handles": [productHandle]
          }
        }
      })
      if (products.length) {
        openDrawer(products[0])
      }
    }
    if (router.isReady && router.query?.expand) {
      onLoad(router.query.expand)
    }
  }, [router.isReady])

  useEffect(() => {
    if (router.query.expand) {
      dispatch({ type: 'open_drawer', payload: router.query.expand})
    }
    router.beforePopState(({ as }) => {
      dispatch({ type: 'close_drawer' })
      return true
    })
    return () => {
      router.beforePopState(() => true);
    }
  }, [router])

  return (
    <PDPDrawerContext.Provider value={{isOpen, openDrawer, boxManager, activeProductHandle, dispatch}}>
      {isOpen &&
        <PDPDrawer box={boxManager[activeProductHandle]} />
      }
      {children}
    </PDPDrawerContext.Provider>
  )
}