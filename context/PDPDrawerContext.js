import { createContext, useContext, useState, useReducer, useEffect } from 'react'
import { nacelleClient } from 'services'
import PDPDrawer from '@/components/Layout/PDPDrawer'

const PDPDrawerContext = createContext()

export function usePDPDrawerContext() {
  return useContext(PDPDrawerContext)
}

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

export function PDPDrawerProvider({ children }) {

  const [state, dispatch] = useReducer(boxReducer, initialState)
  const { isOpen, activeProductHandle, boxManager } = state

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
  }, [isOpen])

  return (
    <PDPDrawerContext.Provider value={{isOpen, openDrawer, boxManager, activeProductHandle, dispatch}}>
      {isOpen &&
        <PDPDrawer box={boxManager[activeProductHandle]} />
      }
      {children}
    </PDPDrawerContext.Provider>
  )
}